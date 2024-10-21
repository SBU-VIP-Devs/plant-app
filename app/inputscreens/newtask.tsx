import 'react-native-gesture-handler';
import 'expo-dev-client';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Pressable, Image, Alert } from 'react-native';
import { useState } from 'react';
import { KeyboardAvoidingView } from 'react-native';
import ProgressBar from '../../components/ProgressBar';
import { addDoc, collection } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../firebaseconfig';
import { FIREBASE_AUTH } from '../../firebaseconfig';

// for reference
// export interface TaskData {
//     id: string;
//     taskName: string;
//     taskTime: string;
//     desc: string; //just type it in for now
//     location: string; //SAC, SAC Plaza, ESD
//     gardenId: string;
//     username: string;
//   };

export default function NewTask() {

    const user = FIREBASE_AUTH.currentUser;
    const username = user?.displayName ? user?.displayName : 'Unknown User'
    const userId = user ? user.uid : null
    //const userList = userId ? {[userId]: "admin"} : null

    const [name, setName] = useState('MyTask')
    const [time, setTime] = useState('2024-06-30T06:00:51.486Z')
    const [desc, setDesc] = useState('Insert description...')
    //whats enum in typescript
    const [location, setLocation] = useState('Location')
    //retrieve the gardens you have admin access to and only allow to select those
    const [garden, setGarden] = useState('GardenID')
    
    async function uploadTaskRecord(taskName: string, taskTime: string, desc: string, location: string, gardenId: string, username: string) {
      try {
        const docRef = await addDoc(collection(FIRESTORE_DB, 'task-post-info'), {
          taskName,
          taskTime,
          desc,
          location,
          garden,
          username,
        })
        console.log('Document saved correctly.', docRef.id)
        Alert.alert('Task created successfully!')
      } catch(e) {
        console.log(e)
      }
    }

    const uploadTaskPost = async () => {
        await uploadTaskRecord(name, time, desc, location, garden, username)
    }

    return (
      <View style={styles.container}>
        <Text style={styles.header}>New Task Setup</Text>
        <KeyboardAvoidingView behavior='padding'>
        <Text style={styles.text}>New Task Name</Text>
        <TextInput
        value={name}
        style={styles.input}
        placeholder="New Task Name"
        autoCapitalize='none'
        onChangeText={(text) => {
          setName(text)
        }}
        />
        <Text style={styles.text}>New Task Description</Text>
        <TextInput
        value={desc}
        style={styles.input}
        placeholder="New Task Description"
        autoCapitalize='none'
        multiline={true}
        numberOfLines={5}
        maxLength={300}
        onChangeText={(text) => {
          setDesc(text)
        }}
        />
        <Text style={styles.text}>New Task Time</Text>
        <TextInput
        value={time}
        style={styles.input}
        placeholder="Task Time"
        autoCapitalize='none'
        multiline={true}
        numberOfLines={5}
        maxLength={300}
        onChangeText={(text) => {
          setTime(text)
        }}
        />
        <Text style={styles.text}>New Task Location</Text>
        <TextInput
        value={location}
        style={styles.input}
        placeholder="Task Location"
        autoCapitalize='none'
        multiline={true}
        numberOfLines={5}
        maxLength={300}
        onChangeText={(text) => {
          setLocation(text)
        }}
        />
        <Text style={styles.text}>New Task Garden</Text>
        <TextInput
        value={garden}
        style={styles.input}
        placeholder="Task Garden"
        autoCapitalize='none'
        multiline={true}
        numberOfLines={5}
        maxLength={300}
        onChangeText={(text) => {
          setGarden(text)
        }}
        />
        <StatusBar style="auto" />
        </KeyboardAvoidingView>
        <View style={{alignItems: 'center'}}>
          <Pressable style={styles.button} onPress = {uploadTaskPost}>
              <Text style={styles.text}>Create Task!</Text>
          </Pressable>
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#cad2c5',
      //alignItems: 'center',
      //justifyContent: 'center',
      padding: 15,
    },
    button: {
      alignItems: 'center',
      borderRadius: 30,
      backgroundColor: '#84a98c',
      width: '50%',
      padding: 8,
      marginTop: 10,
   },
    header: {
      fontSize: 30,
      lineHeight: 42,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      textAlign: 'left',
      color: '#2f3e46',
    },
    input: {
      marginTop: 7,
      fontSize: 15, 
      color: '#2f3e46',
      backgroundColor: 'white',
      borderWidth: 2,
      borderColor: '#2f3e46',
      borderRadius: 10,
      paddingVertical: 12,
      paddingHorizontal: 12,
    },
    text: {
      fontSize: 16,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: '#2f3e46',
    },
  });