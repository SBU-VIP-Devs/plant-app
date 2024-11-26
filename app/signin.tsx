import 'react-native-gesture-handler';
import 'expo-dev-client';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Image, Text, View, TextInput, ActivityIndicator, Button, KeyboardAvoidingView, Pressable } from 'react-native';
import { useState } from 'react';
import { FIREBASE_AUTH } from '../firebaseconfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@firebase/auth';

export default function SignIn({ promptAsync }: { promptAsync: any }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;


  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
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
      const response = await createUserWithEmailAndPassword(auth, email, password);
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
    <View style={styles.container}>
      <KeyboardAvoidingView behavior='padding'>
      <Text style={styles.header}>Welcome to the Plant App!</Text>
      <Text style={styles.text}>Sign in to get started.</Text>
      
      <TextInput
        value={email}
        style={styles.input}
        placeholder="Email"
        autoCapitalize='none'
        onChangeText={(text) => {
          setEmail(text)
        }}
      />
      <TextInput
        secureTextEntry={true}
        value={password}
        style={styles.input}
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
          <Pressable style={styles.button} onPress = {() => signIn()}>
            <Text style={styles.text}>Log In</Text>
          </Pressable>
          <Pressable style={styles.button} onPress = {() => signUp()}>
            <Text style={styles.text}>Sign Up</Text>
          </Pressable>
        </View>
      </>
      }

      <Pressable style={styles.googleButton} onPress = {() => promptAsync()}>
        <Text style={styles.text}>Sign in with Google</Text>
      </Pressable>  
      
      <StatusBar style="auto" />
      </KeyboardAvoidingView>
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
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 20,
    elevation: 3,
  },
  googleButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    elevation: 3,
    borderTopColor: '#2f3e46',
    borderTopWidth: 1
    
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: '#2f3e46',
  },
  header: {
    fontSize: 40,
    lineHeight: 42,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    textAlign: 'center',
    color: '#2f3e46',
    marginBottom: 50
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
});