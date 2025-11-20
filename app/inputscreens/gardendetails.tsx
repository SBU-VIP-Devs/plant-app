import 'react-native-gesture-handler';
import 'expo-dev-client';
import { StatusBar } from 'expo-status-bar';
import { Text, View, Button, FlatList, Modal, RefreshControl, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { DataTable } from 'react-native-paper';
import TaskCard from '../../components/TaskCard'
import NewTask from '../inputscreens/newtask';
import TaskList from './gardentasklist';
import SignUpList from './signuptasklist';
import { CommonStyles } from '../../styles';
import { Colors, FontSizes, Spacing, BorderRadius } from '../../constants';

interface GardenSettingsProps {
    gardenId: string | null;  
}

export default function GardenDetails({ gardenId }: GardenSettingsProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <View style={CommonStyles.paddedContainer}>
      <View style={{alignItems: 'center', marginBottom: Spacing.xl}}>
        <Text style={{fontSize: FontSizes.title, fontWeight: 'bold', color: Colors.darkText, marginBottom: Spacing.small, textAlign: 'center'}}>Garden Details</Text>
        <Text style={{fontSize: FontSizes.medium, color: Colors.darkText, marginBottom: Spacing.large, textAlign: 'center'}}>Selected Garden: {gardenId}</Text>
        <Pressable style={{
          backgroundColor: Colors.primaryDark,
          paddingHorizontal: Spacing.xl,
          paddingVertical: Spacing.small,
          borderRadius: Spacing.xl,
          marginBottom: Spacing.small
        }} onPress={handleRefresh}>
          <Text style={{color: Colors.darkText, fontSize: FontSizes.medium, fontWeight: '600'}}>Refresh</Text>
        </Pressable>
      </View>

      <View style={{marginBottom: Spacing.xxl}}>
        <Text style={{fontSize: FontSizes.large, fontWeight: '600', color: Colors.darkText, marginBottom: Spacing.large, textAlign: 'center'}}>Available Tasks</Text>
        <SignUpList gardenId={gardenId} onRefresh={handleRefresh} key={`signup-${refreshKey}`}/>
      </View>
    </View>

  );
}