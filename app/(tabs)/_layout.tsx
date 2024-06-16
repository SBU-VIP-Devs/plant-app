import 'react-native-gesture-handler';
import 'expo-dev-client';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs 
        screenOptions={{
        tabBarActiveTintColor: '#3f4f52',
        tabBarInactiveTintColor: '#52796f',
        tabBarStyle: {
          backgroundColor: "#84a98c",
        }
        }}>
        <Tabs.Screen 
            name = "gardens"
            options = {{
                headerShown: false,
                headerTitle: "Gardens",
                headerStyle: {
                    backgroundColor: "#84a98c"
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
                    backgroundColor: "#84a98c"
                },
                title: "Tasks"
            }}
        />
        <Tabs.Screen 
            name = "users/[id]"
            options = {{
                headerShown: false,
                headerTitle: "User",
                headerStyle: {
                    backgroundColor: "#84a98c"
                },
                title: "User"
            }}
        />
    </Tabs>
  );
}