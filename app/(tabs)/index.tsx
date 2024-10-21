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
  gardenName: string,
  username: string,
};

export default function Login() {
  
  const [taskList, updateTaskList] = useState(null);
  const [loading, setLoading] = useState(true);

    //useEffect(() => {
        const getTaskList = async () => { 
            try {
                const list: any = []
                const querySnapshot = await getDocs(collection(FIRESTORE_DB, "task-post-info")) 
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    //console.log(doc.id, " => ", doc.data());
                    const {
                      taskName,
                      taskTime,
                      desc,
                      location,
                      garden,
                      username,
                    } = doc.data()
                    list.push({ 
                        id: doc.id,
                        taskName,
                        taskTime,
                        location,
                        desc,
                        garden,
                        username,
                    })
                });
                updateTaskList(list)

                if(loading) {
                    setLoading(false)
                }

                // console.log('posts: ', list)
            } catch(e) {
                console.log(e)
            }
        }

        getTaskList()

    //}, [])

  //modal functionality
  const [newTaskVisible, setNewTaskVisible] = useState(false);
  const show = () => setNewTaskVisible(true);
  const hide = () => setNewTaskVisible(false);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Fetch new data from your API
    getTaskList()
    setRefreshing(false);
  }

  return (
    <View style={styles.container}>
      <View style={{width:'80%'}}>
      <FlatList
          style={{width: '90%'}}
          data={taskList}
          renderItem={({item}: {item: TaskData}) => {
              // console.log(item)
              return <TaskCard item={item} key={item.id}/>
          }}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          />}
      />
      <Button title='New Task +' onPress={show} />
            {/* <Button title='gardenlist' onPress={getGardenList} /> */}
            <Modal
                visible={newTaskVisible}
                onRequestClose={hide}
                animationType='slide'
            >
                <View style={{ flex: 1, marginTop: 50}}>
                    <Button title='Close' onPress={hide} />
                    <NewTask/>
                </View>
            </Modal>
      </View>
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
});