import React, { useEffect } from 'react'
import { Button, View, Text, Image, Pressable } from 'react-native';
import { GardenData } from '../app/(tabs)/gardens';
import { FIREBASE_AUTH } from '../firebaseconfig';
import { CommonStyles } from '../styles';
import { Colors, FontFamily, FontSizes, Spacing, BorderRadius } from '../constants';

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
            <View style={CommonStyles.header}>
                <Image
                    style={CommonStyles.avatarImage}
                    source={{ uri: item.userImage }}
                />
                <View style={CommonStyles.headerText}>
                    <Text style={CommonStyles.darkTitle}>{item.gardenName}</Text>
                    <Text style={CommonStyles.darkSubtitle}>administrated by {item.username}</Text>
                </View>
            </View>
            <Text style={CommonStyles.descriptionText}>
                {item.desc}
            </Text>
            {item.imageURL ?
            <Image
                style={CommonStyles.gardenImage}
                source={{ uri: item.imageURL }}
                onError={(e) => console.log('Image Load Error:', e.nativeEvent.error)}
            /> :
            <View style={{borderWidth: 0.5, borderColor: Colors.darkText, marginLeft: Spacing.base, marginRight: Spacing.base}}/>
            }
            {/* <View style={{ alignItems: 'center', padding: 15, flexDirection: 'row'}}>
                {!item.joined ?
                    <Pressable style={CommonStyles.accentButton} onPress={() => console.log('join garden')}>
                        <Text style={CommonStyles.darkTitle}>Join Garden</Text>
                        <Text style={CommonStyles.darkSubtitle}>{memberText}</Text>
                    </Pressable> :
                    <Pressable style={CommonStyles.darkButton} onPress={() => console.log('leave garden')}>
                        <Text style={CommonStyles.lightTitle}>Leave Garden</Text>
                        <Text style={CommonStyles.lightSubtitle}>{memberText}</Text>
                    </Pressable>
                }
                {(userId?item.roles[userId]==="admin":false) ?
                <Pressable style={CommonStyles.darkButton} onPress={() => console.log('open modal of settings')}>
                    <Text style={CommonStyles.lightTitle}>Garden Settings</Text>
                    <Text style={CommonStyles.lightSubtitle}>delete garden</Text>
                </Pressable> : null}
            </View> */}
        </>
    )
}