import { Tabs, Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@clerk/clerk-expo';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function TabLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  // Show loading spinner while auth state is loading
  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator testID="loading-indicator" size="large" color="#00ff88" />
      </View>
    );
  }

  // Redirect to sign-in if not authenticated
  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#00ff88',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: { 
          backgroundColor: '#1a1a1a',
          borderTopColor: '#333',
          borderTopWidth: 1,
          height: 90,
          paddingBottom: 20,
          paddingTop: 10,
        },
        headerStyle: { 
          backgroundColor: '#1a1a1a',
          shadowColor: 'transparent',
          elevation: 0,
          borderBottomColor: '#333',
          borderBottomWidth: 1,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="esport"
        options={{
          title: 'Esport',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? "game-controller" : "game-controller-outline"} 
              size={size} 
              color={color} 
            />
          ),
          headerTitle: 'Live Streams',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? "person" : "person-outline"} 
              size={size} 
              color={color} 
            />
          ),
          headerTitle: 'My Profile',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
  },
});