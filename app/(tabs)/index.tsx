import 'react-native-gesture-handler';
import 'expo-dev-client';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function Login() {
  return (
    <View style={styles.container}>
      <Text>to do list here</Text>
      {/* <Link to="/users/1">go to user 1</Link> */}
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