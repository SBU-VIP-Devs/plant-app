import 'react-native-gesture-handler';
import 'expo-dev-client';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, FlatList, Modal, RefreshControl, ScrollView } from 'react-native';
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

  return (

    <View style={styles.container}>
      <ScrollView>
        <Text>Garden Settings</Text>
        <Text>Selected garden: {gardenId}</Text>
        <TaskList gardenId={gardenId}/>
        <Text>Task Requests</Text>
        <TaskRequests gardenId={gardenId}/>
      </ScrollView>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingTop: 20,
    backgroundColor: '#cad2c5',
    padding: 20,
    width: '100%',
    height: '100%',
    paddingBottom: 70
  },
});