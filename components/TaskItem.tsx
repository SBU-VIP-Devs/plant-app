import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface TaskItemProps {
  taskName: string;
  time: string;
  completed?: boolean;
  onToggle?: (completed: boolean) => void;
}

export default function TaskItem({ 
  taskName, 
  time, 
  completed = false, 
  onToggle 
}: TaskItemProps) {
  const [isCompleted, setIsCompleted] = useState(completed);

  const handleToggle = () => {
    const newCompleted = !isCompleted;
    setIsCompleted(newCompleted);
    onToggle?.(newCompleted);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.taskName}>{taskName}</Text>
        <View style={styles.timeContainer}>
          <Text style={styles.clockIcon}>🕐</Text>
          <Text style={styles.timeText}>{time}</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={[styles.checkbox, isCompleted && styles.checkboxCompleted]} 
        onPress={handleToggle}
      >
        {isCompleted && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#A5D6A7',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  taskName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2f3e46',
    fontFamily: 'Quicksand-Bold',
    marginBottom: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clockIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  timeText: {
    fontSize: 14,
    color: '#2f3e46',
    fontFamily: 'Quicksand-Regular',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2f3e46',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  checkboxCompleted: {
    backgroundColor: '#2f3e46',
  },
  checkmark: {
    color: '#A5D6A7',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
