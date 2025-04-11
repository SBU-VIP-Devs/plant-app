// import 'react-native-gesture-handler';
// import 'expo-dev-client';
import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, TextInput } from 'react-native';


export default function EditProfile() {
    // const length = 
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={{ marginBottom: 10 }}>
                    <Text>Edit Bio: </Text>
                    <TextInput style={styles.text} multiline={true} maxLength={150} />
                    <Text style={{ fontSize: 8 }}>-/150 characters left</Text>
                </View>
                <View style={{marginBottom: 10,}}>
                    <Text>Click to delete</Text>
                    <Text style={{borderColor: '#84a98c', borderWidth: 2,margin:5}}>*In progress..</Text>
                    
                </View>
                <View style={{ marginBottom: 10,}}>
                    <Text>Add Tag: </Text>
                    <TextInput style={styles.text} multiline={true} maxLength={20} />
                    <Text style={{ fontSize: 8 }}>-/20 characters left</Text>

                </View>
                <TextInput />
            </View>
        </View>
    );
}
// const EditProfile = () => {
//     return (
//       <View style={styles.container}>
//         <Text>Edit your profile here ✏️</Text>
//       </View>
//     );
//   };
  
//   export default EditProfile;
  


const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // backgroundColor: '#cad2c5',
        // // justifyContent: 'flex-start',
        // // height: 340,
        // width: 320,
        // borderColor: '#354f52',
        // borderRadius: 5,
        // borderWidth: 2,
        // padding: 10,
        // alignItems: 'center',

        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',

    },
    content: {
        // borderColor: '#cad2c5',
        // borderRadius: 5,
        width: '100%',
        height: '85%',
        // borderWidth: 2,
    },
    save: {
        backgroundColor: '#84a98c',
        borderRadius: 5,
        // borderWidth: 1,
        paddingLeft: 10,
        paddingRight: 10,
        position: 'absolute', // Fix the element to the bottom
        bottom: 10,
    },
    text: {
        borderWidth: 2,
        // height: 50,
        borderColor: '#84a98c'
    },
});

