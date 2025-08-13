import { ClerkProvider } from '@clerk/clerk-expo';
import { Slot } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';

// Create a token cache for Clerk authentication
const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

export default function RootLayout() {
  const [publishableKey, setPublishableKey] = useState<string>('');

  useEffect(() => {
    // Get Clerk publishable key from environment
    const key = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
    if (!key) {
      console.warn('Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in environment variables');
      // For development, we'll proceed without authentication
      setPublishableKey('mock-key');
    } else {
      setPublishableKey(key);
    }
  }, []);

  if (!publishableKey) {
    return null; // Loading state
  }

  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={publishableKey}
    >
      <QueryClientProvider client={queryClient}>
        <StatusBar style="light" backgroundColor="#1a1a1a" />
        <Slot />
      </QueryClientProvider>
    </ClerkProvider>
  );
}