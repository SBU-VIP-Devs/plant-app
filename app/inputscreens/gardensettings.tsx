import 'react-native-gesture-handler';
import 'expo-dev-client';
import { StatusBar } from 'expo-status-bar';
import { Text, View, Button, FlatList, Modal, RefreshControl, ScrollView, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { DataTable } from 'react-native-paper';
import TaskCard from '../../components/TaskCard'
import NewTask from '../inputscreens/newtask';
import TaskList from './gardentasklist';
import TaskRequests from './gardentaskrequests';
import TaskApprovals from './gardentaskapprovals';
import CompletedTasks from './gardencompleted';
import { CommonStyles } from '../../styles';
import { Colors, FontSizes, FontFamily, Spacing, BorderRadius } from '../../constants';

export interface GardenSettingsProps {
    gardenId: string | null;  
}


export default function GardenSettings({ gardenId }: GardenSettingsProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <ScrollView style={CommonStyles.scrollContainer} contentContainerStyle={{
      flexDirection: 'column',
      justifyContent: 'flex-start',
      paddingTop: Spacing.xl,
      padding: Spacing.xl,
      width: '100%',
      paddingBottom: 70
    }}>
      <View style={{alignItems: 'center', marginBottom: Spacing.xl}}>
        <Text style={{fontSize: FontSizes.title, fontWeight: 'bold', color: Colors.darkText, marginBottom: Spacing.small, textAlign: 'center'}}>Garden Settings</Text>
        <Text style={{fontSize: FontSizes.medium, color: Colors.darkText, marginBottom: Spacing.base, textAlign: 'center'}}>Selected garden: {gardenId}</Text>
        <Pressable style={{
          backgroundColor: Colors.primaryDark,
          paddingHorizontal: Spacing.xl,
          paddingVertical: Spacing.small,
          borderRadius: BorderRadius.large,
          marginBottom: Spacing.small
        }} onPress={handleRefresh}>
          <Text style={{color: Colors.darkText, fontSize: FontSizes.medium, fontWeight: '600'}}>Refresh</Text>
        </Pressable>
      </View>

      <View style={{marginBottom: Spacing.xxl}}>
        <Text style={{fontSize: FontSizes.large, fontWeight: '600', color: Colors.darkText, marginBottom: Spacing.base, textAlign: 'center'}}>Tasks</Text>
        <TaskList gardenId={gardenId} onRefresh={handleRefresh} key={`tasks-${refreshKey}`}/>
      </View>

      <View style={{marginBottom: Spacing.xxl}}>
        <Text style={{fontSize: FontSizes.large, fontWeight: '600', color: Colors.darkText, marginBottom: Spacing.base, textAlign: 'center'}}>Task Requests</Text>
        <TaskRequests gardenId={gardenId} onRefresh={handleRefresh} key={`requests-${refreshKey}`}/>
      </View>

      <View style={{marginBottom: Spacing.xxl}}>
        <Text style={{fontSize: FontSizes.large, fontWeight: '600', color: Colors.darkText, marginBottom: Spacing.base, textAlign: 'center'}}>Task Approval</Text>
        <TaskApprovals gardenId={gardenId} key={`approval-${refreshKey}`}/>
      </View>

      <View style={{marginBottom: Spacing.xxl}}>
        <Text style={{fontSize: FontSizes.large, fontWeight: '600', color: Colors.darkText, marginBottom: Spacing.base, textAlign: 'center'}}>Completed</Text>
        <CompletedTasks gardenId={gardenId} key={`completed-${refreshKey}`}/>
      </View>

    </ScrollView>
  );
}