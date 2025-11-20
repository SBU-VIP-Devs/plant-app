import 'react-native-gesture-handler';
import 'expo-dev-client';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../firebaseconfig';
import Calendar from '../../components/Calendar';
import LocationCard from '../../components/LocationCard';
import TaskItem from '../../components/TaskItem';
import AddTaskModal from '../../components/AddTaskModal';
import LocationSelectionModal from '../../components/LocationSelectionModal';

export default function TaskScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState({
    id: '1',
    name: 'Garden1 - Life Sciences Building',
    description: 'Main research garden with experimental plants',
  });
  const [tasks, setTasks] = useState<{
    id: string;
    name: string;
    time: string;
    completed: boolean;
    locationName?: string;
  }[]>([]);

  // Read tasks from Firestore for the selected location
  async function loadTasksForLocation(locationName: string) {
    try {
      const tasksCol = collection(FIRESTORE_DB, 'tasks');
      const q = query(tasksCol, where('locationName', '==', locationName));
      const snapshot = await getDocs(q);
      const loaded = snapshot.docs.map((doc) => {
        const data = doc.data() as any;
        return {
          id: doc.id,
          name: data?.name ?? data?.taskName ?? 'Untitled Task',
          time: data?.time ?? data?.taskTime ?? '',
          completed: !!data?.completed,
          locationName: data?.locationName ?? data?.location,
        };
      });
      setTasks(loaded);
    } catch (e) {
      console.log('Error loading tasks:', e);
      setTasks([]);
    }
  }

  // Load tasks when location changes
  useEffect(() => {
    loadTasksForLocation(selectedLocation.name);
  }, [selectedLocation.name]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleTaskToggle = (taskId: string, completed: boolean) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed } : task
    ));
  };

  const handleAddTask = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleSubmitTask = (newTask: { name: string; time: string }) => {
    const task = {
      id: Date.now().toString(), // Simple ID generation
      name: newTask.name,
      time: newTask.time,
      completed: false,
    };
    setTasks([...tasks, task]);
  };

  const handleLocationPress = () => {
    setIsLocationModalVisible(true);
  };

  const handleCloseLocationModal = () => {
    setIsLocationModalVisible(false);
  };

  const handleSelectLocation = (location: { id: string; name: string; description: string }) => {
    setSelectedLocation(location);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Calendar Section */}
        <Calendar onDateSelect={handleDateSelect} />
        
        {/* Location Card */}
        <LocationCard 
          location={selectedLocation.name}
          onPress={handleLocationPress}
        />
        
        {/* Tasks Section */}
        <View style={styles.tasksSection}>
          <View style={styles.tasksHeader}>
            <Text style={styles.tasksLabel}>Tasks</Text>
            <Text style={styles.chevron}>⌄</Text>
          </View>
          
          <View style={styles.tasksContainer}>
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                taskName={task.name}
                time={task.time}
                completed={task.completed}
                onToggle={(completed) => handleTaskToggle(task.id, completed)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
      
      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddTask}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Add Task Modal */}
      <AddTaskModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        onAddTask={handleSubmitTask}
      />

      {/* Location Selection Modal */}
      <LocationSelectionModal
        visible={isLocationModalVisible}
        onClose={handleCloseLocationModal}
        onSelectLocation={handleSelectLocation}
        currentLocation={selectedLocation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F7D9',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Extra padding for FAB
  },
  tasksSection: {
    backgroundColor: '#F5F5DC',
    borderRadius: 12,
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 16,
  },
  tasksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tasksLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2f3e46',
    fontFamily: 'Quicksand-Bold',
  },
  chevron: {
    fontSize: 16,
    color: '#2f3e46',
  },
  tasksContainer: {
    // Container for task items
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#A5D6A7',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  fabText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2f3e46',
    fontFamily: 'Quicksand-Bold',
  },
});