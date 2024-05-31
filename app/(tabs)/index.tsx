import 'react-native-gesture-handler';
import 'expo-dev-client';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Link } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../firebaseconfig';
import { signOut } from 'firebase/auth';

export default function Login() {
  return (
    <View style={styles.container}>
      <Text>hello world</Text>
      {/* <Link to="/users/1">go to user 1</Link> */}
      <Button title="Sign out" onPress = {() => signOut(FIREBASE_AUTH)}/>
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