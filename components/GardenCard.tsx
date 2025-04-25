import React, { useEffect } from 'react'
import { Button, View, StyleSheet, Text, Image, Pressable } from 'react-native';
import { GardenData } from '../app/(tabs)/gardens';
import { FIREBASE_AUTH } from '../firebaseconfig';

interface GardenCardProps {
    item: GardenData
}

export default function 
({item}: GardenCardProps) {
    
    const user = FIREBASE_AUTH.currentUser;
    const username = user?.displayName ? user?.displayName : 'Unknown User'
    const userId = user ? user.uid : null

    //TODO:... implement item.isJoined to render buttons based on if youre in or not
    var memberText = 'default member text'

    //TODO: implement num member count
    // if(item.numMembers == 1) {
    //     memberText = '1 Member';
    // } else if(item.numMembers > 1) {
    //     memberText = item.numMembers + ' Members';
    // } else {
    //     memberText = 'No members yet'
    // }

    return (
        <>
            <View style={styles.header}>
                <Image 
                    style={styles.adminIcon} 
                    source={{ uri: item.userImage }}
                />
                <View style={styles.headerText}>
                    <Text style={styles.darkTitle}>{item.gardenName}</Text>
                    <Text style={styles.darkSubtitle}>administrated by {item.username}</Text>
                </View>
            </View>
            <Text style={styles.gardenDesc}>
                {item.desc}
            </Text>
            {item.imageURL ?
            <Image 
                style={styles.gardenImage} 
                source={{ uri: item.imageURL }}
                onError={(e) => console.log('Image Load Error:', e.nativeEvent.error)}
            /> :
            <View style={{borderWidth: 0.5, borderColor: '#2f3e46', marginLeft: 15, marginRight: 15}}/>
            }
            {/* <View style={{ alignItems: 'center', padding: 15, flexDirection: 'row'}}>
                {!item.joined ? 
                    <Pressable style={styles.joinButton} onPress={() => console.log('join garden')}>
                        <Text style={styles.darkTitle}>Join Garden</Text>
                        <Text style={styles.darkSubtitle}>{memberText}</Text>
                    </Pressable> :
                    <Pressable style={styles.leaveButton} onPress={() => console.log('leave garden')}>
                        <Text style={styles.lightTitle}>Leave Garden</Text>
                        <Text style={styles.lightSubtitle}>{memberText}</Text>
                    </Pressable>
                }
                {(userId?item.roles[userId]==="admin":false) ? 
                <Pressable style={styles.leaveButton} onPress={() => console.log('open modal of settings')}>
                    <Text style={styles.lightTitle}>Garden Settings</Text>
                    <Text style={styles.lightSubtitle}>delete garden</Text>
                </Pressable> : null}
            </View> */}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        backgroundColor: '#84a98c',
        width: '100%',
        borderRadius: 10,
        marginBottom: 20,
    },
    joinButton: {
        alignItems: 'center',
        borderRadius: 30,
        backgroundColor: '#52796f',
        width: '50%',
        padding: 8,
    },
    leaveButton: {
        alignItems: 'center',
        borderRadius: 30,
        backgroundColor: '#2f3e46',
        width: '50%',
        padding: 8,
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
    darkSubtitle: {
        fontFamily: 'Quicksand-Regular',
        color: '#2f3e46',
        fontSize: 13,
    },
    lightTitle: {
        fontFamily: 'Quicksand-Bold',
        color: '#52796f',
        fontSize: 17,
    },
    lightSubtitle: {
        fontFamily: 'Quicksand-Regular',
        color: '#52796f',
        fontSize: 13,
    },
    adminIcon: {
        width: 50,
        height: 50,
        borderRadius: 200,
        //borderWidth: 2,
        //borderColor: '#2f3e46',
    },
    gardenImage: {
        width: '100%',
        height: 250,
    },
    gardenDesc: {
        fontFamily: 'Quicksand-Medium',
        color: '#2f3e46',
        fontSize: 13,
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 15,
    }

  });