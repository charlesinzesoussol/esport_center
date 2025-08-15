import * as SecureStore from 'expo-secure-store';

// Mock expo-secure-store
jest.mock('expo-secure-store');

// Mock Platform
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: jest.fn((options) => options.ios),
}));

const mockSecureStore = SecureStore as jest.Mocked<typeof SecureStore>;

// Import after mocking
let tokenCache: any;

describe('TokenCache', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    
    // Reset module cache and reimport
    jest.resetModules();
    const tokenCacheModule = await import('../../lib/tokenCache');
    tokenCache = tokenCacheModule.tokenCache;
  });

  describe('getToken', () => {
    it('retrieves token successfully', async () => {
      const testToken = 'test-token-123';
      mockSecureStore.getItemAsync.mockResolvedValue(testToken);
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = await tokenCache.getToken('test-key');

      expect(mockSecureStore.getItemAsync).toHaveBeenCalledWith('test-key');
      expect(result).toBe(testToken);
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
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
      mockSecureStore.deleteItemAsync.mockResolvedValue();

      const result = await tokenCache.getToken('error-key');

      expect(result).toBeNull();
      expect(consoleError).toHaveBeenCalledWith(
        '❌ SecureStore get item error: ',
        error
      );

      consoleError.mockRestore();
    });
  });

  describe('saveToken', () => {
    it('saves token successfully', async () => {
      const testToken = 'test-token-456';
      mockSecureStore.setItemAsync.mockResolvedValue();
      mockSecureStore.getItemAsync.mockResolvedValue(testToken);
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await tokenCache.saveToken('test-key', testToken);

      expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith('test-key', testToken);
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    it('logs error when SecureStore.setItemAsync fails', async () => {
      const error = new Error('Failed to save token');
      mockSecureStore.setItemAsync.mockRejectedValue(error);
      const consoleError = jest.spyOn(console, 'error').mockImplementation();

      await tokenCache.saveToken('test-key', 'test-token');

      expect(consoleError).toHaveBeenCalledWith(
        '❌ SecureStore save item error: ',
        error
      );
      
      consoleError.mockRestore();
    });

  });

  describe('deleteToken', () => {
    it('deletes token successfully', async () => {
      mockSecureStore.deleteItemAsync.mockResolvedValue();
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await tokenCache.deleteToken('test-key');

      expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith('test-key');
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    it('logs error when SecureStore.deleteItemAsync fails', async () => {
      const error = new Error('Failed to delete token');
      mockSecureStore.deleteItemAsync.mockRejectedValue(error);
      const consoleError = jest.spyOn(console, 'error').mockImplementation();

      await tokenCache.deleteToken('test-key');

      expect(consoleError).toHaveBeenCalledWith(
        '❌ SecureStore delete item error: ',
        error
      );
      
      consoleError.mockRestore();
    });

  });


  describe('TokenCache interface compliance', () => {
    it('implements all required TokenCache methods', () => {
      expect(typeof tokenCache.getToken).toBe('function');
      expect(typeof tokenCache.saveToken).toBe('function');
      expect(typeof tokenCache.deleteToken).toBe('function');
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

    it('deleteToken returns Promise<void>', async () => {
      mockSecureStore.deleteItemAsync.mockResolvedValue();
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const result = await tokenCache.deleteToken('test');
      expect(result).toBeUndefined();
      
      consoleSpy.mockRestore();
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

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      await tokenCache.saveToken('test', longToken);
      const result = await tokenCache.getToken('test');
      
      consoleSpy.mockRestore();
      
      expect(result).toBe(longToken);
      expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith('test', longToken);
    });

    it('handles special characters in keys and values', async () => {
      const specialKey = 'test_key-with.special@chars';
      const specialToken = 'token-with-special-chars-!@#$%^&*()';
      
      mockSecureStore.setItemAsync.mockResolvedValue();
      mockSecureStore.getItemAsync.mockResolvedValue(specialToken);

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      await tokenCache.saveToken(specialKey, specialToken);
      const result = await tokenCache.getToken(specialKey);
      
      consoleSpy.mockRestore();
      
      expect(result).toBe(specialToken);
      expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith(specialKey, specialToken);
    });
  });
});