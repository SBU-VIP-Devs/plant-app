// import 'react-native-gesture-handler';
// import 'expo-dev-client';
// import { FIREBASE_AUTH } from '../firebaseconfig';

import React, { useState } from 'react';
import { View, Text, Button, TouchableOpacity, TextInput } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Colors, BorderRadius, Spacing } from '../constants';
import db from '../services/database';

type Props = {
  onHide: () => void;
  onRefresh: () => void;
  oldbio: string | null;
  roleTags: {id: string; title: string}[];
};

export default function EditProfile({ onHide, onRefresh, oldbio, roleTags }: Props) {
    const [newBio, setNewBio] = useState(oldbio || '');
    const [newTag, setNewTag] = useState('');

    const bio = (text: string) => {
        setNewBio(text);
    };


    const updateBio = async () => {
        try {
            const userId = 'MwI8xB1YxoaP6sgVfGGs';
            await db.users.updateUserProfile(userId, {
                bio: newBio,
            });
            onRefresh();
            console.log('Bio updated successfully!');
        } catch (error) {
            console.error('Error updating Bio: ', error);
        }
    };

    const submit = async () => {
        // Await the asynchronous update to ensure it completes
        await updateBio();
        onHide(); // Close the modal
    };

    return (
        <View style={{padding: 20, height: '100%', width: '100%', alignItems: 'center', backgroundColor: '#cad2c5'}}>
            <View style={{width: '100%', height: '85%'}}>
                <View style={{ marginBottom: 10 }}>
                    <Text>Edit Bio: </Text>
                    <TextInput style={{borderWidth: 2, borderColor: '#84a98c'}} multiline={true} maxLength={150} placeholder= "Enter a new Bio" value={newBio} onChangeText={bio} />
                    <Text style={{ fontSize: 8 }}>-/150 characters left</Text>
                </View>
                <View style={{ marginBottom: 10 }}>
                    <Text>Click to delete</Text>
                                 {roleTags.map((role) => (
                                   <View key={role.id} style={{backgroundColor: "#52796f", alignSelf: 'flex-start', borderWidth:2}}>
                                     <Text style={{ color: "#cad2c5", fontWeight: "bold" }}>{String(role.title)}</Text>
                                   </View>
                                 ))}
                    <Text style={{ borderColor: '#84a98c', borderWidth: 2, margin: 5 }}>test{}</Text>

                </View>
                <View style={{ marginBottom: 10, }}>
                    <Text>Add Tag: </Text>
                    <TextInput style={{borderWidth: 2, borderColor: '#84a98c'}} multiline={true} maxLength={20} />
                    <Text style={{ fontSize: 8 }}>-/20 characters left</Text>

                </View>
                <Button title="Submit" onPress={submit} />
            </View>
        </View>
    );
}
