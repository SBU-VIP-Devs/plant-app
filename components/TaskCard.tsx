import React, { useEffect } from 'react'
import { Button, View, StyleSheet, Text, Image, Pressable } from 'react-native';
import { GardenData } from '../app/(tabs)/gardens';
import { FIREBASE_AUTH } from '../firebaseconfig';
import { TaskData } from '../app/(tabs)';

interface TaskCardProps {
    item: TaskData
}

export default function TaskCard({item}: TaskCardProps) {
    
    const user = FIREBASE_AUTH.currentUser;
    const username = user?.displayName ? user?.displayName : 'Unknown User'
    const userId = user ? user.uid : null

    function stringtoDates(isoString: string) {
        const strings = isoString.split(" ")

    }
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerText}>
                    <Text style={styles.darkTitle}>{item.taskName}</Text>
                    <Text style={styles.darkSubtitle}>created by {item.username}</Text>
                    <Text style={styles.darkSubtitle}>{item.taskTime}</Text>
                    <Text style={styles.darkSubtitle}>{item.desc}</Text>
                    <Text style={styles.darkSubtitle}>{item.location}</Text>
                </View>
            </View>
        </View>
    )
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
  });