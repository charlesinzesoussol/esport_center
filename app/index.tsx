import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect to the main tabs screen
  return <Redirect href="/(tabs)/esport" />;
}