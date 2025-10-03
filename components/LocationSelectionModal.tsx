import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from 'react-native';

interface Location {
  id: string;
  name: string;
  description: string;
}

interface LocationSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectLocation: (location: Location) => void;
  currentLocation?: Location;
}

const sampleLocations: Location[] = [
  {
    id: '1',
    name: 'Garden1 - Life Sciences Building',
    description: 'Main research garden with experimental plants',
  },
  {
    id: '2',
    name: 'Garden2 - Botany Department',
    description: 'Educational garden for botany students',
  },
  {
    id: '3',
    name: 'Garden3 - Greenhouse Complex',
    description: 'Controlled environment growing facility',
  },
  {
    id: '4',
    name: 'Garden4 - Community Plot',
    description: 'Shared community gardening space',
  },
  {
    id: '5',
    name: 'Garden5 - Herb Garden',
    description: 'Specialized herb and medicinal plant garden',
  },
];

export default function LocationSelectionModal({
  visible,
  onClose,
  onSelectLocation,
  currentLocation,
}: LocationSelectionModalProps) {
  const handleSelectLocation = (location: Location) => {
    onSelectLocation(location);
    onClose();
  };

  const renderLocationItem = ({ item }: { item: Location }) => (
    <TouchableOpacity
      style={[
        styles.locationItem,
        currentLocation?.id === item.id && styles.selectedLocation,
      ]}
      onPress={() => handleSelectLocation(item)}
    >
      <View style={styles.locationContent}>
        <Text style={[
          styles.locationName,
          currentLocation?.id === item.id && styles.selectedLocationText,
        ]}>
          {item.name}
        </Text>
        <Text style={[
          styles.locationDescription,
          currentLocation?.id === item.id && styles.selectedDescriptionText,
        ]}>
          {item.description}
        </Text>
      </View>
      {currentLocation?.id === item.id && (
        <Text style={styles.checkmark}>✓</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Location</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={sampleLocations}
            renderItem={renderLocationItem}
            keyExtractor={(item) => item.id}
            style={styles.locationList}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#F5F5DC',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2f3e46',
    fontFamily: 'Quicksand-Bold',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E0F7D9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#2f3e46',
    fontWeight: 'bold',
  },
  locationList: {
    maxHeight: 400,
  },
  locationItem: {
    backgroundColor: '#E0F7D9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedLocation: {
    backgroundColor: '#A5D6A7',
    borderWidth: 2,
    borderColor: '#2f3e46',
  },
  locationContent: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2f3e46',
    fontFamily: 'Quicksand-Bold',
    marginBottom: 4,
  },
  selectedLocationText: {
    color: '#2f3e46',
  },
  locationDescription: {
    fontSize: 14,
    color: '#2f3e46',
    fontFamily: 'Quicksand-Regular',
  },
  selectedDescriptionText: {
    color: '#2f3e46',
  },
  checkmark: {
    fontSize: 20,
    color: '#2f3e46',
    fontWeight: 'bold',
    marginLeft: 12,
  },
});
