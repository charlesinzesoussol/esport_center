import * as SecureStore from 'expo-secure-store';
import { tokenCache, clearAllTokens } from '../../lib/tokenCache';

// Mock expo-secure-store
jest.mock('expo-secure-store');

const mockSecureStore = SecureStore as jest.Mocked<typeof SecureStore>;

describe('TokenCache', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getToken', () => {
    it('retrieves token successfully', async () => {
      const testToken = 'test-token-123';
      mockSecureStore.getItemAsync.mockResolvedValue(testToken);

      const result = await tokenCache.getToken('test-key');

      expect(mockSecureStore.getItemAsync).toHaveBeenCalledWith('test-key');
      expect(result).toBe(testToken);
    });

    it('returns null when token does not exist', async () => {
      mockSecureStore.getItemAsync.mockResolvedValue(null);

      const result = await tokenCache.getToken('non-existent-key');

      expect(result).toBeNull();
    });

    it('returns null and logs error when SecureStore throws', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation();
      const error = new Error('SecureStore error');
      mockSecureStore.getItemAsync.mockRejectedValue(error);

      const result = await tokenCache.getToken('error-key');

      expect(result).toBeNull();
      expect(consoleError).toHaveBeenCalledWith(
        'Failed to retrieve token for key "error-key":',
        error
      );

      consoleError.mockRestore();
    });
  });

  describe('saveToken', () => {
    it('saves token successfully', async () => {
      const testToken = 'test-token-456';
      mockSecureStore.setItemAsync.mockResolvedValue();

      await tokenCache.saveToken('test-key', testToken);

      expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith('test-key', testToken);
    });

    it('throws error when SecureStore.setItemAsync fails', async () => {
      const error = new Error('Failed to save token');
      mockSecureStore.setItemAsync.mockRejectedValue(error);

      await expect(tokenCache.saveToken('test-key', 'test-token')).rejects.toThrow(error);
    });

    it('logs error when SecureStore.setItemAsync fails', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation();
      const error = new Error('Failed to save token');
      mockSecureStore.setItemAsync.mockRejectedValue(error);

      try {
        await tokenCache.saveToken('test-key', 'test-token');
      } catch (e) {
        // Expected to throw
      }

      expect(consoleError).toHaveBeenCalledWith(
        'Failed to save token for key "test-key":',
        error
      );

      consoleError.mockRestore();
    });
  });

  describe('clearToken', () => {
    it('clears token successfully', async () => {
      mockSecureStore.deleteItemAsync.mockResolvedValue();

      await tokenCache.clearToken('test-key');

      expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith('test-key');
    });

    it('throws error when SecureStore.deleteItemAsync fails', async () => {
      const error = new Error('Failed to delete token');
      mockSecureStore.deleteItemAsync.mockRejectedValue(error);

      await expect(tokenCache.clearToken('test-key')).rejects.toThrow(error);
    });

    it('logs error when SecureStore.deleteItemAsync fails', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation();
      const error = new Error('Failed to delete token');
      mockSecureStore.deleteItemAsync.mockRejectedValue(error);

      try {
        await tokenCache.clearToken('test-key');
      } catch (e) {
        // Expected to throw
      }

      expect(consoleError).toHaveBeenCalledWith(
        'Failed to clear token for key "test-key":',
        error
      );

      consoleError.mockRestore();
    });
  });

  describe('clearAllTokens', () => {
    it('clears all common Clerk tokens successfully', async () => {
      mockSecureStore.deleteItemAsync.mockResolvedValue();

      await clearAllTokens();

      expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledTimes(4);
      expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith('__clerk_client_jwt');
      expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith('__clerk_refresh_token');
      expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith('__clerk_session_token');
      expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith('__clerk_user_token');
    });

    it('continues clearing other tokens even if some fail', async () => {
      // Make some deletions fail
      mockSecureStore.deleteItemAsync
        .mockRejectedValueOnce(new Error('Token 1 failed'))
        .mockResolvedValueOnce()
        .mockRejectedValueOnce(new Error('Token 3 failed'))
        .mockResolvedValueOnce();

      await clearAllTokens();

      expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledTimes(4);
    });

    it('throws error if clearing tokens fails catastrophically', async () => {
      const error = new Error('Catastrophic failure');
      mockSecureStore.deleteItemAsync.mockRejectedValue(error);

      // Mock Promise.all to fail
      const originalPromiseAll = Promise.all;
      Promise.all = jest.fn().mockRejectedValue(error);

      const consoleError = jest.spyOn(console, 'error').mockImplementation();

      await expect(clearAllTokens()).rejects.toThrow(error);

      expect(consoleError).toHaveBeenCalledWith('Failed to clear all tokens:', error);

      // Restore
      Promise.all = originalPromiseAll;
      consoleError.mockRestore();
    });
  });

  describe('TokenCache interface compliance', () => {
    it('implements all required TokenCache methods', () => {
      expect(typeof tokenCache.getToken).toBe('function');
      expect(typeof tokenCache.saveToken).toBe('function');
      expect(typeof tokenCache.clearToken).toBe('function');
    });

    it('getToken returns Promise<string | null>', async () => {
      mockSecureStore.getItemAsync.mockResolvedValue('test-token');
      
      const result = await tokenCache.getToken('test');
      expect(typeof result).toBe('string');

      mockSecureStore.getItemAsync.mockResolvedValue(null);
      const nullResult = await tokenCache.getToken('test');
      expect(nullResult).toBeNull();
    });

    it('saveToken returns Promise<void>', async () => {
      mockSecureStore.setItemAsync.mockResolvedValue();
      
      const result = await tokenCache.saveToken('test', 'token');
      expect(result).toBeUndefined();
    });

    it('clearToken returns Promise<void>', async () => {
      mockSecureStore.deleteItemAsync.mockResolvedValue();
      
      const result = await tokenCache.clearToken('test');
      expect(result).toBeUndefined();
    });
  });

  describe('Error handling edge cases', () => {
    it('handles SecureStore returning unexpected values', async () => {
      // @ts-ignore - Testing runtime behavior
      mockSecureStore.getItemAsync.mockResolvedValue(undefined);

      const result = await tokenCache.getToken('test');
      expect(result).toBeUndefined();
    });

    it('handles empty string tokens', async () => {
      mockSecureStore.getItemAsync.mockResolvedValue('');

      const result = await tokenCache.getToken('test');
      expect(result).toBe('');
    });

    it('handles very long token values', async () => {
      const longToken = 'a'.repeat(10000);
      mockSecureStore.setItemAsync.mockResolvedValue();
      mockSecureStore.getItemAsync.mockResolvedValue(longToken);

      await tokenCache.saveToken('test', longToken);
      const result = await tokenCache.getToken('test');
      
      expect(result).toBe(longToken);
      expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith('test', longToken);
    });

    it('handles special characters in keys and values', async () => {
      const specialKey = 'test_key-with.special@chars';
      const specialToken = 'token-with-special-chars-!@#$%^&*()';
      
      mockSecureStore.setItemAsync.mockResolvedValue();
      mockSecureStore.getItemAsync.mockResolvedValue(specialToken);

      await tokenCache.saveToken(specialKey, specialToken);
      const result = await tokenCache.getToken(specialKey);
      
      expect(result).toBe(specialToken);
      expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith(specialKey, specialToken);
    });
  });
});