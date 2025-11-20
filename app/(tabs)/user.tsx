import 'react-native-gesture-handler';
import 'expo-dev-client';
import { StatusBar } from 'expo-status-bar';
import { Text, View, Button, Image, FlatList, ImageBackground, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Link } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { FIREBASE_AUTH } from '../../firebaseconfig';


// import { collection, getDocs } from "firebase/firestore";
// import { FIRESTORE_DB } from '../../../firebaseconfig';


import { useState, useEffect } from 'react';
import { DataTable } from 'react-native-paper';
import TaskCard from '../../components/TaskCard'
import NewTask from '../inputscreens/newtask';

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EditProfile from "../editProfile";
import { Colors, FontSizes, Spacing, BorderRadius } from '../../constants';
import db from '../../services/database';

const Stack = createNativeStackNavigator();


export default function Users() {


 //gets number passed into path for [id]
 const { id } = useLocalSearchParams();

  



 //if you want id as a string
 //const {id} = useLocalSearchParams<{id: string}>();
 const user = FIREBASE_AUTH.currentUser;


 //local list to display the task data
 //state var declaration:    const [var, setVar] = useState("a default msg");
 //var is the var name and stores the state "default disc", setVar will update the default using setVar(new value);
 const [descLocal, setDesc] = useState("default desc");
 const [gardenIdLocal, setGardenId] = useState("default desc");
 const [locationLocal, setLocation] = useState("default loc");


 // 1. CREATE VARIABLE (USESTATE SO U CAN EDIT)


 // if(user!=null && user.displayName!=null) { // name could be grabbed from email}
 // const [fnameLocal, setFname] = useState("Sprout");
 const [fnameLocal, setFname] = useState(user?.displayName);
 // const [lnameLocal, setLname] = useState("Doe");
 const [emailLocal, setEmail] = useState(user?.email);
 const [bioLocal, setBio] = useState(null); //bioLocal && (<Text>{bioLocal}</Text>) // Only shows the bio if exists
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


  const getProfile = async () => {
   try {
     const profiles = await db.users.getAllProfiles();

     const list: {
       id: string; title: string; bio?: string
       ; vHours?: number; actvDate?: string; actvDet?: string; actvLoc?: string
     }[] = [];

     profiles.forEach((profile) => {
       const { id, bio, role, vHours, actvDate, actvDet, actvLoc } = profile;

       if (role && Array.isArray(role)) {
         role.forEach((item: string, index: number) => {
           list.push({ id: `${id}-${index}`, title: item, bio, vHours, actvDate, actvDet, actvLoc });
         });
       }
     });

     setRole(list);

     if (profiles.length > 0) {
       const firstProfile = profiles[0];
       if (firstProfile) {
         setBio(firstProfile.bio || null);
         setHours(firstProfile.vHours || 0);
         setDate(firstProfile.actvDate || null);
         setDetail(firstProfile.actvDet || "No details provided");
         setLoc(firstProfile.actvLoc || null);
       }
     }
   } catch (e) {
     console.log(e)
   }
 }






 useEffect(() => {
   getProfile();
 }, [])


 const onRefresh = () => {
   getProfile();
 }





 return (
   <View style={{flex: 1, backgroundColor: Colors.lightBackground, justifyContent: 'flex-start'}}>
     <ScrollView>
       <ImageBackground style={{ height: 125, opacity: 0.7, }}
         source={require('../../assets/gardens/garden1.jpeg')}
       />


       <View style={{ paddingLeft: 25, paddingRight: 25 }}>
         <View style={{ alignItems: 'center', marginTop: -45, }}>
           <Image source={require('../../assets/flower.jpg')} style={{height: 100, width: 100, borderRadius: 100, borderWidth: 4, borderColor: Colors.primaryDark}} />
           <Text style={{fontWeight: "bold", fontSize: FontSizes.title, color: Colors.darkText}}>{fnameLocal}</Text>
           <Text style={{fontWeight: "bold", color: Colors.primaryDark}}>{emailLocal}</Text>
           {/* <Text style={{fontWeight: "bold", color: Colors.primaryDark}}>{user?.email}</Text> */}
         </View>


         <Text style={{marginTop: Spacing.small, fontSize: FontSizes.body, textAlign: "left", textDecorationLine: 'underline', fontWeight: "bold"}}>Bio:</Text>
         <Text style={{paddingLeft: Spacing.small, fontSize: FontSizes.body, marginBottom: Spacing.large}}>{bioLocal}</Text>
         <View style={{ height: 28 }}>




           {/* {roleLocal.map((role) => (
   <Text key={role.id}>{role.title}</Text>
 ))}
*/}
           <ScrollView horizontal={true}>
             {roleLocal.map((role) => (
               <View key={role.id} style={{backgroundColor: Colors.primaryDark, marginLeft: Spacing.small, height: 20, justifyContent: "center", paddingLeft: Spacing.small, paddingRight: Spacing.small, borderRadius: BorderRadius.small}}>
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




         <View style={{paddingBottom: Spacing.small, justifyContent: 'center', alignItems: 'center', color: Colors.darkText}}>
           {/* <Text>Test</Text> */}
           <View>
             {/* <TouchableOpacity style={{backgroundColor: Colors.primary, marginBottom: 15, marginLeft: 235, alignItems: "center", justifyContent: "center", borderRadius: BorderRadius.small, height: 20, width: 90}} onPress={() => setEditClicked(true)}>  */}
             <TouchableOpacity style={{backgroundColor: Colors.primary, marginLeft: 235, alignItems: "center", justifyContent: "center", borderRadius: BorderRadius.small, height: 20, width: 90}} onPress={show}>


               {/* onPress={show} */}
               <Text>Edit Profile</Text>
             </TouchableOpacity>


             <Modal
               visible={editVisible}
               onRequestClose={hide}
               animationType='slide'
             >
               <View style={{ marginTop: 50 }}>
                 <Button title='Close' onPress={hide} />
                 {/* <NewGarden/> */}
               </View>
               <View>
                 <EditProfile onHide={hide} onRefresh={onRefresh} oldbio={bioLocal} roleTags = {roleLocal} />
               </View>
             </Modal>




           </View>






         </View>




         <View style={{backgroundColor: Colors.primary, height: 70, borderRadius: BorderRadius.small, justifyContent: "center", alignItems: "center", marginBottom: Spacing.small}}>


           {
             hoursLocal > 0 ? (
               <Text style={{ fontSize: FontSizes.title, color: Colors.primaryDark, fontWeight: "bold", textAlign: "center" }}>{hoursLocal} Hours Volunteered!{"\n"}
                 <Text style={{ fontStyle: 'italic', fontWeight: "normal", fontSize: FontSizes.body, }}>Keep up the good work!</Text>
               </Text>
             ) : (<Text style={{ fontStyle: 'italic', fontWeight: "normal", fontSize: FontSizes.body, }}>No Hours Yet!</Text>)}


         </View>
         {/* <View style={styles.activity}>
           <Text style={{ fontSize: 20, color: "#2f3e46", marginLeft: 10, marginTop: 8, marginBottom: 7, }}>Lastest Activity</Text>
           <View style={{ flexDirection: 'row', }}>
             <Image source={require('../../../assets/gardens/garden2.jpeg')} style={styles.actImage} />
             <View style={{ flexDirection: 'column' }}>
               <Text style={{ textDecorationLine: "underline", marginBottom: 2, marginTop: 8, }}>{dateLocal}</Text>
               <Text numberOfLines={3} style={{ textDecorationLine: "none", width: 185, marginBottom: 7, }}>{detailLocal}</Text>
             </View>
           </View>
           <Text style={{ fontSize: 13.5, textAlign: "right", fontStyle: 'italic', fontWeight: "bold", color: "#354f52", marginTop: -12, marginRight: 8, }}>{locLocal}</Text>


         </View> */}






         <Button title="Sign out" onPress={() => db.auth.signOut()} />


       </View>






     </ScrollView>


   </View>


 );
}
