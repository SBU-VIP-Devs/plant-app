import 'react-native-gesture-handler';
import 'expo-dev-client';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, FlatList, Modal, RefreshControl } from 'react-native';
import { useState, useEffect } from 'react';
import { DataTable } from 'react-native-paper';
import TaskCard from '../../components/TaskCard'
import { QuerySnapshot, collection, getDocs } from "firebase/firestore";
import { FIRESTORE_DB } from '../../firebaseconfig';
import NewTask from '../inputscreens/newtask';


export interface TaskData {
  id: string,
  taskName: string,
  taskTime: string,
  desc: string,
  location: string,
  gardenId: string,
  username: string,
  uidAssigned: string[],
  uidRequests: string[],
};

interface TaskListProps {
    gardenId: string | null;
    onRefresh?: () => void;
}

export default function TaskList({ gardenId, onRefresh }: TaskListProps) {
  
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

  //MODAL TO CREATE NEW TASK
  const [newTaskVisible, setNewTaskVisible] = useState(false);
  const show = () => setNewTaskVisible(true);
  const hide = () => setNewTaskVisible(false);

  // Refresh function that can be called from parent
  const refreshTasks = () => {
    getTaskList();
    if (onRefresh) {
      onRefresh();
    }
  };

  return ( 
    <View style={{alignItems: 'center'}}>
      <View style={{width: '90%'}}>
        {taskList? 
          <FlatList
            data={taskList}
            renderItem={({item}: {item: TaskData}) => {
                return <View style={styles.taskCardContainer}><TaskCard item={item} key={item.id}/></View>
            }}
            keyExtractor={item => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />:
          <Text style={styles.noTasksText}>No tasks! Click the button below to create one.</Text>
        }
      </View>
      <Button title='New Task +' onPress={show}/>
            {/* <Button title='gardenlist' onPress={getGardenList} /> */}
            <Modal
                visible={newTaskVisible}
                onRequestClose={hide}
                animationType='slide'
            >
                <View style={{ flex: 1, marginTop: 50}}>
                    <Button title='Close' onPress={() => {
                        hide();         
                        refreshTasks();    
                    }} />
                    {/* onRefresh */}
                    <NewTask gardenId={gardenId}/>
                </View>
            </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingTop: 20,
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#cad2c5',
  },
  horizontalList: {
    paddingHorizontal: 10,
  },
  taskCardContainer: {
    marginRight: 15,
    width: 280,
  },
  noTasksText: {
    textAlign: 'center',
    color: '#2f3e46',
    fontSize: 16,
    marginVertical: 20,
  },
});