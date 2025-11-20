import React, { useEffect } from 'react'
import { Button, View, StyleSheet, Text, Image, Pressable, Dimensions } from 'react-native';
import { GardenData } from '../app/(tabs)/gardens';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../firebaseconfig';
import { TaskData } from '../app/inputscreens/gardentasklist';
import { formatDateRange } from '../app/inputscreens/newtask';
import { doc, getDoc } from "firebase/firestore";
import { useState } from 'react';

interface TaskCardProps {
    item: TaskData
}

export default function TaskCard({item}: TaskCardProps) {
    
    const user = FIREBASE_AUTH.currentUser;
    const username = user?.displayName ? user?.displayName : 'Unknown User'
    const userId = user ? user.uid : null

    function stringtoDates(isoString: string) { 
        const strings = isoString.split(" ")
        const date1 = new Date(strings[0]) 
        const date2 = new Date(strings[1])
        return formatDateRange(date1, date2)
    }

    const [requestNameList, setRequestNameList] = useState<string>("No one has requested this task.");
    const [assignedNameList, setAssignedNameList] = useState<string>("No one has been assigned to this task.");


    async function readNamesAsString(uids: (string | undefined)[]): Promise<string> {
        try {
          const namePromises = uids.map(async (uid) => {
            if (!uid) return "No Name";
            const docRef = doc(FIRESTORE_DB, `users/${uid}`);
            const docSnap = await getDoc(docRef);
            const data = docSnap.data();
            return data?.username || "No Name";
          });
      
          const names = await Promise.all(namePromises);
          return names.join(", "); // Join usernames into a single string
        } catch (e) {
          console.log(e);
          return "Error fetching names";
        }
      }

      useEffect(() => {
        const uidsRequests = item.uidRequests; 
        const uidsAssigned = item.uidAssigned; 
        const fetchNames = async () => {
          const namesR = await readNamesAsString(uidsRequests);
          const namesA = await readNamesAsString(uidsAssigned);
          setRequestNameList(namesR);
          setAssignedNameList(namesA);
        };
        fetchNames();
      }, []);

    

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerText}>
                    <Text style={styles.darkTitle}>{item.taskName}</Text>
                    <Text style={styles.darkSubtitle}>created by {item.username}</Text>
                    <Text style={styles.darkSubtitle}>{stringtoDates(item.taskTime)}</Text>
                    <Text style={styles.darkSubtitle}>{item.desc}</Text>
                    <Text style={styles.darkSubtitle}>{item.location}</Text>
                    <Text style={styles.darkTitle}>Assigned to: </Text>
                    {item.uidAssigned.length === 0 || item.uidAssigned[0]==="\0"?
                    <Text style={styles.noUserText}>No one has been assigned to this task.</Text>:
                    <View style={styles.userListContainer}>
                        {assignedNameList.split(", ").map((name, index) => (
                            <View key={index} style={styles.singleUserContainer}>
                                <Text style={styles.userText}>{name}</Text>
                            </View>
                        ))}
                    </View>}
                    <Text style={styles.darkTitle}>Requested by: </Text>
                    {item.uidRequests.length === 0 || item.uidRequests[0]==="\0"?
                    <Text style={styles.noUserText}>No one has requested this task.</Text>:
                    <View style={styles.userListContainer}>
                        {requestNameList.split(", ").map((name, index) => (
                            <View key={index} style={styles.singleUserContainer}>
                                <Text style={styles.userText}>{name}</Text>
                            </View>
                        ))}
                    </View>} 
                </View>
            </View>
        </View>
    )
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        backgroundColor: '#84a98c',
        borderRadius: 10,
        marginBottom: 20,
        paddingTop: 10,
        paddingBottom: 10,
        // width: screenWidth * 0.8
    },
    darkSubtitle: {
        fontFamily: 'Quicksand-Regular',
        color: '#2f3e46',
        fontSize: 13,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        padding: 15,
    },
    headerText: {
        flexDirection: 'column',
        justifyContent: 'center',
        marginLeft: 10,
    },
    darkTitle: {
        fontFamily: 'Quicksand-Bold',
        color: '#2f3e46',
        fontSize: 17,
    },
    userListContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 8,
        gap: 8,
    },
    singleUserContainer: {
        backgroundColor: '#52796f',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginBottom: 4,
    },
    userText: {
        fontFamily: 'Quicksand-Medium',
        color: '#2f3e46',
        fontSize: 12,
        textAlign: 'center',
    },
    noUserText: {
        fontFamily: 'Quicksand-Regular',
        color: '#2f3e46',
        fontSize: 13,
        marginVertical: 4,
    },
    assignedUser: {
        alignItems: 'center',
        borderRadius: 30,
        backgroundColor: '#52796f',
        padding: 8,
        margin: 8,
        width: '90%'
    },
    requestUser: {
        alignItems: 'center',
        borderRadius: 30,
        backgroundColor: '#cad2c5',
        padding: 8,
        margin: 8,
    }
  });