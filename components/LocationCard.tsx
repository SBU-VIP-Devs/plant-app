import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface LocationCardProps {
  location?: string;
  onPress?: () => void;
}

export default function LocationCard({ location = "Garden1 - Life Sciences Building", onPress }: LocationCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.label}>Location</Text>
        <Text style={styles.chevron}>⌄</Text>
      </View>
      <Text style={styles.locationText}>{location}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5DC',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2f3e46',
    fontFamily: 'Quicksand-Bold',
  },
  chevron: {
    fontSize: 16,
    color: '#2f3e46',
  },
  locationText: {
    fontSize: 14,
    color: '#2f3e46',
    fontFamily: 'Quicksand-Regular',
  },
});
