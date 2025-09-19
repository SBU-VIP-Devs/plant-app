import React from 'react';
import { FlatList, Text, View, RefreshControl, Pressable, StyleSheet, Alert } from 'react-native';
import { useState, useEffect, useId } from 'react';
import { doc, getDoc, getDocs, collection, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { FIRESTORE_DB } from '../../firebaseconfig';
import { GardenSettingsProps } from './gardensettings';
import { TaskRequestProps } from '../../components/TaskRequestCard';
import TaskRequestCard from '../../components/TaskRequestCard';


// for ONE garden...need to scan thru all the tasks and get all the uid requests

export default function TaskRequests({ gardenId, onRefresh }: GardenSettingsProps & { onRefresh?: () => void }) {


  // TO CONVERT UID TO ACTUAL USERNAMES (in case they change their usernames)
  async function readNameAsString(uid: string | undefined): Promise<string> {
    try {
        if (!uid) return "No Name";
        const docRef = doc(FIRESTORE_DB, `users/${uid}`);
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();
        return data?.username || "No Name";
    } catch (e) {
      console.log(e);
      return "No Name";
    }
  }

  // TO RENDER THE LISTS
  const [taskRequests, setTaskRequests] = useState<TaskRequestProps[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTaskRequests = async () => {
    try {
      const querySnapshot = await getDocs(collection(FIRESTORE_DB, `garden-post-info/${gardenId}/garden-tasks`));
      let requests: TaskRequestProps[] = [];

      querySnapshot.forEach((doc) => {
        const { taskName, taskTime, uidRequests } = doc.data();

        if (uidRequests && Array.isArray(uidRequests)) {
          uidRequests.forEach(async (requester: string) => {
            const uidToUsername = await readNameAsString(requester);
            const id = Math.random().toString(36).substring(2, 9);
            // console.log(uidToUsername)
            // console.log(id)
            requests.push({
              id: id,
              taskName,
              taskTime,
              taskId: doc.id,
              requesterId: requester,
              requesterName: uidToUsername,
            });
          });
        }
      });

      // TODO: this is a quick hot fix, need to make something better
      await new Promise((resolve) => setTimeout(resolve, 100));
      setTaskRequests(requests);

      if(loading) {
        setLoading(false)
      }

    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }

  useEffect(() => {
    fetchTaskRequests();
  }, []);

  // Refresh function that can be called from parent
  const refreshTaskRequests = () => {
    fetchTaskRequests();
    if (onRefresh) {
      onRefresh();
    }
  };

  //REMOVE UID FROM REQUEST LIST
  async function removeFromRequested(uid: string | undefined, taskId: string) {
    try {
      const docRef = doc(FIRESTORE_DB, `garden-post-info/${gardenId}/garden-tasks/${taskId}`)
      
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();
      const currentRequests = data?.uidRequests;
      if(currentRequests[0] === "\0") {
        await updateDoc(docRef, {
          uidRequests: [uid],
        });
      } else {
        await updateDoc(docRef, {
          uidRequests: arrayRemove(uid),
        });
      }
      
      console.log('User removed from array correctly.', docRef.id)
      Alert.alert('Task declined successfully!')
    } catch(e) {
      console.log(e)
      console.log("may be invalid user.")
    }
    refreshTaskRequests()
  }


  //ADD UID TO ASSIGNED LIST
  async function addToAssigned(uid: string | undefined, taskId: string) {
      try {
        const docRef = doc(FIRESTORE_DB, `garden-post-info/${gardenId}/garden-tasks/${taskId}`)
        
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();
        const currentRequests = data?.uidAssigned;
        if(currentRequests[0] === "\0") {
          await updateDoc(docRef, {
            uidAssigned: [uid],
          });
        } else {
          await updateDoc(docRef, {
            uidAssigned: arrayUnion(uid),
          });
        }
        
        console.log('User added to assigned array correctly.', docRef.id)
        Alert.alert('Task assigned successfully!')
      } catch(e) {
        console.log(e)
        console.log("may be invalid user.")
      }
      refreshTaskRequests()
    }


  return (
    <FlatList
      data={taskRequests}
      renderItem={({item}: {item: TaskRequestProps}) => (
        <View style={styles.requestCardContainer}>
          <View style={styles.requestCard}>
            <TaskRequestCard id={item.id} requesterName={item.requesterName} requesterId={item.requesterId} taskTime={item.taskTime} taskName={item.taskName} taskId={item.taskId}/>
            <View style={styles.buttonContainer}>  
                <Pressable style={styles.button} onPress={async () => {
                  await removeFromRequested(item.requesterId, item.taskId);
                  await addToAssigned(item.requesterId, item.taskId);
                  console.log('accepted users task request')
                }}>
                    <Text style={styles.darkSubtitle}>Accept</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={async () => {
                  await removeFromRequested(item.requesterId, item.taskId);
                  console.log('denied users task request')
                }}>
                    <Text style={styles.darkSubtitle}>Deny</Text>
                </Pressable>
            </View> 
          </View>
        </View>
      )}
      keyExtractor={item => item.id}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.horizontalList}
    />
  );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        backgroundColor: '#84a98c',
        borderRadius: 10,
        marginBottom: 20,
        paddingTop: 10,
        paddingBottom: 10,
        
    },
    horizontalList: {
        paddingHorizontal: 10,
    },
    requestCardContainer: {
        marginRight: 15,
        width: 300,
    },
    requestCard: {
        flexDirection: 'column',
        backgroundColor: '#84a98c',
        padding: 17,
        borderRadius: 15,
        minHeight: 120,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    darkSubtitle: {
        fontFamily: 'Quicksand-Regular',
        color: '#2f3e46',
        fontSize: 15,
    },

    button: {
        alignItems: 'center',
        borderRadius: 30,
        backgroundColor: '#52796f',
        width: 80,
        padding: 8,
        margin: 4,
    },
})
