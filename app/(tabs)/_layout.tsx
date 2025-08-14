import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
// import { useAuth } from '@clerk/clerk-expo';
// import { Redirect } from 'expo-router';

export default function TabLayout() {
  // Temporarily disable auth check
  // const { isSignedIn, isLoaded } = useAuth();

  // Show loading state while auth is loading
  // if (!isLoaded) {
  //   return null;
  // }

  // Redirect to auth if not signed in
  // if (!isSignedIn) {
  //   return <Redirect href="/(auth)/login" />;
  // }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#00ff88', // Gaming green
        tabBarInactiveTintColor: '#666666',
        tabBarStyle: { 
          backgroundColor: '#1a1a1a',
          borderTopColor: '#333333',
          borderTopWidth: 1,
        },
        headerStyle: { 
          backgroundColor: '#1a1a1a',
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
      }}
    >
      <Tabs.Screen
        name="esport"
        options={{
          title: 'Esport',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="game-controller" size={size} color={color} />
          ),
          headerTitle: 'Live Streams',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
          headerTitle: 'My Profile',
        }}
      />
    </Tabs>
  );
}