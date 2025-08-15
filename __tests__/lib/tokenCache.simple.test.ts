import * as SecureStore from 'expo-secure-store';

// Mock expo-secure-store
jest.mock('expo-secure-store');

// Mock Platform before importing tokenCache
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: jest.fn((options) => options.ios),
}));

const mockSecureStore = SecureStore as jest.Mocked<typeof SecureStore>;

// Import after mocking Platform
import { tokenCache } from '../../lib/tokenCache';

describe('Enhanced TokenCache', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress console logs during tests
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getToken with enhanced logging', () => {
    it('retrieves token successfully with timing logs', async () => {
      const testToken = 'test-token-123';
      mockSecureStore.getItemAsync.mockResolvedValue(testToken);
      const consoleSpy = jest.spyOn(console, 'log');

      const result = await tokenCache?.getToken('test-key');

      expect(mockSecureStore.getItemAsync).toHaveBeenCalledWith('test-key');
      expect(result).toBe(testToken);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('🔐 Token retrieved: test-key')
      );
    });

    it('logs JWT token analysis for valid JWT', async () => {
      // Create a mock JWT token
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({ 
        sub: '1234567890', 
        exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
      }));
      const signature = 'test-signature';
      const jwtToken = `${header}.${payload}.${signature}`;
      
      mockSecureStore.getItemAsync.mockResolvedValue(jwtToken);
      const consoleSpy = jest.spyOn(console, 'log');

      await tokenCache?.getToken('jwt-key');

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('🔍 JWT structure: 3 parts')
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('✅ Token valid: true')
      );
    });

    it('detects and warns about expired JWT tokens', async () => {
      // Create an expired JWT token
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({ 
        sub: '1234567890', 
        exp: Math.floor(Date.now() / 1000) - 3600 // 1 hour ago
      }));
      const signature = 'test-signature';
      const expiredJWT = `${header}.${payload}.${signature}`;
      
      mockSecureStore.getItemAsync.mockResolvedValue(expiredJWT);
      const consoleSpy = jest.spyOn(console, 'warn');

      await tokenCache?.getToken('expired-jwt-key');

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('⚠️ Token appears to be expired')
      );
    });

    it('handles corrupted tokens and cleans them up', async () => {
      const error = new Error('Corrupted token');
      mockSecureStore.getItemAsync.mockRejectedValue(error);
      mockSecureStore.deleteItemAsync.mockResolvedValue();
      const consoleSpy = jest.spyOn(console, 'log');

      const result = await tokenCache?.getToken('corrupted-key');

      expect(result).toBeNull();
      expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith('corrupted-key');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('🗑️ Corrupted token deleted: corrupted-key')
      );
    });
  });

  describe('saveToken with enhanced validation', () => {
    it('saves token with verification step', async () => {
      const testToken = 'test-token-456';
      mockSecureStore.setItemAsync.mockResolvedValue();
      mockSecureStore.getItemAsync.mockResolvedValue(testToken);
      const consoleSpy = jest.spyOn(console, 'log');

      await tokenCache?.saveToken('test-key', testToken);

      expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith('test-key', testToken);
      expect(mockSecureStore.getItemAsync).toHaveBeenCalledWith('test-key');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('✅ Token verification successful: test-key')
      );
    });

    it('detects verification failure after save', async () => {
      const testToken = 'test-token-456';
      mockSecureStore.setItemAsync.mockResolvedValue();
      mockSecureStore.getItemAsync.mockResolvedValue('different-token');
      const consoleSpy = jest.spyOn(console, 'error');

      await tokenCache?.saveToken('test-key', testToken);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('❌ Token verification failed: test-key')
      );
    });

    it('logs OAuth token save with special handling', async () => {
      const oauthToken = 'oauth-token-123';
      mockSecureStore.setItemAsync.mockResolvedValue();
      mockSecureStore.getItemAsync.mockResolvedValue(oauthToken);
      const consoleSpy = jest.spyOn(console, 'log');

      await tokenCache?.saveToken('oauth_google_token', oauthToken);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('🔐 OAuth/Session token saved - this should enable authentication')
      );
    });

    it('provides specific error messages for storage issues', async () => {
      const accessibilityError = new Error('accessibility settings preventing token storage');
      mockSecureStore.setItemAsync.mockRejectedValue(accessibilityError);
      const consoleSpy = jest.spyOn(console, 'error');

      await tokenCache?.saveToken('test-key', 'test-token');

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('❌ Device may be locked or accessibility settings preventing token storage')
      );
    });

    it('detects space issues', async () => {
      const spaceError = new Error('Insufficient space for token');
      mockSecureStore.setItemAsync.mockRejectedValue(spaceError);
      const consoleSpy = jest.spyOn(console, 'error');

      await tokenCache?.saveToken('test-key', 'test-token');

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('❌ Insufficient storage space for token')
      );
    });
  });

  describe('deleteToken with enhanced logging', () => {
    it('deletes token with timing information', async () => {
      mockSecureStore.deleteItemAsync.mockResolvedValue();
      const consoleSpy = jest.spyOn(console, 'log');

      await tokenCache?.deleteToken('test-key');

      expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith('test-key');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('🗑️ Token deleted: test-key (took:')
      );
    });

    it('logs OAuth token deletion with special message', async () => {
      mockSecureStore.deleteItemAsync.mockResolvedValue();
      const consoleSpy = jest.spyOn(console, 'log');

      await tokenCache?.deleteToken('session_token');

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('🔐 OAuth/Session token deleted - user should be signed out')
      );
    });
  });

  describe('Platform-specific initialization', () => {
    it('should be initialized for native platforms', () => {
      expect(tokenCache).toBeDefined();
      expect(typeof tokenCache?.getToken).toBe('function');
      expect(typeof tokenCache?.saveToken).toBe('function');
      expect(typeof tokenCache?.deleteToken).toBe('function');
    });
  });

  describe('Performance tracking', () => {
    it('tracks and logs operation timing', async () => {
      const testToken = 'performance-test-token';
      mockSecureStore.getItemAsync.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(testToken), 50))
      );
      const consoleSpy = jest.spyOn(console, 'log');

      await tokenCache?.getToken('perf-key');

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringMatching(/🔐 Token retrieved: perf-key \(length: \d+, took: \d+ms\)/)
      );
    });

    it('tracks save operation timing', async () => {
      mockSecureStore.setItemAsync.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(), 30))
      );
      mockSecureStore.getItemAsync.mockResolvedValue('test-token');
      const consoleSpy = jest.spyOn(console, 'log');

      await tokenCache?.saveToken('perf-save-key', 'test-token');

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringMatching(/✅ Token saved: perf-save-key \(length: \d+, took: \d+ms\)/)
      );
    });
  });

  describe('JWT Token Analysis', () => {
    it('handles malformed JWT tokens gracefully', async () => {
      const malformedJWT = 'not.a.valid.jwt.token';
      mockSecureStore.getItemAsync.mockResolvedValue(malformedJWT);
      const consoleSpy = jest.spyOn(console, 'log');

      await tokenCache?.getToken('malformed-jwt');

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('🔐 Non-JWT token or parsing failed (this may be normal)')
      );
    });

    it('handles JWT without expiry field', async () => {
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({ sub: '1234567890' })); // No exp field
      const signature = 'test-signature';
      const jwtNoExp = `${header}.${payload}.${signature}`;
      
      mockSecureStore.getItemAsync.mockResolvedValue(jwtNoExp);
      const consoleSpy = jest.spyOn(console, 'log');

      await tokenCache?.getToken('jwt-no-exp');

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('🕰️ Token expiry: N/A')
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('✅ Token valid: unknown')
      );
    });
  });
});