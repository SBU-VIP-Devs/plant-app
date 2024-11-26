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
import TaskList from './gardentasklist';
import SignUpList from './signuptasklist';

interface GardenSettingsProps {
    gardenId: string | null;  
}

export default function GardenDetails({ gardenId }: GardenSettingsProps) {

  return (
    <>
    <View style={styles.container}>
      <Text>Garden Details</Text>
      <Text>Selected Garden: {gardenId}</Text>
    </View>
    <SignUpList gardenId={gardenId}/>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingTop: 20,
    backgroundColor: '#cad2c5',
    padding: 20,
  },
});