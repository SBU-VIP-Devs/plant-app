import 'react-native-gesture-handler';
import 'expo-dev-client';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, FlatList } from 'react-native';
import GardenCard from '../../components/GardenCard';
import { Link } from 'expo-router';

export default function Gardens() {
    const gardenList = [
        {
            id: '1',
            name: 'SBU Community Garden',
            admin: 'Mr. Leaf',
            adminImg: require('../../assets/icons/icon1.png'),
            desc: 'Dedicated to making Stony Brook University a greener place!',
            gardenImg: require('../../assets/gardens/garden2.jpeg'),
            numMembers: 1,
            isJoined: true
        },
        {
            id: '2',
            name: 'Gardening Club',
            admin: 'Ms. Petal',
            adminImg: require('../../assets/icons/icon2.png'),
            desc: 'Made by gardeners, for gardeners!',
            gardenImg: null,
            numMembers: 32,
            isJoined: false
        }
    ]

  
    return (
        <View style={styles.container}>
            <FlatList
                data={gardenList}
                renderItem={({item}) => <GardenCard item={item}/>}
                keyExtractor={item=>item.id}
                showsVerticalScrollIndicator={false}
            />
            <Link href="../inputscreens/newgarden">new garden +</Link>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: 14,
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#cad2c5',
  },
});