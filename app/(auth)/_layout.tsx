import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

export default function AuthRoutesLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  // Show loading while auth state is being determined
  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00ff88" />
      </View>
    );
  }

  // Redirect to home if already signed in
  if (isSignedIn) {
    return <Redirect href="/(tabs)/esport" />;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1a1a1a',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerBackVisible: true,
        contentStyle: {
          backgroundColor: '#0a0a0a',
        },
      }}
    >
      <Stack.Screen
        name="sign-in"
        options={{
          title: 'Sign In',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="sign-up"
        options={{
          title: 'Sign Up',
          headerShown: true,
        }}
      />
    </Stack>
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