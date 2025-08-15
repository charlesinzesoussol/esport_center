import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { useSignIn, useOAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import SignInScreen from '../../app/(auth)/sign-in';

// Mock the dependencies
jest.mock('@clerk/clerk-expo');
jest.mock('expo-router');
jest.mock('expo-web-browser', () => ({
  maybeCompleteAuthSession: jest.fn(),
}));
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Alert: {
      alert: jest.fn(),
    },
  };
});

const mockUseSignIn = useSignIn as jest.MockedFunction<typeof useSignIn>;
const mockUseOAuth = useOAuth as jest.MockedFunction<typeof useOAuth>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('Sign In Screen', () => {
  const mockSignIn = {
    create: jest.fn(),
  };
  const mockSetActive = jest.fn();
  const mockStartOAuthFlow = jest.fn();
  const mockRouter = {
    replace: jest.fn(),
  };

  beforeEach(() => {
    mockUseSignIn.mockReturnValue({
      signIn: mockSignIn,
      setActive: mockSetActive,
      isLoaded: true,
    } as any);
    
    mockUseOAuth.mockReturnValue({
      startOAuthFlow: mockStartOAuthFlow,
    } as any);
    
    mockUseRouter.mockReturnValue(mockRouter as any);
    
    jest.clearAllMocks();
  });

  it('renders sign in form correctly', () => {
    const { getByPlaceholderText, getByText } = render(<SignInScreen />);
    
    expect(getByPlaceholderText('Enter your email address')).toBeTruthy();
    expect(getByPlaceholderText('Enter your password')).toBeTruthy();
    expect(getByText('Continue')).toBeTruthy();
    expect(getByText('Continue with Google')).toBeTruthy();
  });

  it('handles email/password sign in successfully without manual redirect', async () => {
    const mockSignInAttempt = {
      status: 'complete',
      createdSessionId: 'session_123',
    };
    
    mockSignIn.create.mockResolvedValue(mockSignInAttempt);
    
    const { getByPlaceholderText, getByText } = render(<SignInScreen />);
    
    fireEvent.changeText(getByPlaceholderText('Enter your email address'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
    fireEvent.press(getByText('Continue'));
    
    await waitFor(() => {
      expect(mockSignIn.create).toHaveBeenCalledWith({
        identifier: 'test@example.com',
        password: 'password123',
      });
      expect(mockSetActive).toHaveBeenCalledWith({ session: 'session_123' });
      // Verify NO manual router.replace call
      expect(mockRouter.replace).not.toHaveBeenCalled();
    });
  });

  it('handles Google OAuth sign in successfully without manual redirect', async () => {
    const mockOAuthResult = {
      createdSessionId: 'oauth_session_123',
      setActive: mockSetActive,
    };
    
    mockStartOAuthFlow.mockResolvedValue(mockOAuthResult);
    
    const { getByText } = render(<SignInScreen />);
    
    fireEvent.press(getByText('Continue with Google'));
    
    await waitFor(() => {
      expect(mockStartOAuthFlow).toHaveBeenCalled();
      expect(mockSetActive).toHaveBeenCalledWith({ session: 'oauth_session_123' });
      // Verify NO manual router.replace call
      expect(mockRouter.replace).not.toHaveBeenCalled();
    });
  });

  it('shows error alert when sign in fails', async () => {
    const mockError = {
      errors: [{ message: 'Invalid credentials' }],
    };
    
    mockSignIn.create.mockRejectedValue(mockError);
    
    const { getByPlaceholderText, getByText } = render(<SignInScreen />);
    
    fireEvent.changeText(getByPlaceholderText('Enter your email address'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'wrongpassword');
    fireEvent.press(getByText('Continue'));
    
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Invalid credentials');
      expect(mockRouter.replace).not.toHaveBeenCalled();
    });
  });

  it('handles incomplete sign in attempt', async () => {
    const mockSignInAttempt = {
      status: 'needs_verification',
      createdSessionId: null,
    };
    
    mockSignIn.create.mockResolvedValue(mockSignInAttempt);
    
    const { getByPlaceholderText, getByText } = render(<SignInScreen />);
    
    fireEvent.changeText(getByPlaceholderText('Enter your email address'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
    fireEvent.press(getByText('Continue'));
    
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Sign in incomplete. Please try again.');
      expect(mockSetActive).not.toHaveBeenCalled();
      expect(mockRouter.replace).not.toHaveBeenCalled();
    });
  });

  it('does not sign in when Clerk is not loaded', () => {
    mockUseSignIn.mockReturnValue({
      signIn: mockSignIn,
      setActive: mockSetActive,
      isLoaded: false,
    } as any);
    
    const { getByText } = render(<SignInScreen />);
    
    fireEvent.press(getByText('Continue'));
    
    expect(mockSignIn.create).not.toHaveBeenCalled();
  });
});
