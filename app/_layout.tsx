import { ClerkProvider } from '@clerk/clerk-expo';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { tokenCache } from '../lib/tokenCache';

// Create a global query client with optimized defaults for mobile
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 2,
      refetchOnWindowFocus: false, // Disable for mobile
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env file',
  );
}

export default function RootLayout() {
  useEffect(() => {
    console.log('🚀 RootLayout mounted - App starting...');
    console.log('🔐 Clerk publishable key configured:', !!publishableKey);
    console.log('📱 TokenCache available:', !!tokenCache);
    
    // Log environment info
    console.log('⚙️ Environment Info:', {
      nodeEnv: process.env.NODE_ENV,
      platform: process.env.EXPO_PLATFORM,
      router: 'expo-router'
    });
  }, []);

  return (
    <ClerkProvider 
      publishableKey={publishableKey} 
      tokenCache={tokenCache}
    >
      <QueryClientProvider client={queryClient}>
        <StatusBar style="light" backgroundColor="#1a1a1a" />
        <Slot />
      </QueryClientProvider>
    </ClerkProvider>
  );
}