import React, { useEffect } from 'react'
import { Button, View, Text, Image, Pressable, Dimensions, Modal, ScrollView } from 'react-native';
import { GardenData } from '../app/(tabs)/gardens';
import { FIREBASE_AUTH } from '../firebaseconfig';
import { TaskData } from '../app/inputscreens/gardentasklist';
import { formatDateRange } from '../app/inputscreens/newtask';
import { useState } from 'react';
import { CommonStyles } from '../styles';
import { Colors, FontFamily, FontSizes, Spacing, BorderRadius } from '../constants';
import db from '../services/database';

interface TaskCardProps {
    item: TaskData
}

export default function TaskCard({item}: TaskCardProps) {

    const user = FIREBASE_AUTH.currentUser;
    const username = user?.displayName ? user?.displayName : 'Unknown User'
    const userId = user ? user.uid : null

    function stringtoDates(isoString: string) {
        const strings = isoString.split(" ")
        const date1 = new Date(strings[0])
        const date2 = new Date(strings[1])
        return formatDateRange(date1, date2)
    }

    const [requestNameList, setRequestNameList] = useState<string>("No one has requested this task.");
    const [assignedNameList, setAssignedNameList] = useState<string>("No one has been assigned to this task.");

    // State for modal
    const [modalVisible, setModalVisible] = useState(false);


    async function readNamesAsString(uids: (string | undefined)[]): Promise<string> {
        try {
          const validUids = uids.filter((uid): uid is string => !!uid);
          const names = await db.users.getUsernamesByIds(validUids);
          return names.join(", ");
        } catch (e) {
          console.log(e);
          return "Error fetching names";
        }
      }

      useEffect(() => {
        const uidsRequests = item.uidRequests; 
        const uidsAssigned = item.uidAssigned; 
        const fetchNames = async () => {
          const namesR = await readNamesAsString(uidsRequests);
          const namesA = await readNamesAsString(uidsAssigned);
          setRequestNameList(namesR);
          setAssignedNameList(namesA);
        };
        fetchNames();
      }, []);

    

    const assignedNames = assignedNameList.split(", ");
    const requestNames = requestNameList.split(", ");

    return (
        <>
            {/* Main Card - Pressable to open modal */}
            <Pressable style={CommonStyles.taskCard} onPress={() => setModalVisible(true)}>
                <View style={CommonStyles.header}>
                    <View style={CommonStyles.headerText}>
                        <Text style={CommonStyles.darkTitle}>{item.taskName}</Text>
                        <Text style={CommonStyles.darkSubtitle}>created by {item.username}</Text>
                        <Text style={CommonStyles.darkSubtitle}>{stringtoDates(item.taskTime)}</Text>

                        {/* Description truncated to 3 lines */}
                        <Text style={CommonStyles.darkSubtitle} numberOfLines={3}>
                            {item.desc}
                        </Text>

                        <Text style={CommonStyles.darkSubtitle}>{item.location}</Text>

                        {/* Assigned users - show only first one */}
                        <Text style={CommonStyles.darkTitle}>Assigned to: </Text>
                        {item.uidAssigned.length === 0 || item.uidAssigned[0]==="\0"?
                        <Text style={{fontFamily: FontFamily.regular, color: Colors.darkText, fontSize: FontSizes.small, marginVertical: 4}}>No one has been assigned to this task.</Text>:
                        <View style={{flexDirection: 'row', flexWrap: 'wrap', marginVertical: Spacing.xs, gap: Spacing.xs}}>
                            <View style={{backgroundColor: Colors.primaryDark, borderRadius: BorderRadius.large, paddingHorizontal: Spacing.medium, paddingVertical: 6, marginBottom: 4}}>
                                <Text style={{fontFamily: FontFamily.medium, color: Colors.darkText, fontSize: 12, textAlign: 'center'}}>
                                    {assignedNames[0]}{assignedNames.length > 1 && ` +${assignedNames.length - 1}`}
                                </Text>
                            </View>
                        </View>}

                        {/* Requested users - show only first one */}
                        <Text style={CommonStyles.darkTitle}>Requested by: </Text>
                        {item.uidRequests.length === 0 || item.uidRequests[0]==="\0"?
                        <Text style={{fontFamily: FontFamily.regular, color: Colors.darkText, fontSize: FontSizes.small, marginVertical: 4}}>No one has requested this task.</Text>:
                        <View style={{flexDirection: 'row', flexWrap: 'wrap', marginVertical: Spacing.xs, gap: Spacing.xs}}>
                            <View style={{backgroundColor: Colors.primaryDark, borderRadius: BorderRadius.large, paddingHorizontal: Spacing.medium, paddingVertical: 6, marginBottom: 4}}>
                                <Text style={{fontFamily: FontFamily.medium, color: Colors.darkText, fontSize: 12, textAlign: 'center'}}>
                                    {requestNames[0]}{requestNames.length > 1 && ` +${requestNames.length - 1}`}
                                </Text>
                            </View>
                        </View>}

                        <Text style={{fontFamily: FontFamily.medium, color: Colors.primaryDark, fontSize: FontSizes.small, marginTop: Spacing.xs, fontStyle: 'italic'}}>Tap to view details</Text>
                    </View>
                </View>
            </Pressable>

            {/* Modal with full task details */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={CommonStyles.modalOverlay}>
                    <View style={CommonStyles.modalContent}>
                        <ScrollView contentContainerStyle={CommonStyles.modalScrollContent}>
                            <Text style={CommonStyles.modalTitle}>{item.taskName}</Text>
                            <Text style={CommonStyles.darkSubtitle}>created by {item.username}</Text>
                            <Text style={CommonStyles.darkSubtitle}>{stringtoDates(item.taskTime)}</Text>

                            <View style={CommonStyles.modalSection}>
                                <Text style={CommonStyles.modalSectionTitle}>Description</Text>
                                <Text style={CommonStyles.darkSubtitle}>{item.desc}</Text>
                            </View>

                            <View style={CommonStyles.modalSection}>
                                <Text style={CommonStyles.modalSectionTitle}>Location</Text>
                                <Text style={CommonStyles.darkSubtitle}>{item.location}</Text>
                            </View>

                            <View style={CommonStyles.modalSection}>
                                <Text style={CommonStyles.modalSectionTitle}>Assigned to:</Text>
                                {item.uidAssigned.length === 0 || item.uidAssigned[0]==="\0"?
                                <Text style={{fontFamily: FontFamily.regular, color: Colors.darkText, fontSize: FontSizes.small, marginVertical: 4}}>No one has been assigned to this task.</Text>:
                                <View style={{flexDirection: 'row', flexWrap: 'wrap', marginVertical: Spacing.xs, gap: Spacing.xs}}>
                                    {assignedNames.map((name, index) => (
                                        <View key={index} style={{backgroundColor: Colors.primaryDark, borderRadius: BorderRadius.large, paddingHorizontal: Spacing.medium, paddingVertical: 6, marginBottom: 4}}>
                                            <Text style={{fontFamily: FontFamily.medium, color: Colors.darkText, fontSize: 12, textAlign: 'center'}}>{name}</Text>
                                        </View>
                                    ))}
                                </View>}
                            </View>

                            <View style={CommonStyles.modalSection}>
                                <Text style={CommonStyles.modalSectionTitle}>Requested by:</Text>
                                {item.uidRequests.length === 0 || item.uidRequests[0]==="\0"?
                                <Text style={{fontFamily: FontFamily.regular, color: Colors.darkText, fontSize: FontSizes.small, marginVertical: 4}}>No one has requested this task.</Text>:
                                <View style={{flexDirection: 'row', flexWrap: 'wrap', marginVertical: Spacing.xs, gap: Spacing.xs}}>
                                    {requestNames.map((name, index) => (
                                        <View key={index} style={{backgroundColor: Colors.primaryDark, borderRadius: BorderRadius.large, paddingHorizontal: Spacing.medium, paddingVertical: 6, marginBottom: 4}}>
                                            <Text style={{fontFamily: FontFamily.medium, color: Colors.darkText, fontSize: 12, textAlign: 'center'}}>{name}</Text>
                                        </View>
                                    ))}
                                </View>}
                            </View>
                        </ScrollView>

                        <Pressable style={CommonStyles.closeButton} onPress={() => setModalVisible(false)}>
                            <Text style={CommonStyles.closeButtonText}>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </>
    )
}