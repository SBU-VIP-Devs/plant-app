import 'react-native-gesture-handler';
import 'expo-dev-client';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, FlatList, Modal, RefreshControl, ScrollView, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { DataTable } from 'react-native-paper';
import TaskCard from '../../components/TaskCard'
import { QuerySnapshot, collection, getDocs } from "firebase/firestore";
import { FIRESTORE_DB } from '../../firebaseconfig';
import NewTask from '../inputscreens/newtask';
import TaskList from './gardentasklist';
import TaskRequests from './gardentaskrequests';

export interface GardenSettingsProps {
    gardenId: string | null;  
}


export default function GardenSettings({ gardenId }: GardenSettingsProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Garden Settings</Text>
        <Text style={styles.subtitle}>Selected garden: {gardenId}</Text>
        <Pressable style={styles.refreshButton} onPress={handleRefresh}>
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </Pressable>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tasks</Text>
        <TaskList gardenId={gardenId} onRefresh={handleRefresh} key={`tasks-${refreshKey}`}/>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Task Requests</Text>
        <TaskRequests gardenId={gardenId} onRefresh={handleRefresh} key={`requests-${refreshKey}`}/>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#cad2c5',
  },
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingTop: 20,
    padding: 20,
    width: '100%',
    paddingBottom: 70
  },
  header: {
    alignItems: 'center',
    marginBottom: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2f3e46',
    marginBottom: 10,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 16,
    color: '#2f3e46',
    marginBottom: 15,
    textAlign: 'center'
  },
  refreshButton: {
    backgroundColor: '#52796f',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 10
  },
  refreshButtonText: {
    color: '#2f3e46',
    fontSize: 16,
    fontWeight: '600'
  },
  section: {
    marginBottom: 30
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2f3e46',
    marginBottom: 15,
    textAlign: 'center'
  }
});