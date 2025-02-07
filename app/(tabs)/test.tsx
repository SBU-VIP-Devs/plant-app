import 'react-native-gesture-handler';
import 'expo-dev-client';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, FlatList, Modal, RefreshControl } from 'react-native';
import { useState, useEffect } from 'react';
import { DataTable } from 'react-native-paper';
import TaskCard from '../../components/TaskCard'
import { QuerySnapshot, collection, getDocs, getDoc, doc } from "firebase/firestore";
import { FIRESTORE_DB } from '../../firebaseconfig';
import NewTask from '../inputscreens/newtask';
import GardenSettings from '../inputscreens/gardensettings';


export default function Test() {

  //local list to display the task data

  // 1. CREATE VARIABLE (USESTATE SO U CAN EDIT)
  const [bioLocal, setBio] = useState("default bioo hii");

  //READS TASKLIST FROM FIREBASE
  // const getTest = async () => { 
  //     try { 
  //         const list: any = []
  //         //CHANGE THE PATH AS NEEDED
  //         const querySnapshot = await getDocs(collection(FIRESTORE_DB, `profiles`)) 
          
  //         querySnapshot.forEach((doc) => {
  //             //THIS SHOULD MATCH THE FORMAT OF THE FIELDS BC ITS READING FROM ALL THE DATA (not just some)
  //             const {
  //               bio
  //             } = doc.data()

  //             //PUSH THE VALUES OF INTEREST
  //             list.push({ bio });
  //           });

  //           if(!querySnapshot.empty) {
  //             //sets each value individually
              
  //             //SET VALUES HERE
  //             const firstItem = list[0]; // Assuming you want to display the first document's data
  //             if (firstItem) {
  //               setBio(firstItem.bio);
  //             }
  //           }
  //     } catch(e) {
  //         console.log(e)
  //     }
  // }

  const getTest = async () => {
    try {
      // Specify the document path (replace 'profiles' and 'documentId' with your values)
      const docRef = doc(FIRESTORE_DB, "profiles", "MwI8xB1YxoaP6sgVfGGs"); // Replace "documentId" with the actual document ID
      const docSnapshot = await getDoc(docRef);
  
      if (docSnapshot.exists()) {
        // Extract the data from the document
        const { bio } = docSnapshot.data();
  
        // Set the state with the retrieved value
        setBio(bio);
      } else {
        console.log("Document does not exist");
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getTest();
  }, [])

  // 5. DISPLAY
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{bioLocal} {bioLocal}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingTop: 20,
    flex: 1,
    backgroundColor: '#cad2c5',
  },
  name: {
    fontWeight: "bold",
    fontSize: 22,
    color: "#2f3e46",
  },
});