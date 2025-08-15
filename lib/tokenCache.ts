import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const createTokenCache = () => {
  return {
    getToken: async (key: string) => {
      try {
        const item = await SecureStore.getItemAsync(key);
        if (item) {
          console.log(`${key} was used 🔐`);
        } else {
          console.log(`No value found for key: ${key}`);
        }
        return item;
      } catch (error) {
        console.error('SecureStore get item error: ', error);
        await SecureStore.deleteItemAsync(key);
        return null;
      }
    },
    saveToken: async (key: string, value: string) => {
      try {
        await SecureStore.setItemAsync(key, value);
      } catch (err) {
        console.error('SecureStore save item error: ', err);
      }
    },
    deleteToken: async (key: string) => {
      try {
        await SecureStore.deleteItemAsync(key);
      } catch (err) {
        console.error('SecureStore delete item error: ', err);
      }
    },
  };
};

// Export platform-specific token cache
export const tokenCache = Platform.OS !== 'web' ? createTokenCache() : undefined;