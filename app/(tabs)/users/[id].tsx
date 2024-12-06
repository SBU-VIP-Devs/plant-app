import 'react-native-gesture-handler';
import 'expo-dev-client';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image, FlatList, ImageBackground, ScrollView } from 'react-native';
import { Link } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import { FIREBASE_AUTH } from '../../../firebaseconfig';
import { signOut } from 'firebase/auth';


export default function Users() {

  //gets number passed into path for [id] 
  const { id } = useLocalSearchParams();


  //if you want id as a string
  //const {id} = useLocalSearchParams<{id: string}>();
  const user = FIREBASE_AUTH.currentUser;
  //user?.email, user?.uid

  const list = [
    { id: '1', title: 'Major' },
    { id: '2', title: 'Year' },
    { id: '3', title: 'Pronouns' },
    { id: '4', title: 'Role' },
  ];


  return (
    <View style={styles.container}>
      <ScrollView>
        <ImageBackground style={{ height: 125, opacity: 0.7, }}
          source={require('../../../assets/gardens/garden1.jpeg')}
        />

        <View style={{ paddingLeft: 25, paddingRight: 25 }}>
          <View style={{ alignItems: 'center', marginTop: -45, }}>
            <Image source={require('../../../assets/flower.jpg')} style={styles.profilepic} />
            <Text style={styles.name}>FirstName LastName</Text>
            <Text style = {styles.email}>email@gmail.com</Text>
            {/* <Text style={styles.email}>{user?.email}</Text> */}
          </View>

          <Text style={styles.bioTitle}>Bio:</Text>
          <Text style={styles.bio}>I like flowers! I grow lavender, daisies, tulips, and roses at home. My favorite flower are sunflowers!</Text>
          <View style={{ height: 28 }}>
            <FlatList
              data={list}
              renderItem={({ item }) =>
              (<View style={styles.tags}>
                <Text style={{ color: "#cad2c5", fontWeight: "bold" }}> {item.title} </Text>
              </View>)}
              keyExtractor={item => item.id}
              horizontal={true}

            />
          </View>
          <View style={styles.editButton}>
            <Text>Edit Profile</Text>
          </View>
          <View style={styles.totalHours}>
            <Text style={{ fontSize: 22, color: "#354f52", fontWeight: "bold", textAlign: "center" }}>XX Hours Volunteered!{"\n"}
              <Text style={{ fontStyle: 'italic', fontWeight: "normal", fontSize: 15, }}>Keep up the good work!</Text>
            </Text>
          </View>
          <View style={styles.activity}>
            <Text style={{ fontSize: 20, color: "#2f3e46", marginLeft: 10, marginTop: 8, marginBottom: 7, }}>Lastest Activity</Text>
            <View style={{ flexDirection: 'row', }}>
              <Image source={require('../../../assets/gardens/garden2.jpeg')} style={styles.actImage} />
              <View style={{ flexDirection: 'column' }}>
                <Text style={{ textDecorationLine: "underline", marginBottom: 2, marginTop: 8, }}>MM/DD/YYYY</Text>
                <Text numberOfLines={3} style={{ textDecorationLine: "none", width: 185, marginBottom: 7, }}>Task Details. If it's very long, only the first three lines of it will be shown. Like this example</Text>
              </View>
            </View>
            <Text style={{fontSize: 13.5, textAlign: "right", fontStyle: 'italic', fontWeight: "bold", color: "#354f52", marginTop: -12, marginRight: 8,}}>posted x days ago...</Text>

          </View>



          <Button title="Sign out" onPress={() => signOut(FIREBASE_AUTH)} />

        </View>



      </ScrollView>

    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cad2c5',
    justifyContent: 'flex-start',
    // paddingLeft:30,
    // paddingRight: 30,
    // padding: 30,
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
    marginTop: 8,
    fontSize: 15,
    textAlign: "left",
    textDecorationLine: 'underline',
    fontWeight: "bold",
  },

  bio: {
    paddingLeft: 10,
    fontSize: 15,
    marginBottom: 15,
  },

  tags: {
    backgroundColor: "#52796f",
    marginLeft: 5,
    height: 20,
    justifyContent: "center",
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 8,
  },

  editButton: {
    backgroundColor: "#84a98c",
    marginBottom: 15,
    marginLeft: 235,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    height: 20,
  },

  totalHours: {
    backgroundColor: "#84a98c",
    height: 70,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  activity: {
    backgroundColor: "#84a98c",
    height: 145,
    borderRadius: 8,
    // justifyContent: "center",
  },

  actDetails: {
    backgroundColor: "#aaaaaa",
  },

  actImage: {
    width: 95,
    height: 95,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 8,
  },

});