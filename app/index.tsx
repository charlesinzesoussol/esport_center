import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

export default function IndexPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return; // Wait for auth to load

    if (isSignedIn) {
      // User is authenticated, redirect to main app
      router.replace('/(tabs)/esport');
    } else {
      // User is not authenticated, redirect to sign-in
      router.replace('/(auth)/sign-in');
    }
  }, [isSignedIn, isLoaded, router]);

  // Show loading screen while determining auth state
  return (
    <View style={styles.container}>
      <ActivityIndicator testID="loading-indicator" size="large" color="#00ff88" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
  },
});