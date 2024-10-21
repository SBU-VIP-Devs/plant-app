import 'react-native-gesture-handler';
import 'expo-dev-client';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, Pressable, Image, Platform, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { KeyboardAvoidingView } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import ProgressBar from '../../components/ProgressBar';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, onSnapshot } from 'firebase/firestore';
import { FIREBASE_STORAGE, FIRESTORE_DB } from '../../firebaseconfig';
import { FIREBASE_AUTH } from '../../firebaseconfig';

export default function NewGarden() {

    const testImage = "https://firebasestorage.googleapis.com/v0/b/plantapp-3d30d.appspot.com/o/GardenImages%2F1719431663739?alt=media&token=f53cdd64-a1ef-42f7-877a-432939b3867b";
    const [image, setImage] = useState<string | null>(null)
    //const imageString = '../../assets/gardens/garden1.jpeg'
    const [name, setName] = useState('MyGarden')
    const [desc, setDesc] = useState('')
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)

    //All user info imported here
    const user = FIREBASE_AUTH.currentUser;
    const username = user?.displayName ? user?.displayName : 'Unknown User'
    const userId = user ? user.uid : null
    //set rules so that in order to upload to firebase, userId will never be undefined
    //so undefined map key won't be an issue
    const userList = userId ? {[userId]: "admin"} : null
    

    function takePhotoFromCamera() {
      ImagePicker.openCamera({
        width: 300,
        height: 300,
        cropping: true,
      }).then(image => {
        console.log(image);
        const imageUri = Platform.OS == 'ios' ? image.sourceURL : image.path; 
        setImage(imageUri?imageUri:image.path)
      }).catch(error => {
        if (error.code === 'E_PICKER_CANCELLED') {
          return false;
        }
      });
    }

    function choosePhotoFromLibrary() {
      ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true
      }).then(image => {
        console.log(image);
        const imageUri = Platform.OS == 'ios' ? image.sourceURL : image.path; 
        setImage(imageUri?imageUri:image.path)
      }).catch(error => {
        if (error.code === 'E_PICKER_CANCELLED') {
          return false;
        }
      });
    }
    
    async function uploadGardenRecord(imageURL: string | null, createdAt: string, 
      gardenName: string, desc: string, username: string, userId: string | null, roles: {[key: string]: string} | null) {
      try {
        const docRef = await addDoc(collection(FIRESTORE_DB, 'garden-post-info'), {
          imageURL,
          createdAt,
          gardenName,
          desc,
          username,
          userId,
          roles
          //userImage,
          //add whether user joined locally, when creating local list, not here
          //add these here and to the top of uploadGardenRecord ^^
        })
        console.log('Document saved correctly.', docRef.id)
        Alert.alert('Garden created successfully!')
      } catch(e) {
        console.log(e)
      }
    }

    const uploadGardenPost = async () => {
      if(image) {
        const response = await fetch(image);
        //converts to binary large object (blob) to send to db
        const blob = await response.blob();

        const storageRef = ref(FIREBASE_STORAGE, 'GardenImages/IMG_' + new Date().getTime())
        const uploadTask = uploadBytesResumable(storageRef, blob)

        //listen for events
        uploadTask.on('state_changed',
          (snapshot) => {
            setUploading(true)
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            console.log('Upload is ' + progress + '% done')
            setProgress(Math.floor(progress))
          },
          (error) => {
            console.log(error)
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
              console.log('File available at', downloadURL);
              //save record
              //TODO: save profile pics per user and extract them from users
              await uploadGardenRecord(downloadURL, new Date().toISOString(), name, desc, username, userId, userList)
              
              setUploading(false)
              setImage('')
            })
          }
        )
      } else {
        await uploadGardenRecord(null, new Date().toISOString(), name, desc, username, userId, userList)
      }
    }
    
    return (
      <View style={styles.container}>
        <Text style={styles.header}>New Garden Setup</Text>
        <KeyboardAvoidingView behavior='padding'>
        <TextInput
        value={name}
        style={styles.input}
        placeholder="New Garden Name"
        autoCapitalize='none'
        onChangeText={(text) => {
          setName(text)
        }}
        />
        <TextInput
        value={desc}
        style={styles.input}
        placeholder="New Garden Description"
        autoCapitalize='none'
        multiline={true}
        numberOfLines={5}
        maxLength={300}
        onChangeText={(text) => {
          setDesc(text)
        }}
        />
        <StatusBar style="auto" />
        </KeyboardAvoidingView>
        <View style={{alignItems: 'center'}}>
          {image && <Image 
            style={{width: 300, height: 300, marginTop: 10, borderRadius: 10}} 
            source={{ uri: image }}
          />}
          <Pressable style={styles.button} onPress = {choosePhotoFromLibrary}>
              <Text style={styles.text}>Photo Library</Text>
          </Pressable>
          <Pressable style={styles.button} onPress = {takePhotoFromCamera}>
              <Text style={styles.text}>Camera</Text>
          </Pressable>
          <Pressable style={styles.button} onPress = {uploadGardenPost}>
              <Text style={styles.text}>Create Garden!</Text>
          </Pressable>
          {uploading && 
          <View style={{marginTop: 10, alignItems: 'center'}}>
            <Text style={styles.text}>Uploading...</Text>
            <ProgressBar progress={progress}/>
          </View>}
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#cad2c5',
      //alignItems: 'center',
      //justifyContent: 'center',
      padding: 15,
    },
    button: {
      alignItems: 'center',
      borderRadius: 30,
      backgroundColor: '#84a98c',
      width: '50%',
      padding: 8,
      marginTop: 10,
   },
    header: {
      fontSize: 30,
      lineHeight: 42,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      textAlign: 'left',
      color: '#2f3e46',
    },
    input: {
      marginTop: 7,
      fontSize: 15, 
      color: '#2f3e46',
      backgroundColor: 'white',
      borderWidth: 2,
      borderColor: '#2f3e46',
      borderRadius: 10,
      paddingVertical: 12,
      paddingHorizontal: 12,
    },
    text: {
      fontSize: 16,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: '#2f3e46',
    },
  });