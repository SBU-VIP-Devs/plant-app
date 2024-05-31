import 'react-native-gesture-handler';
import 'expo-dev-client';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Link } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';

export default function Users() {

  //gets number passed into path for [id] 
  const {id} = useLocalSearchParams();

  //if you want id as a string
  //const {id} = useLocalSearchParams<{id: string}>();
  
  return (
    <View style={styles.container}>
      <Text>hello user {id}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cad2c5',
    alignItems: 'center',
    justifyContent: 'center',
  },
});