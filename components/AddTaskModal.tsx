import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onAddTask: (task: { name: string; time: string }) => void;
}

export default function AddTaskModal({ visible, onClose, onAddTask }: AddTaskModalProps) {
  const [taskName, setTaskName] = useState('');
  const [taskTime, setTaskTime] = useState('');

  const handleSubmit = () => {
    if (!taskName.trim()) {
      Alert.alert('Error', 'Please enter a task name');
      return;
    }
    
    if (!taskTime.trim()) {
      Alert.alert('Error', 'Please enter a time');
      return;
    }

    onAddTask({
      name: taskName.trim(),
      time: taskTime.trim(),
    });

    // Reset form
    setTaskName('');
    setTaskTime('');
    onClose();
  };

  const handleCancel = () => {
    setTaskName('');
    setTaskTime('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Add New Task</Text>
            <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Task Name</Text>
              <TextInput
                style={styles.input}
                value={taskName}
                onChangeText={setTaskName}
                placeholder="Enter task name..."
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Time</Text>
              <TextInput
                style={styles.input}
                value={taskTime}
                onChangeText={setTaskTime}
                placeholder="e.g., 2:00 PM"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
                <Text style={styles.addButtonText}>Add Task</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
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
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2f3e46',
    fontFamily: 'Quicksand-Bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#A5D6A7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2f3e46',
    fontFamily: 'Quicksand-Regular',
    backgroundColor: '#E0F7D9',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#E0F7D9',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2f3e46',
    fontFamily: 'Quicksand-Bold',
  },
  addButton: {
    flex: 1,
    backgroundColor: '#A5D6A7',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2f3e46',
    fontFamily: 'Quicksand-Bold',
  },
});
