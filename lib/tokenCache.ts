import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const createTokenCache = () => {
  return {
    getToken: async (key: string) => {
      try {
        const startTime = Date.now();
        const item = await SecureStore.getItemAsync(key);
        const duration = Date.now() - startTime;
        
        if (item) {
          console.log(`🔐 Token retrieved: ${key} (length: ${item.length}, took: ${duration}ms)`);
          // Enhanced token validation
          try {
            // Check if it's a JWT token
            if (item.includes('.')) {
              const parts = item.split('.');
              console.log(`🔍 JWT structure: ${parts.length} parts`);
              
              // Parse JWT payload for debugging (without verifying signature)
              if (parts.length >= 2) {
                const payload = JSON.parse(atob(parts[1]));
                const exp = payload.exp ? new Date(payload.exp * 1000) : null;
                const now = new Date();
                
                console.log(`🕰️ Token expiry: ${exp ? exp.toISOString() : 'N/A'}`);
                console.log(`🕰️ Current time: ${now.toISOString()}`);
                console.log(`✅ Token valid: ${exp ? exp > now : 'unknown'}`);
                
                if (exp && exp <= now) {
                  console.warn('⚠️ Token appears to be expired');
                }
              }
            }
            
            // Log first and last few characters for debugging (not the full token for security)
            console.log(`🔐 Token preview: ${item.substring(0, 12)}...${item.substring(item.length - 12)}`);
          } catch (parseError) {
            console.log('🔐 Non-JWT token or parsing failed (this may be normal)');
          }
        } else {
          console.log(`❌ No token found for key: ${key} (took: ${duration}ms)`);
        }
        return item;
      } catch (error) {
        console.error('❌ SecureStore get item error: ', error);
        // Only delete if it's a storage-related error, not network
        if (error instanceof Error && !error.message.includes('network')) {
          try {
            await SecureStore.deleteItemAsync(key);
            console.log(`🗑️ Corrupted token deleted: ${key}`);
          } catch (deleteError) {
            console.error('❌ Failed to delete corrupted token:', deleteError);
          }
        }
        return null;
      }
    },
    saveToken: async (key: string, value: string) => {
      try {
        const startTime = Date.now();
        await SecureStore.setItemAsync(key, value);
        const duration = Date.now() - startTime;
        
        console.log(`✅ Token saved: ${key} (length: ${value.length}, took: ${duration}ms)`);
        
        // Enhanced logging for OAuth tokens
        if (key.includes('oauth') || key.includes('session')) {
          console.log(`🔐 OAuth/Session token saved - this should enable authentication`);
        }
        
        // Verify the token was actually saved
        try {
          const verified = await SecureStore.getItemAsync(key);
          if (verified === value) {
            console.log(`✅ Token verification successful: ${key}`);
          } else {
            console.error(`❌ Token verification failed: ${key}`);
          }
        } catch (verifyError) {
          console.error(`❌ Token verification error: ${key}`, verifyError);
        }
      } catch (err) {
        console.error('❌ SecureStore save item error: ', err);
        // Try to provide more specific error information
        if (err instanceof Error) {
          if (err.message.includes('accessibility')) {
            console.error('❌ Device may be locked or accessibility settings preventing token storage');
          } else if (err.message.includes('space')) {
            console.error('❌ Insufficient storage space for token');
          }
        }
      }
    },
    deleteToken: async (key: string) => {
      try {
        const startTime = Date.now();
        await SecureStore.deleteItemAsync(key);
        const duration = Date.now() - startTime;
        
        console.log(`🗑️ Token deleted: ${key} (took: ${duration}ms)`);
        
        // Enhanced logging for OAuth cleanup
        if (key.includes('oauth') || key.includes('session')) {
          console.log(`🔐 OAuth/Session token deleted - user should be signed out`);
        }
      } catch (err) {
        console.error('❌ SecureStore delete item error: ', err);
      }
    },
  };
};

// Export platform-specific token cache with initialization logging
let tokenCache: ReturnType<typeof createTokenCache> | undefined;

if (Platform.OS !== 'web') {
  tokenCache = createTokenCache();
  console.log('✅ TokenCache initialized for native platform');
} else {
  console.log('⚠️ TokenCache disabled for web platform');
}

export { tokenCache };