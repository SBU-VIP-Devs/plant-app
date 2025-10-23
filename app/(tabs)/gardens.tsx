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
import { FIREBASE_AUTH } from '../../firebaseconfig';
import GardenSettings from '../inputscreens/gardensettings';
import GardenDetails from '../inputscreens/gardendetails';

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
    
    //USER DATA
    const user = FIREBASE_AUTH.currentUser;
    const username = user?.displayName ? user?.displayName : 'Unknown User'
    const userId = user ? user.uid : null

    //GARDEN LIST READ
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

            // console.log('posts: ', list)
        } catch(e) {
            console.log(e)
        }
    }
    
    useEffect(() => {
        getGardenList();
    }, [])

    
    //REFRESHING GARDEN LIST
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        // Fetch new data from your API
        getGardenList();
        setRefreshing(false);
    };

    //CREATE NEW GARDEN MODAL
    const [newGardenVisible, setNewGardenVisible] = useState(false);
    const showNewGarden = () => setNewGardenVisible(true);
    const hideNewGarden = () => setNewGardenVisible(false);

    //RECOGNIZE CURRENT GARDEN ID
    const [selectedGardenId, setSelectedGardenId] = useState<string | null>(null);

    //OPEN SETTINGS MODAL
    const [gardenSettingsVisible, setGardenSettingsVisible] = useState(false);
    
    const handleOpenSettings = (gardenId: string): void => {
        setSelectedGardenId(gardenId);
        setGardenSettingsVisible(true);
      };
    
    const handleCloseSettings = (): void => {
        setGardenSettingsVisible(false);
        setSelectedGardenId(null);
    };
    
    //OPEN DETAILS + AVAILABLE TASKS MODAL
    const [gardenDetailsVisible, setGardenDetailsVisible] = useState(false);
    
    const handleOpenDetails = (gardenId: string): void => {
        setSelectedGardenId(gardenId);
        setGardenDetailsVisible(true);
      };
    
      const handleCloseDetails = (): void => {
        setGardenDetailsVisible(false);
        setSelectedGardenId(null);
      };

    return (
        <View style={styles.container}>
            <FlatList
                style={{width: '90%'}}
                data={gardenList}
                renderItem={({item}: {item: GardenData}) => {
                    return (
                        <View style={styles.cardContainer}>
                            <GardenCard item={item} key={item.id}/>
                            {(userId?item.roles[userId]==="admin":false) &&
                            <View style={{alignItems: 'center'}}>
                                <Pressable style={styles.leaveButton} onPress={() => handleOpenSettings(item.id)}>
                                    <Text style={styles.lightTitle}>Garden Settings</Text>
                                </Pressable> 
                            </View>}
                            <View style={{alignItems: 'center'}}>
                                <Pressable style={styles.leaveButton} onPress={() => handleOpenDetails(item.id)}>
                                    {/* <Text style={styles.lightTitle}>Garden Details {item.id}</Text> */}
                                    <Text style={styles.lightTitle}>Garden Details</Text>
                                </Pressable> 
                            </View>
                        </View>
                    )
                }}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />}
            />
            <Button title='New Garden +' onPress={showNewGarden} />
            {/* NEW GARDEN MODAL */}
            <Modal
                visible={newGardenVisible}
                onRequestClose={hideNewGarden}
                animationType='slide'
            >
                <View style={{ flex: 1, marginTop: 50}}>
                    <Button title='Close' onPress={hideNewGarden} />
                    <NewGarden/>
                </View>
            </Modal>
            {/* GARDEN SETTINGS MODAL */}
            <Modal
                visible={gardenSettingsVisible}
                onRequestClose={handleCloseSettings}
                animationType='slide'
            >
                <View style={{ flex: 1, marginTop: 50 }}>
                    <Button title='Close' onPress={handleCloseSettings} />
                    <GardenSettings gardenId={selectedGardenId}/>
                </View>
            </Modal>
            {/* GARDEN DETAILS MODAL */}
            <Modal
                visible={gardenDetailsVisible}
                onRequestClose={handleCloseDetails}
                animationType='slide'
            >
                <View style={{ flex: 1, marginTop: 50 }}>
                    <Button title='Close' onPress={handleCloseDetails} />
                    <GardenDetails gardenId={selectedGardenId}/>
                </View>
            </Modal>
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
    cardContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        backgroundColor: '#84a98c',
        width: '100%',
        borderRadius: 10,
        marginBottom: 20,
    },
    leaveButton: {
        alignItems: 'center',
        borderRadius: 30,
        backgroundColor: '#52796f',
        width: '50%',
        padding: 8,
        margin: 8,
    },
    lightTitle: {
        fontFamily: 'Quicksand-Bold',
        color: '#2f3e46',
        fontSize: 17,
    },
    lightSubtitle: {
        fontFamily: 'Quicksand-Regular',
        color: '#2f3e46',
        fontSize: 13,
    },
});