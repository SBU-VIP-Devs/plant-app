import 'react-native-gesture-handler';
import 'expo-dev-client';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View, TextInput, Pressable, Image, Alert, Button, Platform } from 'react-native';
import { useState } from 'react';
import { KeyboardAvoidingView } from 'react-native';
import ProgressBar from '../../components/ProgressBar';
import { addDoc, collection } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../firebaseconfig';
import { FIREBASE_AUTH } from '../../firebaseconfig';
import DateTimePicker from '@react-native-community/datetimepicker';

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

export function formatDateRange(date1: Date, date2: Date) {
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  
  const startDay = date1.toLocaleDateString(undefined);
  const startTime = date1.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric', hour12: true });
  
  const endDay = date2.toLocaleDateString(undefined);
  const endTime = date2.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric', hour12: true });

  // If both dates fall on the same day, format accordingly
  if (startDay === endDay) {
      return `${startDay} at ${startTime} - ${endTime}`;
  } else {
      return `${startDay} at ${startTime} - ${endDay} at ${endTime}`;
  }
}
//collection(FIRESTORE_DB, `garden-post-info/${gardenId}/garden-tasks`)

interface NewTaskProps {
  gardenId: string | null;  
}

export default function NewTask({ gardenId }: NewTaskProps) {

    const user = FIREBASE_AUTH.currentUser;
    const username = user?.displayName ? user?.displayName : 'Unknown User'
    const userId = user ? user.uid : null
    //const userList = userId ? {[userId]: "admin"} : null

    const [name, setName] = useState('MyTask')

    //for calendar
    const [date1, setDate1] = useState(new Date());
    const [selectedTime1, setSelectedTime1] = useState('');

    const [date2, setDate2] = useState(new Date());
    const [selectedTime2, setSelectedTime2] = useState('');

    const onChange1 = (event: any, selectedDate: any) => {
      const currentDate = selectedDate || date1;
      setDate1(currentDate);
      setSelectedTime1(currentDate.toISOString()); // Convert to ISO format
    };

    const onChange2 = (event: any, selectedDate: any) => {
      const currentDate = selectedDate || date2;
      setDate2(currentDate);
      setSelectedTime2(currentDate.toISOString()); // Convert to ISO format
    };
    //for calendar ^^

    const [desc, setDesc] = useState('Insert description...')
    //whats enum in typescript
    const [location, setLocation] = useState('Location')
    
    //uploads to firebase
    async function uploadTaskRecord(taskName: string, taskTime: string, desc: string, location: string, gardenId: string, uidAssigned: string[], uidRequests: string[], username: string) {
      try {
        const docRef = await addDoc(collection(FIRESTORE_DB, `garden-post-info/${gardenId}/garden-tasks`), {
          taskName,
          taskTime,
          desc,
          location,
          gardenId,
          username,
          uidAssigned,
          uidRequests
        })
        console.log('Document saved correctly.', docRef.id)
        Alert.alert('Task created successfully!')
      } catch(e) {
        console.log(e)
      }
    }

    //the function activated by the button that accepts user input
    const uploadTaskPost = async () => {
        const uidAssigned: string[] = [];
        const uidRequests: string[] = [];
        gardenId?
        (await uploadTaskRecord(
          name, 
          `${selectedTime1} ${selectedTime2}`, 
          desc, 
          location, 
          gardenId,
          uidAssigned,
          uidRequests, 
          username
        )):
        console.log("Invalid garden.")
    }

    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.header}>New Task Setup</Text>
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
        <Text style={styles.text}>New Task Start Time</Text>
        <Text>Selected Time: {selectedTime1}</Text>
        <DateTimePicker
          testID="dateTimePicker"
          value={date1}
          mode="datetime"
          is24Hour={true} // Set to false for 12-hour format
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChange1}
        />
        
        <Text style={styles.text}>New Task End Time</Text>
        <Text>Selected Time: {selectedTime2}</Text>
        <DateTimePicker
          testID="dateTimePicker"
          value={date2}
          mode="datetime"
          is24Hour={true} // Set to false for 12-hour format
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChange2}
        />
        <Text style={styles.text}>Selected Time: {formatDateRange(date1, date2)}</Text>
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
        
        <StatusBar style="auto" />
        <View style={{alignItems: 'center'}}>
          <Pressable style={styles.button} onPress = {uploadTaskPost}>
              <Text style={styles.text}>Create Task!</Text>
          </Pressable>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
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
    scrollView: {
      padding: 15,
      paddingBottom: 100, // Ensure there's extra space at the bottom for the button
    },
  });