import 'react-native-gesture-handler';
import 'expo-dev-client';
import { StyleSheet, Text, View, Button, FlatList, Modal, RefreshControl } from 'react-native';
import TaskCard from '../../components/TaskCard'


export default function Login() {
  
  return (
    <View style={styles.container}>
      <Text>login screen! hello</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingTop: 20,
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#cad2c5',
  },
});