import 'react-native-gesture-handler';
import 'expo-dev-client';
import { StatusBar } from 'expo-status-bar';
import { Text, View, Button, TextInput, Pressable, Image, Platform, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { KeyboardAvoidingView } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import ProgressBar from '../../components/ProgressBar';
import { FIREBASE_AUTH } from '../../firebaseconfig';
import { CommonStyles } from '../../styles';
import { Colors, Spacing, BorderRadius } from '../../constants';
import db from '../../services/database';

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
        const gardenId = await db.gardens.createGarden({
          imageURL,
          createdAt,
          gardenName,
          desc,
          username,
          userId,
          roles
        })
        console.log('Document saved correctly.', gardenId)
        Alert.alert('Garden created successfully!')
      } catch(e) {
        console.log(e)
      }
    }

    const uploadGardenPost = async () => {
      if(image) {
        try {
          setUploading(true)
          const storagePath = 'GardenImages/IMG_' + new Date().getTime()

          const downloadURL = await db.storage.uploadImage(
            storagePath,
            image,
            (progress) => {
              console.log('Upload is ' + progress.percentage + '% done')
              setProgress(Math.floor(progress.percentage))
            }
          )

          console.log('File available at', downloadURL);
          await uploadGardenRecord(downloadURL, new Date().toISOString(), name, desc, username, userId, userList)

          setUploading(false)
          setImage('')
        } catch (error) {
          console.log(error)
          setUploading(false)
        }
      } else {
        await uploadGardenRecord(null, new Date().toISOString(), name, desc, username, userId, userList)
      }
    }
    
    return (
      <View style={CommonStyles.screenContainer}>
        <Text style={CommonStyles.pageHeader}>New Garden Setup</Text>
        <KeyboardAvoidingView behavior='padding'>
        <TextInput
        value={name}
        style={CommonStyles.textInput}
        placeholder="New Garden Name"
        autoCapitalize='none'
        onChangeText={(text) => {
          setName(text)
        }}
        />
        <TextInput
        value={desc}
        style={CommonStyles.textInput}
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
        <View style={CommonStyles.centeredView}>
          {image && <Image
            style={CommonStyles.thumbnailImage}
            source={{ uri: image }}
          />}
          <Pressable style={CommonStyles.primaryButton} onPress = {choosePhotoFromLibrary}>
              <Text style={CommonStyles.buttonText}>Photo Library</Text>
          </Pressable>
          <Pressable style={CommonStyles.primaryButton} onPress = {takePhotoFromCamera}>
              <Text style={CommonStyles.buttonText}>Camera</Text>
          </Pressable>
          <Pressable style={CommonStyles.primaryButton} onPress = {uploadGardenPost}>
              <Text style={CommonStyles.buttonText}>Create Garden!</Text>
          </Pressable>
          {uploading &&
          <View style={{marginTop: Spacing.small, alignItems: 'center'}}>
            <Text style={CommonStyles.buttonText}>Uploading...</Text>
            <ProgressBar progress={progress}/>
          </View>}
        </View>
      </View>
    );
  }