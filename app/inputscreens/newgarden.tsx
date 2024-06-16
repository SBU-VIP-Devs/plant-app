import 'react-native-gesture-handler';
import 'expo-dev-client';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, Pressable } from 'react-native';
import { useState } from 'react';
import { KeyboardAvoidingView } from 'react-native';

export default function NewGarden() {
  const [name, setName] = useState('MyGarden');
  const [desc, setDesc] = useState('');

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
        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
          <Pressable style={styles.button} onPress = {() => console.log('choose from camera roll')}>
            <Text style={styles.text}>Camera Roll</Text>
          </Pressable>
          <Pressable style={styles.button} onPress = {() => console.log('take photo')}>
            <Text style={styles.text}>Take Photo</Text>
          </Pressable>
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
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 20,
      elevation: 3,
    },
    text: {
      fontSize: 16,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: '#2f3e46',
    },
  });