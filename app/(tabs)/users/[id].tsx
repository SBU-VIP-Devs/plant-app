import 'react-native-gesture-handler';
import 'expo-dev-client';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image, FlatList, ImageBackground, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Link } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { FIREBASE_AUTH } from '../../../firebaseconfig';
import { signOut } from 'firebase/auth';

// import { collection, getDocs } from "firebase/firestore";
// import { FIRESTORE_DB } from '../../../firebaseconfig';

import { useState, useEffect } from 'react';
import { DataTable } from 'react-native-paper';
import TaskCard from '../../../components/TaskCard'
import { QuerySnapshot, collection, getDocs } from "firebase/firestore";
import { FIRESTORE_DB } from '../../../firebaseconfig';
import NewTask from '../../inputscreens/newtask';
// import GardenSettings from '../../inputscreens/gardensettings';

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EditProfile from "../../editProfile";

const Stack = createNativeStackNavigator();


export default function Users() {

  //gets number passed into path for [id] 
  const { id } = useLocalSearchParams();


  //if you want id as a string
  //const {id} = useLocalSearchParams<{id: string}>();
  const user = FIREBASE_AUTH.currentUser;
  //user?.email, user?.uid




  //J START

  //local list to display the task data
  //state var declaration:    const [var, setVar] = useState("a default msg");
  //var is the var name and stores the state "default disc", setVar will update the default using setVar(new value);
  const [descLocal, setDesc] = useState("default desc");
  const [gardenIdLocal, setGardenId] = useState("default desc");
  const [locationLocal, setLocation] = useState("default loc");

  // 1. CREATE VARIABLE (USESTATE SO U CAN EDIT)

  // if(user!=null && user.displayName!=null) { // name could be grabbed from email}
  const [fnameLocal, setFname] = useState("Sprout");
  const [lnameLocal, setLname] = useState("Doe");
  const [bioLocal, setBio] = useState(null); //bioLocal && (<Text>{bioLocal}</Text>) // Only shows the bio if exists
  const [emailLocal, setEmail] = useState("member@sprout.com");
  const [hoursLocal, setHours] = useState(0);
  const [dateLocal, setDate] = useState(null);
  const [detailLocal, setDetail] = useState("No details provided");
  const [locLocal, setLoc] = useState(null);
  const [roleLocal, setRole] = useState<{ id: string; title: string }[]>([]);

  const [editClicked, setEditClicked] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const show = () => setEditVisible(true);
  const hide = () => setEditVisible(false);

  //READS TASKLIST FROM FIREBASE
  const getTest = async () => { //getTest var is a function
    try {
      // const list: any = []
      const list: {
        id: string; title: string; bio?: string; email?: string; fname?: string; lname?: string
        ; vHours?: string; actvDate?: string; actvDet?: string; actvLoc?: string
      }[] = [];
      //const list: { id: string; title: string; name?: string; school?: string }[] = [];

      //change the path in the collection function to reflect the path to the collection you want (i hard coded a garden id)
      const querySnapshot = await getDocs(collection(FIRESTORE_DB, `profiles`));


      querySnapshot.forEach((doc) => {
        //THIS SHOULD MATCH THE FORMAT OF THE FIELDS BC ITS READING FROM ALL THE DATA (not just some)

        // ADD FIELD U WANT HERE
        const {
          bio,
          email,
          fname,
          lname,

          role,

          vHours,
          actvDate,
          actvDet,
          actvLoc
        } = doc.data()


        // list.push({ bio, email, fname, lname, vHours, actvDate, actvDet, actvLoc});

        if (role && Array.isArray(role)) {
          role.forEach((item: string, index: number) => {
            list.push({ id: `${doc.id}-${index}`, title: item, bio, email, fname, lname, vHours, actvDate, actvDet, actvLoc }); // Create a unique ID for each list item
          });
        }

        //PUSH THE VALUES OF INTEREST
      });

      setRole(list);

      if (!querySnapshot.empty) {
        //sets each value individually

        //SET VALUES HERE
        const firstItem = querySnapshot.docs[0].data(); // Assuming you want to display the first document's data
        if (firstItem) {
          setBio(firstItem.bio);
          setFname(firstItem.fname);
          setLname(firstItem.lname);
          setEmail(firstItem.email);
          // setRole(firstItem.role);
          setHours(firstItem.vHours);
          setDate(firstItem.actvDate);
          setDetail(firstItem.actvDet);
          setLoc(firstItem.actvLoc);
          // setRole(firstItem.role);

        }



      }
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getTest();
  }, [])

  const onRefresh = () => {
    getTest();
  }

  //J END


  {/* <Text style={styles.name}>{gardenIdLocal} {bioLocal}</Text> */ }

  // const roleList = [
  //   { id: '1', title: 'Major' },
  //   { id: '2', title: 'Year' },
  //   { id: '3', title: 'Pronouns' },
  //   { id: '4', title: 'Role' },
  // ];


  return (
    <View style={styles.container}>
      <ScrollView>
        <ImageBackground style={{ height: 125, opacity: 0.7, }}
          source={require('../../../assets/gardens/garden1.jpeg')}
        />

        <View style={{ paddingLeft: 25, paddingRight: 25 }}>
          <View style={{ alignItems: 'center', marginTop: -45, }}>
            <Image source={require('../../../assets/flower.jpg')} style={styles.profilepic} />
            <Text style={styles.name}>{fnameLocal} {lnameLocal}</Text>
            <Text style={styles.email}>{emailLocal}</Text>
            {/* <Text style={styles.email}>{user?.email}</Text> */}
          </View>

          <Text style={styles.bioTitle}>Bio:</Text>
          <Text style={styles.bio}>{bioLocal}</Text>
          <View style={{ height: 28 }}>


            {/* {roleLocal.map((role) => (
    <Text key={role.id}>{role.title}</Text>
  ))}
 */}
            <ScrollView horizontal={true}>
              {roleLocal.map((role) => (
                <View key={role.id} style={styles.tags}>
                  <Text style={{ color: "#cad2c5", fontWeight: "bold" }}>{String(role.title)}</Text>
                </View>
              ))}
            </ScrollView>
            {/* <FlatList
              data={roleList}
              renderItem={({ item }) =>
              (<View style={styles.tags}>
                <Text style={{ color: "#cad2c5", fontWeight: "bold" }}> {item.title} </Text>
              </View>)}
              keyExtractor={item => item.id}
              horizontal={true}
            /> */}
          </View>


          <View style={styles.buttonContainer}>
            {/* <Text>Test</Text> */}
            <View>
              {/* <TouchableOpacity style={styles.editButton} onPress={() => setEditClicked(true)}>  */}
              <TouchableOpacity style={styles.editButton} onPress={show}>

                {/* onPress={show} */}
                <Text>Edit Profile</Text>
              </TouchableOpacity>

              <Modal
                visible={editVisible}
                onRequestClose={hide}
                animationType='slide'
              >
                <View style={{ flex: 1, marginTop: 50 }}>
                  <Button title='Close' onPress={hide} />
                  {/* <NewGarden/> */}
                </View>
                <View>
                  <EditProfile />
                </View>
              </Modal>


            </View>



          </View>


          <View style={styles.totalHours}>

            {
              hoursLocal > 0 ? (
                <Text style={{ fontSize: 22, color: "#354f52", fontWeight: "bold", textAlign: "center" }}>{hoursLocal} Hours Volunteered!{"\n"}
                  <Text style={{ fontStyle: 'italic', fontWeight: "normal", fontSize: 15, }}>Keep up the good work!</Text>
                </Text>
              ) : (<Text style={{ fontStyle: 'italic', fontWeight: "normal", fontSize: 15, }}>No Hours Yet!</Text>)}

          </View>
          <View style={styles.activity}>
            <Text style={{ fontSize: 20, color: "#2f3e46", marginLeft: 10, marginTop: 8, marginBottom: 7, }}>Lastest Activity</Text>
            <View style={{ flexDirection: 'row', }}>
              <Image source={require('../../../assets/gardens/garden2.jpeg')} style={styles.actImage} />
              <View style={{ flexDirection: 'column' }}>
                <Text style={{ textDecorationLine: "underline", marginBottom: 2, marginTop: 8, }}>{dateLocal}</Text>
                <Text numberOfLines={3} style={{ textDecorationLine: "none", width: 185, marginBottom: 7, }}>{detailLocal}</Text>
              </View>
            </View>
            <Text style={{ fontSize: 13.5, textAlign: "right", fontStyle: 'italic', fontWeight: "bold", color: "#354f52", marginTop: -12, marginRight: 8, }}>{locLocal}</Text>

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
    // marginBottom: 15,
    marginLeft: 235,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    height: 20,
    width: 90,
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
  buttonContainer: {
    // Added padding to ensure the button is not cramped
    paddingBottom: 10,
    justifyContent: 'center', // Center the button
    alignItems: 'center', // Center the button horizontally
    color: "#000000",
  },

  test: {
    // width: 200,
    // height: 200,
    // justifyContent: 'center',
    // alignItems: 'center',
    // borderWidth: 2,            // Thickness of the border
    // borderColor: '#000',       // Color of the border
    // borderRadius: 10,          // Rounded corners (optional)
    // padding: 20,      
    // fontSize: 2,
    backgroundColor: "#84a98c",
    marginBottom: 15,
    marginLeft: 235,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    height: 20,
    width: 100,
  }

});