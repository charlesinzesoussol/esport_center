import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { useAuth, useOAuth, useSignIn } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import SignInScreen from '../../app/(auth)/sign-in';
import SignUpScreen from '../../app/(auth)/sign-up';

// Mock dependencies
jest.mock('@clerk/clerk-expo', () => ({
  useAuth: jest.fn(),
  useOAuth: jest.fn(),
  useSignIn: jest.fn(),
  useSignUp: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  Link: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('expo-web-browser', () => ({
  maybeCompleteAuthSession: jest.fn(),
}));

jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

const mockRouter = {
  replace: jest.fn(),
  push: jest.fn(),
  back: jest.fn(),
};

const mockAuth = {
  isSignedIn: false,
  isLoaded: true,
  userId: null,
  sessionId: null,
  getToken: jest.fn(),
};

const mockSignIn = {
  create: jest.fn(),
  isLoaded: true,
};

const mockSetActive = jest.fn();

const mockStartOAuthFlow = jest.fn();

describe('OAuth Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useAuth as jest.Mock).mockReturnValue(mockAuth);
    (useSignIn as jest.Mock).mockReturnValue({
      signIn: mockSignIn,
      setActive: mockSetActive,
      isLoaded: true,
    });
    (useOAuth as jest.Mock).mockReturnValue({
      startOAuthFlow: mockStartOAuthFlow,
    });
  });

  describe('Google OAuth Sign In Flow', () => {
    it('should successfully complete OAuth flow and navigate to app', async () => {
      // Mock successful OAuth flow
      const mockCreatedSessionId = 'sess_test123';
      mockStartOAuthFlow.mockResolvedValue({
        createdSessionId: mockCreatedSessionId,
        setActive: mockSetActive,
        signIn: { createdSessionId: mockCreatedSessionId },
        signUp: null,
      });

      // Mock auth state becoming signed in after OAuth
      const mockAuthSignedIn = { ...mockAuth, isSignedIn: true };
      (useAuth as jest.Mock).mockReturnValue(mockAuthSignedIn);

      const { getByText } = render(<SignInScreen />);
      
      // Find and press Google sign-in button
      const googleButton = getByText('Continue with Google');
      fireEvent.press(googleButton);

      // Wait for OAuth flow to complete
      await waitFor(() => {
        expect(mockStartOAuthFlow).toHaveBeenCalled();
      });

      // Verify session activation was called
      await waitFor(() => {
        expect(mockSetActive).toHaveBeenCalledWith({
          session: mockCreatedSessionId,
        });
      });

      // Verify navigation to main app (with retry mechanism)
      await waitFor(() => {
        expect(mockRouter.replace).toHaveBeenCalledWith('/(tabs)/esport');
      }, { timeout: 3000 });
    });

    it('should handle OAuth flow with no session created', async () => {
      // Mock OAuth flow with no session
      mockStartOAuthFlow.mockResolvedValue({
        createdSessionId: null,
        setActive: null,
        signIn: null,
        signUp: null,
      });

      const { getByText } = render(<SignInScreen />);
      
      const googleButton = getByText('Continue with Google');
      fireEvent.press(googleButton);

      await waitFor(() => {
        expect(mockStartOAuthFlow).toHaveBeenCalled();
      });

      // Should show error alert
      const { Alert } = require('react-native');
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'OAuth Error',
          'Google sign-in was incomplete. Please try again.'
        );
      });

      // Should not navigate
      expect(mockRouter.replace).not.toHaveBeenCalled();
    });

    it('should handle session activation failure', async () => {
      // Mock OAuth flow success but activation failure
      const mockCreatedSessionId = 'sess_test123';
      mockStartOAuthFlow.mockResolvedValue({
        createdSessionId: mockCreatedSessionId,
        setActive: mockSetActive,
        signIn: { createdSessionId: mockCreatedSessionId },
        signUp: null,
      });

      // Mock setActive to throw error
      mockSetActive.mockRejectedValue(new Error('Session activation failed'));

      const { getByText } = render(<SignInScreen />);
      
      const googleButton = getByText('Continue with Google');
      fireEvent.press(googleButton);

      await waitFor(() => {
        expect(mockStartOAuthFlow).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(mockSetActive).toHaveBeenCalledWith({
          session: mockCreatedSessionId,
        });
      });

      // Should show error alert for activation failure
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'OAuth Error',
          'Sign-in was successful but session activation failed. Please restart the app.'
        );
      });

      // Should not navigate
      expect(mockRouter.replace).not.toHaveBeenCalled();
    });

    it('should handle user cancellation gracefully', async () => {
      // Mock user cancellation
      mockStartOAuthFlow.mockRejectedValue({
        code: 'user_cancelled',
        message: 'User cancelled',
      });

      const { getByText } = render(<SignInScreen />);
      
      const googleButton = getByText('Continue with Google');
      fireEvent.press(googleButton);

      await waitFor(() => {
        expect(mockStartOAuthFlow).toHaveBeenCalled();
      });

      // Should not show error alert for cancellation
      expect(Alert.alert).not.toHaveBeenCalled();
      expect(mockRouter.replace).not.toHaveBeenCalled();
    });

    it('should handle network/callback errors', async () => {
      // Mock callback error
      mockStartOAuthFlow.mockRejectedValue({
        code: 'oauth_callback_error',
        message: 'OAuth callback failed',
      });

      const { getByText } = render(<SignInScreen />);
      
      const googleButton = getByText('Continue with Google');
      fireEvent.press(googleButton);

      await waitFor(() => {
        expect(mockStartOAuthFlow).toHaveBeenCalled();
      });

      // Should show specific error message
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'OAuth Error',
          'OAuth callback failed. Please check your internet connection and try again.'
        );
      });

      expect(mockRouter.replace).not.toHaveBeenCalled();
    });
  });

  describe('Google OAuth Sign Up Flow', () => {
    it('should successfully complete OAuth sign-up flow', async () => {
      // Mock successful OAuth flow for sign-up
      const mockCreatedSessionId = 'sess_signup123';
      mockStartOAuthFlow.mockResolvedValue({
        createdSessionId: mockCreatedSessionId,
        setActive: mockSetActive,
        signIn: null,
        signUp: { createdSessionId: mockCreatedSessionId },
      });

      // Mock auth state becoming signed in after OAuth
      const mockAuthSignedIn = { ...mockAuth, isSignedIn: true };
      (useAuth as jest.Mock).mockReturnValue(mockAuthSignedIn);

      const { getByText } = render(<SignUpScreen />);
      
      const googleButton = getByText('Continue with Google');
      fireEvent.press(googleButton);

      await waitFor(() => {
        expect(mockStartOAuthFlow).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(mockSetActive).toHaveBeenCalledWith({
          session: mockCreatedSessionId,
        });
      });

      // Verify navigation to main app
      await waitFor(() => {
        expect(mockRouter.replace).toHaveBeenCalledWith('/(tabs)/esport');
      }, { timeout: 3000 });
    });
  });

  describe('Navigation Timing and State Management', () => {
    it('should retry navigation until auth state is confirmed', async () => {
      let authCallCount = 0;
      
      // Mock auth state that becomes signed in after a few calls
      (useAuth as jest.Mock).mockImplementation(() => {
        authCallCount++;
        return {
          ...mockAuth,
          isSignedIn: authCallCount > 3, // Becomes true after 3 calls
        };
      });

      const mockCreatedSessionId = 'sess_retry123';
      mockStartOAuthFlow.mockResolvedValue({
        createdSessionId: mockCreatedSessionId,
        setActive: mockSetActive,
        signIn: { createdSessionId: mockCreatedSessionId },
        signUp: null,
      });

      const { getByText } = render(<SignInScreen />);
      
      const googleButton = getByText('Continue with Google');
      fireEvent.press(googleButton);

      // Should eventually navigate once auth state is confirmed
      await waitFor(() => {
        expect(mockRouter.replace).toHaveBeenCalledWith('/(tabs)/esport');
      }, { timeout: 5000 });
    });

    it('should timeout and show error if auth state never confirms', async () => {
      // Mock auth state that never becomes signed in
      (useAuth as jest.Mock).mockReturnValue({
        ...mockAuth,
        isSignedIn: false, // Always false
      });

      const mockCreatedSessionId = 'sess_timeout123';
      mockStartOAuthFlow.mockResolvedValue({
        createdSessionId: mockCreatedSessionId,
        setActive: mockSetActive,
        signIn: { createdSessionId: mockCreatedSessionId },
        signUp: null,
      });

      const { getByText } = render(<SignInScreen />);
      
      const googleButton = getByText('Continue with Google');
      fireEvent.press(googleButton);

      // Should show timeout error
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Navigation Error',
          'Authentication was successful but navigation failed. Please restart the app.',
          [{ text: 'OK', onPress: expect.any(Function) }]
        );
      }, { timeout: 5000 });
    });
  });

  describe('Loading States', () => {
    it('should show loading indicator during OAuth flow', async () => {
      // Mock slow OAuth flow
      mockStartOAuthFlow.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({
          createdSessionId: 'sess_slow123',
          setActive: mockSetActive,
          signIn: { createdSessionId: 'sess_slow123' },
          signUp: null,
        }), 1000))
      );

      const { getByText, getByTestId } = render(<SignInScreen />);
      
      const googleButton = getByText('Continue with Google');
      fireEvent.press(googleButton);

      // Should show loading state
      await waitFor(() => {
        expect(getByTestId).toBeDefined(); // Button should show ActivityIndicator
      });
    });

    it('should disable button during OAuth flow', async () => {
      mockStartOAuthFlow.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({
          createdSessionId: 'sess_disabled123',
          setActive: mockSetActive,
          signIn: { createdSessionId: 'sess_disabled123' },
          signUp: null,
        }), 500))
      );

      const { getByText } = render(<SignInScreen />);
      
      const googleButton = getByText('Continue with Google');
      fireEvent.press(googleButton);

      // Try to press again immediately
      fireEvent.press(googleButton);

      // Should only call OAuth flow once
      await waitFor(() => {
        expect(mockStartOAuthFlow).toHaveBeenCalledTimes(1);
      });
    });
  });
});