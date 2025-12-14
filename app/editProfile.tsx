// import 'react-native-gesture-handler';
// import 'expo-dev-client';
// import { FIREBASE_AUTH } from '../firebaseconfig';

import { FIRESTORE_DB } from '../firebaseconfig';
import { getFirestore, collection, QuerySnapshot, getDocs,  doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { FIREBASE_AUTH } from '../firebaseconfig';

type Props = {
  onHide: () => void;
  onRefresh: () => void;
  oldbio: string | null;
  oldYear: string | null;
  oldPronouns: string | null;
  roleTags: {id: string; title: string}[];
  userID: string | undefined;
};

export default function EditProfile({ onHide, onRefresh, oldbio, roleTags , userID, oldYear, oldPronouns}: Props) {
    // const user = FIREBASE_AUTH.currentUser;
    
    const [newBio, setNewBio] = useState(oldbio || '');
    const [newYear, setNewYear] = useState('');
    const [newPronouns, setNewPronouns] = useState('');


    const bio = (text: string) => {
        setNewBio(text);
    };
    const year = (text: string) => {
        setNewYear(text);
    };
    const pronouns = (text: string) => {
        setNewPronouns(text);
    };

    const updateBio = async () => {
        try {//newgarden.tsx
            // const userId = 'MwI8xB1YxoaP6sgVfGGs';// if null, create the user fields and new userID 
            if(userID) {
                const profile = doc(FIRESTORE_DB, 'profiles', userID);
                await updateDoc(profile, {
                    bio: newBio,
                    year: newYear,
                    pronouns: newPronouns,
                });
                onRefresh(); 
                console.log('Info updated successfully!');
            }
            
        } catch (error) {
            console.error('Error updating Info: ', error);
        }
    };

    const submit = async () => {
        // Await the asynchronous update to ensure it completes
        await updateBio();
        onHide(); // Close the modal
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={{ marginBottom: 10 }}>
                    <Text>Edit Bio: </Text>
                    <TextInput style={styles.text} multiline={true} maxLength={150} placeholder= "Edit your Bio" value={newBio} onChangeText={bio} />
                    <Text style={{ fontSize: 8 }}>-/150 characters left</Text>

                    <Text>Edit Year: </Text>
                    <TextInput style={styles.text} multiline={true} maxLength={150} placeholder= "Edit your academic standing" value={newYear} onChangeText={year} />
                    <Text style={{ fontSize: 8 }}>-/150 characters left</Text>

                    <Text>Edit Pronouns: </Text>
                    <TextInput style={styles.text} multiline={true} maxLength={150} placeholder= "Edit your Pronouns" value={newPronouns} onChangeText={pronouns} />
                    <Text style={{ fontSize: 8 }}>-/150 characters left</Text>
                    
                </View>
                {/* <View style={{ marginBottom: 10, }}>
                    <Text>Add Tag: </Text>
                    <TextInput style={styles.text} multiline={true} maxLength={20} />
                    <Text style={{ fontSize: 8 }}>-/20 characters left</Text>

                </View> */}
                <Button title="Submit" onPress={submit} />
            </View>
        </View>
    );
}



const styles = StyleSheet.create({
    container: {
        // flex: 1,
        backgroundColor: '#cad2c5',
        // // justifyContent: 'flex-start',
        // height: 340,
        // width: 320,
        // borderColor: '#000000',
        // borderRadius: 5,
        // borderWidth: 2,
        // padding: 10,
        // alignItems: 'center',

        padding: 20,
        // backgroundColor: 'white',
        // borderRadius: 10,
        height: '100%',
        width: '100%',
        alignItems: 'center',
        

    },
    content: {
        // borderColor: '#cad2c5',
        // borderRadius: 5,
        width: '100%',
        height: '85%',
        // borderWidth: 2,
    },
    save: {
        backgroundColor: '#84a98c',
        borderRadius: 5,
        // borderWidth: 1,
        paddingLeft: 10,
        paddingRight: 10,
        position: 'absolute', // Fix the element to the bottom
        bottom: 10,
    },
    text: {
        borderWidth: 2,
        // height: 50,
        borderColor: '#84a98c'
    },
     tags: {
        backgroundColor: "#52796f",
        // marginLeft: 5,
        // height: 20,
        //    justifyContent: "center"s,
        // paddingLeft: 5,
        // paddingRight: 5,
        // borderRadius: 8,
        alignSelf: 'flex-start',
        borderWidth:2,
        // width: '%',
    },

});

