import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

export default function IndexPage() {
  const { isSignedIn, isLoaded, userId, sessionId, getToken } = useAuth();
  const router = useRouter();
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    const checkAuthState = async () => {
      const timestamp = new Date().toISOString();
      const authState = { 
        isLoaded, 
        isSignedIn, 
        hasUserId: !!userId, 
        hasSessionId: !!sessionId,
        timestamp
      };
      
      console.log('🔍 Auth state check:', authState);
      setDebugInfo(`Auth: ${JSON.stringify(authState, null, 2)}`);
      
      if (!isLoaded) {
        console.log('⏳ Waiting for auth to load...');
        return; // Wait for auth to load
      }

      // Additional token verification for better debugging
      if (isSignedIn && getToken) {
        try {
          const token = await getToken();
          console.log('🔐 Current session token available:', !!token);
          if (token) {
            console.log('🔐 Token preview:', `${token.substring(0, 20)}...`);
          }
        } catch (tokenError) {
          console.error('❌ Token retrieval error:', tokenError);
        }
      }

      if (isSignedIn) {
        console.log('✅ User is authenticated, redirecting to main app');
        
        // Add a small delay to ensure all auth state is fully propagated
        setTimeout(() => {
          router.replace('/(tabs)/esport');
        }, 100);
      } else {
        console.log('❌ User is not authenticated, redirecting to sign-in');
        
        // Add a small delay for auth state to settle
        setTimeout(() => {
          router.replace('/(auth)/sign-in');
        }, 100);
      }
    };
    
    checkAuthState();
  }, [isSignedIn, isLoaded, userId, sessionId, router, getToken]);

  // Show loading screen while determining auth state
  return (
    <View style={styles.container}>
      <ActivityIndicator testID="loading-indicator" size="large" color="#00ff88" />
      {__DEV__ && (
        <Text style={styles.debugText}>{debugInfo}</Text>
      )}
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
  debugText: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    color: '#666',
    fontSize: 10,
    fontFamily: 'monospace',
  },
});