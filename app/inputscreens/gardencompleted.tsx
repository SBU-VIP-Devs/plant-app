import 'react-native-gesture-handler';
import 'expo-dev-client';
import { Text, View, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import TaskCard from '../../components/TaskCard';
import { CommonStyles } from '../../styles';
import { Colors, FontSizes, Spacing } from '../../constants';
import db from '../../services/database';

interface CompletedTasksProps {
  gardenId: string | null;
}

interface TaskData {
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

export default function CompletedTasks({ gardenId }: CompletedTasksProps) {
  const [taskList, setTaskList] = useState<TaskData[] | null>(null);

  const fetchCompletedTasks = async () => {
    try {
      if (!gardenId) return;

      const tasks = await db.tasks.getTasksByStatus(gardenId, ['completed']);
      setTaskList(tasks);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    fetchCompletedTasks();
  }, []);

  return (
    <View style={{alignItems: 'center'}}>
      <View style={{width: '90%'}}>
        {taskList && taskList.length > 0 ?
          <FlatList
            data={taskList}
            renderItem={({item}: {item: TaskData}) => (
              <View style={CommonStyles.taskCardContainer}><TaskCard item={item} key={item.id}/></View>
            )}
            keyExtractor={item => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={CommonStyles.horizontalList}
          /> :
          <Text style={CommonStyles.noContentText}>No completed tasks yet.</Text>
        }
      </View>
    </View>
  );
}


