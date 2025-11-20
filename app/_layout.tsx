import 'react-native-gesture-handler';
import 'expo-dev-client';
import { Stack } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import SignIn from './signin';
import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { FIREBASE_AUTH } from '../firebaseconfig';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Colors } from '../constants';
import db from '../services/database';

WebBrowser.maybeCompleteAuthSession();

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);
  
  //tracks loading of the user
  const [loading, setLoading] = useState(false);

  //for google auth sign in
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: Constants.expoConfig.extra.IOS_CLIENT_ID, //insert ios client id here
    androidClientId: Constants.expoConfig.extra.ANDROID_CLIENT_ID, //insert android client id here

    });



  //check locally if a previous sign in in saved and load it up
  const checkLocalUser = async () => {
    try {
      setLoading(true);
      const userJSON = await AsyncStorage.getItem("@user");
      const userData = userJSON ? JSON.parse(userJSON) : null;
      //console.log("local storage ", userData);
      setUser(userData);
    } catch(e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }


  //check if user is signed in
  useEffect(() => {
    //if(!user)
      //checkLocalUser();
    const unsub = db.auth.onAuthStateChanged((user) => {
        console.log('user', user);
        console.log(JSON.stringify(user, null, 2));
        setUser(user);

        //saves user sign info locally, encrypt this for more security
        //await AsyncStorage.setItem("@user", JSON.stringify(user))
    });
    return () => unsub();
  }, []);

  //check google sign in
  //TODO: handle other possibilities besides "success"
  useEffect(() => {
    if (response?.type == "success") {
      const { id_token } = response.params;
      db.auth.signInWithGoogleCredential(id_token);
    }
  }, [response]);


  if (loading)
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center"}}>
        <ActivityIndicator size={"large"} />
      </View>
    )

  return user ? (
      <Stack>
        <Stack.Screen name="(tabs)"
            options= {{
                title: 'Plant App',
                headerShown: true,
                headerStyle: {
                  backgroundColor: Colors.primary
                },
            }}
        />
      </Stack>
  ):(
      <SignIn promptAsync={ promptAsync }/>
  );
}
