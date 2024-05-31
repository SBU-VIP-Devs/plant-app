import 'react-native-gesture-handler';
import 'expo-dev-client';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs>
        <Tabs.Screen 
            name = "index"
            options = {{
                headerTitle: "Home",
                title: "Home"
            }}
        />
        <Tabs.Screen 
            name = "users/[id]"
            options = {{
                headerTitle: "User Page",
                title: "User"
            }}
        />
    </Tabs>
  );
}