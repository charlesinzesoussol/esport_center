import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    if (!isLoaded || hasNavigated) return; // Wait for auth to load and prevent duplicate navigation
    
    // Add a small delay to ensure Clerk state is fully synchronized
    const timer = setTimeout(() => {
      if (isSignedIn) {
        console.log('User is signed in, redirecting to esport tab');
        router.replace('/(tabs)/esport');
      } else {
        console.log('User is not signed in, redirecting to sign-in');
        router.replace('/(auth)/sign-in');
      }
      setHasNavigated(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [isSignedIn, isLoaded, router, hasNavigated]);

  // Show loading spinner while auth is loading or navigating
  return (
    <View style={styles.container}>
      <ActivityIndicator testID="loading-indicator" size="large" color="#6366f1" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});