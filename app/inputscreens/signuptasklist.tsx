import 'react-native-gesture-handler';
import 'expo-dev-client';
import { StatusBar } from 'expo-status-bar';
import { Pressable, Text, View, Button, FlatList, Modal, RefreshControl, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { DataTable } from 'react-native-paper';
import TaskCard from '../../components/TaskCard'
import { FIREBASE_AUTH } from '../../firebaseconfig';
import NewTask from '../inputscreens/newtask';
import { TaskData } from './gardentasklist';
import { CommonStyles } from '../../styles';
import { Colors, FontSizes, FontFamily, Spacing, BorderRadius } from '../../constants';
import db from '../../services/database';

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
            if (!gardenId) return;

            const tasks = await db.tasks.getTasksByGarden(gardenId);

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
      if (!uid || !gardenId) return;

      await db.tasks.addUserToRequests(gardenId, taskId, uid);

      console.log('User saved to requests array correctly.', taskId)
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
                <View style={{marginRight: Spacing.large, width: 280}}>
                  <View style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    backgroundColor: Colors.primary,
                    borderRadius: BorderRadius.small,
                    paddingTop: Spacing.small,
                    paddingBottom: Spacing.small,
                    minHeight: 200,
                  }}>
                      <TaskCard item={item} key={item.id}/>
                      <View style={{alignItems: 'center'}}>
                          <Pressable style={{
                            alignItems: 'center',
                            borderRadius: BorderRadius.xl,
                            backgroundColor: Colors.primaryDark,
                            width: '80%',
                            padding: Spacing.xs,
                            margin: Spacing.xs,
                          }} onPress={() => uploadTaskRequest(user?.uid, item.id)}>
                              <Text style={{fontFamily: FontFamily.bold, color: Colors.darkText, fontSize: FontSizes.subtitle}}>Request This Task</Text>
                          </Pressable>
                      </View>
                  </View>
                </View>
              )
          }}
          keyExtractor={item => item.id}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={CommonStyles.horizontalList}
        />:
        <Text style={CommonStyles.noContentText}>No tasks available!</Text>
      }
      </View>
    </View>
  );
}