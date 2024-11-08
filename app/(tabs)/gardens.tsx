import 'react-native-gesture-handler';
import 'expo-dev-client';
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, FlatList, Modal, Pressable, RefreshControl } from 'react-native';
import GardenCard from '../../components/GardenCard';
import { Link } from 'expo-router';
import NewGarden from '../inputscreens/newgarden';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FIRESTORE_DB } from '../../firebaseconfig';
import { QuerySnapshot, collection, getDocs } from "firebase/firestore";

// export const gardenList = [
//     {
//         id: '1',
//         name: 'SBU Community Garden',
//         admin: 'Mr. Leaf',
//         adminImg: require('../../assets/icons/icon1.png'),
//         desc: 'Dedicated to making Stony Brook University a greener place!',
//         gardenImg: require('../../assets/gardens/garden2.jpeg'),
//         numMembers: 1,
//         isJoined: true
//     },
//     {
//         id: '2',
//         name: 'Gardening Club',
//         admin: 'Ms. Petal',
//         adminImg: require('../../assets/icons/icon2.png'),
//         desc: 'Made by gardeners, for gardeners!',
//         gardenImg: null,
//         numMembers: 32,
//         isJoined: false
//     }
// ]

export interface GardenData {
    id: string;
    createdAt: string;
    gardenName: string;
    desc: string;
    imageURL: string;
    username: string;
    userImage: string;
    joined: boolean;
    roles: {[key: string]: string};
};

export default function Gardens() {
    const [gardenList, updateGardenList] = useState(null);
    const [loading, setLoading] = useState(true);

    const getGardenList = async () => { 
        try {
            const list: any = []
            const querySnapshot = await getDocs(collection(FIRESTORE_DB, "garden-post-info")) 
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                //console.log(doc.id, " => ", doc.data());
                const {userId, createdAt, gardenName, desc, imageURL, username, roles} = doc.data()
                list.push({ 
                    id: doc.id,
                    userId,
                    userImage: "https://firebasestorage.googleapis.com/v0/b/plantapp-3d30d.appspot.com/o/GardenImages%2F1719431663739?alt=media&token=f53cdd64-a1ef-42f7-877a-432939b3867b",
                    //add whether user joined locally
                    joined: false,
                    createdAt,
                    gardenName,
                    desc,
                    imageURL,
                    username,
                    roles
                })
            });
            updateGardenList(list)

            if(loading) {
                setLoading(false)
            }

            console.log('posts: ', list)
        } catch(e) {
            console.log(e)
        }
    }
    
    useEffect(() => {
        getGardenList();
    }, [])

    const [newGardenVisible, setNewGardenVisible] = useState(false);
    const show = () => setNewGardenVisible(true);
    const hide = () => setNewGardenVisible(false);

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        // Fetch new data from your API
        getGardenList();
        setRefreshing(false);
    };

    return (
        <View style={styles.container}>
            <FlatList
                style={{width: '90%'}}
                data={gardenList}
                renderItem={({item}: {item: GardenData}) => {
                    return <GardenCard item={item} key={item.id}/>
                }}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />}
            />
            <Button title='New Garden +' onPress={show} />
            {/* <Button title='gardenlist' onPress={getGardenList} /> */}
            <Modal
                visible={newGardenVisible}
                onRequestClose={hide}
                animationType='slide'
            >
                <View style={{ flex: 1, marginTop: 50}}>
                    <Button title='Close' onPress={hide} />
                    <NewGarden/>
                </View>
            </Modal>
            {/* <Link href="../inputscreens/newgarden">new garden +</Link> */}
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingTop: 20,
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#cad2c5',
  },
});