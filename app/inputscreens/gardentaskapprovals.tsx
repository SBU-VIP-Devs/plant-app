import React from 'react';
import { FlatList, Text, View, RefreshControl, Pressable, Alert } from 'react-native';
import { useState, useEffect, useId } from 'react';
import { GardenSettingsProps } from './gardensettings';
import { TaskRequestProps } from '../../components/TaskRequestCard';
import TaskRequestCard from '../../components/TaskRequestCard';
import { CommonStyles } from '../../styles';
import { Colors, FontSizes, FontFamily, Spacing, BorderRadius } from '../../constants';
import db from '../../services/database';


// for ONE garden...need to scan thru all the tasks and get all the uid requests

export default function TaskApprovals({ gardenId, onRefresh }: GardenSettingsProps & { onRefresh?: () => void }) {

  // TO CONVERT UID TO ACTUAL USERNAMES (in case they change their usernames)
  async function readNameAsString(uid: string | undefined): Promise<string> {
    try {
        if (!uid) return "No Name";
        const username = await db.users.getUsernameById(uid);
        return username || "No Name";
    } catch (e) {
      console.log(e);
      return "No Name";
    }
  }

  // TO RENDER THE LISTS
  const [taskRequests, setTaskRequests] = useState<TaskRequestProps[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTaskRequests = async () => {
    try {
      if (!gardenId) return;

      const tasks = await db.tasks.getTasksByGarden(gardenId);
      let requests: TaskRequestProps[] = [];

      for (const task of tasks) {
        const { taskName, taskTime, uidPendingApproval, id } = task;

        if (uidPendingApproval && Array.isArray(uidPendingApproval)) {
          for (const requester of uidPendingApproval) {
            const uidToUsername = await readNameAsString(requester);
            const requestId = Math.random().toString(36).substring(2, 9);
            requests.push({
              id: requestId,
              taskName,
              taskTime,
              taskId: id,
              requesterId: requester,
              requesterName: uidToUsername,
            });
          }
        }
      }

      setTaskRequests(requests);

      if(loading) {
        setLoading(false)
      }

    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }

  useEffect(() => {
    fetchTaskRequests();
  }, []);

  // Refresh function that can be called from parent
  const refreshTaskRequests = () => {
    fetchTaskRequests();
    if (onRefresh) {
      onRefresh();
    }
  };

  //REMOVE UID FROM REQUEST LIST
  async function removeFromPending(uid: string | undefined, taskId: string) {
    try {
      if (!uid || !gardenId) return;

      await db.tasks.removeUserFromPending(gardenId, taskId, uid);

      console.log('User removed from array correctly.', taskId)
      Alert.alert('Removed from pending and status updated.')
    } catch(e) {
      console.log(e)
      console.log("may be invalid user.")
    }
    refreshTaskRequests()
  }

  //ADD UID TO ASSIGNED LIST
  async function addToAssigned(uid: string | undefined, taskId: string) {
    try {
      if (!uid || !gardenId) return;

      await db.tasks.addUserToAssigned(gardenId, taskId, uid);
      await db.tasks.updateTaskStatus(gardenId, taskId, 'assigned');

      console.log('User added to assigned array correctly.', taskId)
      Alert.alert('Task unapproved successfully!')
    } catch(e) {
      console.log(e)
      console.log("may be invalid user.")
    }
    refreshTaskRequests()
  }

  //ADD UID TO COMPLETED LIST
  async function addToCompleted(uid: string | undefined, taskId: string) {
    try {
      if (!uid || !gardenId) return;

      await db.tasks.addUserToCompleted(gardenId, taskId, uid);
      await db.tasks.updateTaskStatus(gardenId, taskId, 'completed');

      console.log('User added to completed array correctly.', taskId)
      Alert.alert('Task completed successfully!')
    } catch(e) {
      console.log(e)
      console.log("may be invalid user.")
    }
    refreshTaskRequests()
  }


  return (
    <FlatList
      data={taskRequests}
      renderItem={({item}: {item: TaskRequestProps}) => (
        <View style={{marginRight: Spacing.large, width: 300}}>
          <View style={{
            flexDirection: 'column',
            backgroundColor: Colors.primary,
            padding: Spacing.large,
            borderRadius: BorderRadius.medium,
            minHeight: 120,
          }}>
            <TaskRequestCard id={item.id} requesterName={item.requesterName} requesterId={item.requesterId} taskTime={item.taskTime} taskName={item.taskName} taskId={item.taskId}/>
            <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: Spacing.small}}>
                <Pressable style={{
                  alignItems: 'center',
                  borderRadius: BorderRadius.xl,
                  backgroundColor: Colors.primaryDark,
                  width: 80,
                  padding: Spacing.xs,
                  margin: Spacing.xs,
                }} onPress={async () => {
                  await removeFromPending(item.requesterId, item.taskId);
                  await addToCompleted(item.requesterId, item.taskId);
                  // TODO: add hours
                  console.log('accept')
                }}>
                    <Text style={{fontFamily: FontFamily.regular, color: Colors.darkText, fontSize: FontSizes.body}}>Accept</Text>
                </Pressable>
                <Pressable style={{
                  alignItems: 'center',
                  borderRadius: BorderRadius.xl,
                  backgroundColor: Colors.primaryDark,
                  width: 80,
                  padding: Spacing.xs,
                  margin: Spacing.xs,
                }} onPress={async () => {
                  await removeFromPending(item.requesterId, item.taskId);
                  await addToAssigned(item.requesterId, item.taskId);
                  console.log('denied')
                }}>
                    <Text style={{fontFamily: FontFamily.regular, color: Colors.darkText, fontSize: FontSizes.body}}>Deny</Text>
                </Pressable>
            </View>
          </View>
        </View>
      )}
      keyExtractor={item => item.id}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={CommonStyles.horizontalList}
    />
  );
}
