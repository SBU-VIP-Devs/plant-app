import 'react-native-gesture-handler';
import 'expo-dev-client';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View, TextInput, Pressable, Image, Alert, Button, Platform } from 'react-native';
import { useState } from 'react';
import { KeyboardAvoidingView } from 'react-native';
import ProgressBar from '../../components/ProgressBar';
import { FIREBASE_AUTH } from '../../firebaseconfig';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CommonStyles } from '../../styles';
import { Colors, Spacing } from '../../constants';
import db from '../../services/database';

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
    async function uploadTaskRecord(taskName: string, taskTime: string, desc: string, location: string, gardenId: string, uidAssigned: string[], uidRequests: string[], uidPendingApproval: string[], uidCompleted: string[], username: string) {
      try {
        const taskId = await db.tasks.createTask(gardenId, {
          taskName,
          taskTime,
          desc,
          location,
          gardenId,
          username,
          uidAssigned,
          uidRequests,
          uidPendingApproval,
          uidCompleted,
          taskStatus: 'open'
        })
        console.log('Document saved correctly.', taskId)
        Alert.alert('Task created successfully!')
      } catch(e) {
        console.log(e)
      }
    }

    //the function activated by the button that accepts user input
    const uploadTaskPost = async () => {
        const uidAssigned: string[] = [];
        const uidRequests: string[] = [];
        const uidPendingApproval: string[] = [];
        const uidCompleted: string[] = [];
        gardenId?
        (await uploadTaskRecord(
          name, 
          `${selectedTime1} ${selectedTime2}`, 
          desc, 
          location, 
          gardenId,
          uidAssigned,
          uidRequests,
          uidPendingApproval,
          uidCompleted,
          username
        )):
        console.log("Invalid garden.")
    }

    return (
      <KeyboardAvoidingView style={CommonStyles.screenContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={CommonStyles.scrollViewContent}>
        <Text style={CommonStyles.pageHeader}>New Task Setup</Text>
        <Text style={CommonStyles.buttonText}>New Task Name</Text>
        <TextInput
        value={name}
        style={CommonStyles.textInput}
        placeholder="New Task Name"
        autoCapitalize='none'
        onChangeText={(text) => {
          setName(text)
        }}
        />
        <Text style={CommonStyles.buttonText}>New Task Description</Text>
        <TextInput
        value={desc}
        style={CommonStyles.textInput}
        placeholder="New Task Description"
        autoCapitalize='none'
        multiline={true}
        numberOfLines={5}
        maxLength={300}
        onChangeText={(text) => {
          setDesc(text)
        }}
        />
        <Text style={CommonStyles.buttonText}>New Task Start Time</Text>
        <Text>Selected Time: {selectedTime1}</Text>
        <DateTimePicker
          testID="dateTimePicker"
          value={date1}
          mode="datetime"
          is24Hour={true} // Set to false for 12-hour format
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChange1}
        />

        <Text style={CommonStyles.buttonText}>New Task End Time</Text>
        <Text>Selected Time: {selectedTime2}</Text>
        <DateTimePicker
          testID="dateTimePicker"
          value={date2}
          mode="datetime"
          is24Hour={true} // Set to false for 12-hour format
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChange2}
        />
        <Text style={CommonStyles.buttonText}>Selected Time: {formatDateRange(date1, date2)}</Text>
        <Text style={CommonStyles.buttonText}>New Task Location</Text>
        <TextInput
        value={location}
        style={CommonStyles.textInput}
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
        <View style={CommonStyles.centeredView}>
          <Pressable style={CommonStyles.primaryButton} onPress = {uploadTaskPost}>
              <Text style={CommonStyles.buttonText}>Create Task!</Text>
          </Pressable>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    );
  }