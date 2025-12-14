import 'react-native-gesture-handler';
import 'expo-dev-client';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image, FlatList, Alert, ImageBackground, ScrollView, Platform, TouchableOpacity, Modal } from 'react-native';
import { Link } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { FIREBASE_AUTH } from '../../firebaseconfig';
import { signOut } from 'firebase/auth';

import { useState, useEffect } from 'react';
import { DataTable } from 'react-native-paper';
import TaskCard from '../../components/TaskCard'
import { doc, getDoc, setDoc, addDoc, QuerySnapshot, collection, getDocs, onSnapshot } from "firebase/firestore";
import { FIRESTORE_DB, FIREBASE_STORAGE } from '../../firebaseconfig';
import NewTask from '../inputscreens/newtask';

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ImagePicker from 'react-native-image-crop-picker';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';


import EditProfile from "../editProfile";

const Stack = createNativeStackNavigator();


export default function Users() {
  console.log("TESTING!!!!!!!")



  //gets number passed into path for [id]
  //  const { id } = useLocalSearchParams();


  //if you want id as a string
  //const {id} = useLocalSearchParams<{id: string}>();
  const user = FIREBASE_AUTH.currentUser;
  const userID = user?.uid;


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
  const [roleLocal, setRole] = useState<{ id: string; title: string }[]>([]);
  const [yearLocal, setYear] = useState(null);
  const [pronounsLocal, setPronouns] = useState(null);
  const [profilePic, setProfilePic] = useState<string | null>(null)
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)

    
  const [editVisible, setEditVisible] = useState(false);
  const show = () => setEditVisible(true);
  const hide = () => setEditVisible(false);

  const [dateLocal, setDate] = useState(null);
  const [detailLocal, setDetail] = useState("No details provided");
  const [locLocal, setLoc] = useState(null);
  const [editClicked, setEditClicked] = useState(false);

  //READS TASKLIST FROM FIREBASE


  // const getProfile = async () => { //getProfile var is a function
  //   try {

  //     const list: {
  //       id: string; title: string; bio?: string
  //       ; vHours?: string; actvDate?: string; actvDet?: string; actvLoc?: string
  //       ; year?: string; pronouns: string
  //     }[] = [];
  //     //const list: { id: string; title: string; name?: string; school?: string }[] = [];


  //     //change the path in the collection function to reflect the path to the collection you want (i hard coded a garden id)
  //     const querySnapshot = await getDocs(collection(FIRESTORE_DB, `profiles`));


  //     //prob grab user I Dand make a new document based on it. then add data
  //     //then pass the userID as props to editProfile so that you can edit.

  //     querySnapshot.forEach((doc) => {
  //       //THIS SHOULD MATCH THE FORMAT OF THE FIELDS BC ITS READING FROM ALL THE DATA (not just some)
  //       // ADD FIELD U WANT HERE
  //       const {
  //         bio,
  //         // email,
  //         // fname,
  //         role,
  //         vHours,
  //         actvDate,
  //         actvDet,
  //         actvLoc,
  //         year,
  //         pronouns
  //       } = doc.data()

  //       // list.push({ bio, email, fname, lname, vHours, actvDate, actvDet, actvLoc});

  //       if (role && Array.isArray(role)) {
  //         role.forEach((item: string, index: number) => {
  //           list.push({ id: `${doc.id}-${index}`, title: item, bio, vHours, actvDate, actvDet, actvLoc, year, pronouns }); // Create a unique ID for each list item
  //         });
  //       }
  //       //PUSH THE VALUES OF INTEREST
  //     });

  //     setRole(list);

  //     if (!querySnapshot.empty) {
  //       //sets each value individually

  //       //SET VALUES HERE
  //       const firstItem = querySnapshot.docs[0].data(); // Assuming you want to display the first document's data
  //       if (firstItem) {
  //         setBio(firstItem.bio);
  //         // setFname(firstItem.fname);
  //         // setLname(firstItem.lname);
  //         // setEmail(firstItem.email);
  //         // setRole(firstItem.role);
  //         setHours(firstItem.vHours);
  //         setDate(firstItem.actvDate);
  //         setDetail(firstItem.actvDet);
  //         setLoc(firstItem.actvLoc);
  //         // setRole(firstItem.role);
  //         setYear(firstItem.year);
  //         setPronouns(firstItem.pronouns);

  //       }

  //     }
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }


  const getProfile = async () => { //getProfile var is a function
    if (userID) {
      const docRef = doc(FIRESTORE_DB, "profiles", userID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
          const profileData = docSnap.data();

          setBio(profileData.bio);
          setHours(profileData.vHours);
          // setDate(profileData.actvDate);
          // setDetail(profileData.actvDet);
          // setLoc(profileData.actvLoc);
          // setRole(firstItem.role);
          setYear(profileData.year);
          setPronouns(profileData.pronouns);

          //libary from jamies code, upload image to image, get that link
          //when save to firebase, put the link
          // ...
      } else {
        await setDoc(docRef, {
                bio: "",
                vHours: 0,
                year: "",
                pronouns: ""
                // ... other default fields
            });
      }
    } else {

    }

  }

  useEffect(() => {
    getProfile();
  }, [])


  const onRefresh = () => {
    getProfile();
  }





// function takePhotoFromCamera() {
//       ImagePicker.openCamera({
//         width: 300,
//         height: 300,
//         cropping: true,
//       }).then(profilePic => {
//         console.log(profilePic);
//         const imageUri = Platform.OS == 'ios' ? profilePic.sourceURL : profilePic.path; 
//         setProfilePic(imageUri?imageUri:profilePic.path)
//       }).catch(error => {
//         if (error.code === 'E_PICKER_CANCELLED') {
//           return false;
//         }
//       });
//     }

//     function choosePhotoFromLibrary() {
//       ImagePicker.openPicker({
//         width: 300,
//         height: 300,
//         cropping: true
//       }).then(profilePic => {
//         console.log(profilePic);
//         const imageUri = Platform.OS == 'ios' ? profilePic.sourceURL : profilePic.path; 
//         setProfilePic(imageUri?imageUri:profilePic.path)
//       }).catch(error => {
//         if (error.code === 'E_PICKER_CANCELLED') {
//           return false;
//         }
//       });
//     }
    
    // async function uploadGardenRecord(imageURL: string | null, createdAt: string, 
    //   gardenName: string, desc: string, username: string, userId: string | null, roles: {[key: string]: string} | null) {
    //   try {
    //     const docRef = await addDoc(collection(FIRESTORE_DB, 'garden-post-info'), {
    //       imageURL,
    //       createdAt,
    //       gardenName,
    //       desc,
    //       username,
    //       userId,
    //       roles
    //       //userImage,
    //       //add whether user joined locally, when creating local list, not here
    //       //add these here and to the top of uploadGardenRecord ^^
    //     })
    //     console.log('Document saved correctly.', docRef.id)
    //     Alert.alert('Garden created successfully!')
    //   } catch(e) {
    //     console.log(e)
    //   }
    // }

    // const uploadGardenPost = async () => {
    //   if(profilePic) {
    //     const response = await fetch(profilePic);
    //     //converts to binary large object (blob) to send to db
    //     const blob = await response.blob();

    //     const storageRef = ref(FIREBASE_STORAGE, 'GardenImages/IMG_' + new Date().getTime())
    //     const uploadTask = uploadBytesResumable(storageRef, blob)

    //     //listen for events
    //     uploadTask.on('state_changed',
    //       (snapshot) => {
    //         setUploading(true)
    //         const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
    //         console.log('Upload is ' + progress + '% done')
    //         setProgress(Math.floor(progress))
    //       },
    //       (error) => {
    //         console.log(error)
    //       },
    //       () => {
    //         getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
    //           console.log('File available at', downloadURL);
    //           //save record
    //           //TODO: save profile pics per user and extract them from users
    //           await uploadGardenRecord(downloadURL, new Date().toISOString(), name, desc, username, userId, userList)
              
    //           setUploading(false)
    //           setProfilePic('')
    //         })
    //       }
    //     )
    //   } else {
    //     await uploadGardenRecord(null, new Date().toISOString(), name, desc, username, userId, userList)
    //   }
    // }
    





  return (
    <View style={styles.container}>
      <ScrollView>
        <ImageBackground style={{ height: 125, opacity: 0.7, }}
          source={require('../../assets/gardens/garden1.jpeg')}
        />


        <View style={{ paddingLeft: 25, paddingRight: 25 }}>
          <View style={{ alignItems: 'center', marginTop: -45, }}>
            <Image source={require('../../assets/flower.jpg')} style={styles.profilepic} />
            <Text style={styles.name}>{fnameLocal}</Text>
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
            {/* <ScrollView horizontal={true}>
             {roleLocal.map((role) => (
               <View key={role.id} style={styles.tags}>
                 <Text style={{ color: "#cad2c5", fontWeight: "bold" }}>{String(role.title)}</Text>
               </View>
             ))}
           </ScrollView> */}
            <ScrollView horizontal={true} >
                {yearLocal !== "" && (
                  <View style={styles.tags}>
                    <Text style={{ color: "#cad2c5", fontWeight: "bold" }}>{yearLocal}</Text>
                  </View>
                )}
                {pronounsLocal !== "" && (
                  <View style={styles.tags}>
                    <Text style={{ color: "#cad2c5", fontWeight: "bold" }}>{pronounsLocal}</Text>
                  </View>
                )}
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
                <View style={{ marginTop: 50 }}>
                  <Button title='Close' onPress={hide} />
                  {/* <NewGarden/> */}
                </View>
                <View>
                  <EditProfile onHide={hide} onRefresh={onRefresh} oldbio={bioLocal} roleTags={roleLocal} userID={userID} oldYear={yearLocal} oldPronouns={pronounsLocal}/>
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

