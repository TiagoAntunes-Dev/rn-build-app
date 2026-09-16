import "@/app/globals.css";
import { Tabs } from "expo-router";

export default function _Layout() {
  return (
    <Tabs>
        <Tabs.Screen 
            name="index"
            options={{
                title: 'Home',
                headerShown: false
            }}
        
        />

        <Tabs.Screen 
            name="search"
            options={{
                title: 'Search',
                headerShown: false
            }}
        
        />

        <Tabs.Screen 
            name="saved"
            options={{
                title: 'Saved',
                headerShown: false
            }}
        
        />

        <Tabs.Screen 
            name="profile"
            options={{
                title: 'Profile',
                headerShown: false
            }}
        
        />
    </Tabs>
  );
}