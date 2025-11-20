import 'react-native-gesture-handler';
import 'expo-dev-client';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Pressable, Text, View, Button, FlatList, Modal, RefreshControl, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { DataTable } from 'react-native-paper';
import TaskCard from '../../components/TaskCard'
import { QuerySnapshot, collection, getDocs, doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { FIRESTORE_DB, FIREBASE_AUTH } from '../../firebaseconfig';
import NewTask from '../inputscreens/newtask';
import { TaskData } from './gardentasklist';

interface TaskListProps {
    gardenId: string | null;
    onRefresh?: () => void;
}

export default function SignUpList({ gardenId, onRefresh }: TaskListProps) {
  
    //firebase auth user
    const user = FIREBASE_AUTH.currentUser;

    //local list to display the task data
    const [taskList, updateTaskList] = useState(null);
    const [loading, setLoading] = useState(true);

    //READS TASKLIST FROM FIREBASE
    const getTaskList = async () => { 
        try {
            const list: any = []
            const querySnapshot = await getDocs(collection(FIRESTORE_DB, `garden-post-info/${gardenId}/garden-tasks`)) 
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                //console.log(doc.id, " => ", doc.data());
                const {
                  id,
                  desc,
                  gardenId,
                  location,
                  taskName,
                  taskTime,
                  test,
                  uidAssigned,
                  uidRequests,
                  username
                } = doc.data()
                list.push({ 
                  id: doc.id,
                  desc,
                  gardenId,
                  location,
                  taskName,
                  taskTime,
                  test,
                  uidAssigned,
                  uidRequests,
                  username
                })
            });
            if(!querySnapshot.empty) {
                updateTaskList(list)
            }

            if(loading) {
                setLoading(false)
            }

            // console.log('posts: ', list)
        } catch(e) {
            console.log(e)
        }
    }

    useEffect(() => {
      getTaskList();
    }, [])

  // Refresh function that can be called from parent
  const refreshSignUpTasks = () => {
    getTaskList();
    if (onRefresh) {
      onRefresh();
    }
  };

  //uploads to firebase and refresh
  async function uploadTaskRequest(uid: string | undefined, taskId: string) {
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
          uidRequests: arrayUnion(uid),
        });
      }
      
      console.log('User saved to requests array correctly.', docRef.id)
      Alert.alert('Task requested successfully!')
    } catch(e) {
      console.log(e)
      console.log("may be invalid user.")
    }
    refreshSignUpTasks()
  }

  return (
    <View style={{alignItems: 'center'}}>
      <View style={{width: '90%'}}>
      {taskList? 
        <FlatList
          data={taskList}
          renderItem={({item}: {item: TaskData}) => {
              return (
                <View style={styles.horizontalCardContainer}>
                  <View style={styles.cardContainer}>
                      <TaskCard item={item} key={item.id}/>
                      <View style={{alignItems: 'center'}}>
                          <Pressable style={styles.button} onPress={() => uploadTaskRequest(user?.uid, item.id)}>
                              <Text style={styles.lightTitle}>Request This Task</Text>
                          </Pressable> 
                      </View>
                  </View>
                </View>
              )
          }}
          keyExtractor={item => item.id}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />:
        <Text style={styles.noTasksText}>No tasks available!</Text>
      }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingTop: 20,
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#cad2c5',
  },
  horizontalList: {
    paddingHorizontal: 10,
  },
  horizontalCardContainer: {
    marginRight: 15,
    width: 280,
  },
  cardContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#84a98c',
    borderRadius: 10,
    paddingTop: 10,
    paddingBottom: 10,
    minHeight: 200,
  },
  button: {
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: '#52796f',
    width: '80%',
    padding: 8,
    margin: 8,
  },
  lightTitle: {
    fontFamily: 'Quicksand-Bold',
    color: '#2f3e46',
    fontSize: 17,
  },
  noTasksText: {
    textAlign: 'center',
    color: '#2f3e46',
    fontSize: 16,
    marginVertical: 20,
  },
});