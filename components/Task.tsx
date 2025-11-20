import { Button, View, StyleSheet, Text, Image, Pressable } from 'react-native';


export default function Task() {


    return (
        <View style={styles.container}>
            <Text>Tasks</Text>
            
            </View>
    )
}



const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: '#84a98c',
        borderRadius: 10,
        marginBottom: 20,
        paddingTop: 10,
        paddingBottom: 10,
    }
})
