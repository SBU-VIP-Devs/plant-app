import 'react-native-gesture-handler';
import 'expo-dev-client';
import { Tabs } from 'expo-router';
import { Colors } from '../../constants';

export default function TabsLayout() {
  return (
    <Tabs
        screenOptions={{
        tabBarActiveTintColor: Colors.darkText,
        tabBarInactiveTintColor: Colors.primaryDark,
        tabBarStyle: {
          backgroundColor: Colors.primary,
        }
        }}>
        <Tabs.Screen
            name = "gardens"
            options = {{
                headerShown: false,
                headerTitle: "Gardens",
                headerStyle: {
                    backgroundColor: Colors.primary
                },
                title: "Gardens"
            }}
        />
        <Tabs.Screen
            name = "index"
            options = {{
                headerShown: false,
                headerTitle: "Tasks",
                headerStyle: {
                    backgroundColor: Colors.primary
                },
                title: "Tasks"
            }}
        />
        <Tabs.Screen
            name = "user"
            options = {{
                headerShown: false,
                headerTitle: "User",
                headerStyle: {
                    backgroundColor: Colors.primary
                },
                title: "User"
            }}
        />
    </Tabs>
  );
}