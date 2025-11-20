import 'react-native-gesture-handler';
import 'expo-dev-client';
import { StatusBar } from 'expo-status-bar';
import { Text, View, Button, FlatList, Modal, RefreshControl } from 'react-native';
import { useState, useEffect } from 'react';
import { DataTable } from 'react-native-paper';
import TaskCard from '../../components/TaskCard'
import NewTask from '../inputscreens/newtask';
import { CommonStyles } from '../../styles';
import { Colors, FontSizes, Spacing } from '../../constants';
import db from '../../services/database';


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
  taskStatus?: 'open' | 'assigned' | 'approval' | 'completed',
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
            if (!gardenId) return;

            // Get tasks with status 'open' or 'assigned'
            const tasks = await db.tasks.getTasksByStatus(gardenId, ['open', 'assigned']);

            if(tasks.length > 0) {
                updateTaskList(tasks as any)
            }

            if(loading) {
                setLoading(false)
            }
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
                return <View style={CommonStyles.taskCardContainer}><TaskCard item={item} key={item.id}/></View>
            }}
            keyExtractor={item => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={CommonStyles.horizontalList}
          />:
          <Text style={CommonStyles.noContentText}>No tasks! Click the button below to create one.</Text>
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