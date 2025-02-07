import 'react-native-gesture-handler';
import 'expo-dev-client';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image, FlatList} from 'react-native';
import { Link } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import { FIREBASE_AUTH } from '../../../firebaseconfig';
import { signOut } from 'firebase/auth';


export default function Users() {

  //gets number passed into path for [id] 
  const {id} = useLocalSearchParams();

  

  //if you want id as a string
  //const {id} = useLocalSearchParams<{id: string}>();
  const user = FIREBASE_AUTH.currentUser;
  //user?.email, user?.uid

  const list = [
    { id: '1', title: 'Major' },
    { id: '2', title: 'Year' },
    { id: '3', title: 'Pronouns' },
    { id: '4', title: 'Role'},
  ];


  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center'}}>
        <Image source={require('../../../assets/flower.jpg')} style={styles.profilepic}/>
        <Text style={styles.name}>FirstName LastName</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>
      <Text style={styles.bioTitle}>Bio:</Text>
      <Text style={styles.bio}>I like flowers!</Text>
      <FlatList
          data={list}
          renderItem={({ item }) => 
            (<View style={styles.tags}>
              <Text style ={{color: "#cad2c5", fontWeight: "bold"}}> {item.title} </Text>
            </View>)}
          keyExtractor={item => item.id}
          horizontal={true}
      />
      <Text>hi</Text>
      <Button title="Sign out" onPress = {() => signOut(FIREBASE_AUTH)}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cad2c5',
    justifyContent: 'flex-start',
    padding: 30,
  },

  name: {
    fontWeight: "bold",
    fontSize: 22,
    color: "#2f3e46",
  },

  email: {
    fontWeight: "bold",
    color: "#52796f",
  },

  profilepic: {
    height: 100,
    width: 100,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: "#354f52",
  },

  bioTitle: {
    fontSize: 15,
    textAlign: "left",
    textDecorationLine: 'underline',
  },

  bio: {
    fontSize: 15,
  },

  tags: {
    backgroundColor: "#52796f",
    marginLeft: 5,
    height: 25,
    justifyContent: "center",
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 10,
  },

  
});