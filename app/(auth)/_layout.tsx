import { Stack, useRouter } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'
import { useEffect } from 'react'

export default function AuthRoutesLayout() {
  const { isSignedIn, isLoaded } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Only redirect if auth is loaded and user is signed in
    if (isLoaded && isSignedIn) {
      console.log('User already authenticated in auth layout, redirecting to esport tab');
      router.replace('/(tabs)/esport');
    }
  }, [isSignedIn, isLoaded, router]);

  return <Stack screenOptions={{ headerShown: false }} />
}