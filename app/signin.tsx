import 'react-native-gesture-handler';
import 'expo-dev-client';
import { StatusBar } from 'expo-status-bar';
import { Image, Text, View, TextInput, ActivityIndicator, Button, KeyboardAvoidingView, Pressable } from 'react-native';
import { useState } from 'react';
import { FIREBASE_AUTH } from '../firebaseconfig';
import { CommonStyles } from '../styles';
import { Colors, Spacing, BorderRadius, FontSizes } from '../constants';
import db from '../services/database';

export default function SignIn({ promptAsync }: { promptAsync: any }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;


  const signIn = async () => {
    setLoading(true);
    try {
      const response = await db.auth.signIn(email, password);
      console.log(response);
    } catch (error: any) {
      console.log(error);
      alert('Sign in failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  const signUp = async () => {
    setLoading(true);
    try {
      const response = await db.auth.signUp(email, password);
      console.log(response);
      alert('check emails');
    } catch (error: any) {
      console.log(error);
      alert('Sign in failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{flex: 1, backgroundColor: '#cad2c5', alignItems: 'center', justifyContent: 'center'}}>
      <KeyboardAvoidingView behavior='padding'>
      <Text style={{fontSize: 40, lineHeight: 42, fontWeight: 'bold', letterSpacing: 0.25, textAlign: 'center', color: '#2f3e46', marginBottom: 50}}>Welcome to     Sprout!</Text>
      <Text style={{fontSize: 16, lineHeight: 21, fontWeight: 'bold', letterSpacing: 0.25, color: '#2f3e46'}}>Sign in to get started.</Text>

      <TextInput
        value={email}
        style={{marginTop: 7, fontSize: 15, color: '#2f3e46', backgroundColor: 'white', borderWidth: 2, borderColor: '#2f3e46', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 12}}
        placeholder="Email"
        autoCapitalize='none'
        onChangeText={(text) => {
          setEmail(text)
        }}
      />
      <TextInput
        secureTextEntry={true}
        value={password}
        style={{marginTop: 7, fontSize: 15, color: '#2f3e46', backgroundColor: 'white', borderWidth: 2, borderColor: '#2f3e46', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 12}}
        placeholder="Password"
        autoCapitalize='none'
        onChangeText={(text) => {
          setPassword(text)
        }}
      />

      {loading ?
      <ActivityIndicator size="large" color="#0000ff"/>
      :
      <>
        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
          <Pressable style={{alignItems: 'center', justifyContent: 'center', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 20, elevation: 3}} onPress = {() => signIn()}>
            <Text style={{fontSize: 16, lineHeight: 21, fontWeight: 'bold', letterSpacing: 0.25, color: '#2f3e46'}}>Log In</Text>
          </Pressable>
          <Pressable style={{alignItems: 'center', justifyContent: 'center', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 20, elevation: 3}} onPress = {() => signUp()}>
            <Text style={{fontSize: 16, lineHeight: 21, fontWeight: 'bold', letterSpacing: 0.25, color: '#2f3e46'}}>Sign Up</Text>
          </Pressable>
        </View>
      </>
      }

      <Pressable style={{alignItems: 'center', justifyContent: 'center', paddingVertical: 12, paddingHorizontal: 10, elevation: 3, borderTopColor: '#2f3e46', borderTopWidth: 1}} onPress = {() => promptAsync()}>
        <Text style={{fontSize: 16, lineHeight: 21, fontWeight: 'bold', letterSpacing: 0.25, color: '#2f3e46'}}>Sign in with Google</Text>
      </Pressable>  
      
      <StatusBar style="auto" />
      </KeyboardAvoidingView>
    </View>
  );
}