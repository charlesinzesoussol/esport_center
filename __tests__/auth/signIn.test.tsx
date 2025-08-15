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
jest.spyOn(Alert, 'alert');

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
    
    expect(getByPlaceholderText('Enter your email')).toBeTruthy();
    expect(getByPlaceholderText('Enter your password')).toBeTruthy();
    expect(getByText('Sign In')).toBeTruthy();
    expect(getByText('Continue with Google')).toBeTruthy();
    expect(getByText('Welcome Back')).toBeTruthy();
  });

  it('shows loading indicator when Clerk is not loaded', () => {
    mockUseSignIn.mockReturnValue({
      signIn: mockSignIn,
      setActive: mockSetActive,
      isLoaded: false,
    } as any);

    const { getByTestId } = render(<SignInScreen />);
    
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('validates empty fields before sign in', async () => {
    const { getByText } = render(<SignInScreen />);
    
    fireEvent.press(getByText('Sign In'));
    
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please fill in all fields');
      expect(mockSignIn.create).not.toHaveBeenCalled();
    });
  });

  it('handles email/password sign in successfully', async () => {
    const mockSignInAttempt = {
      status: 'complete',
      createdSessionId: 'session_123',
    };
    
    mockSignIn.create.mockResolvedValue(mockSignInAttempt);
    
    const { getByPlaceholderText, getByText } = render(<SignInScreen />);
    
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
    fireEvent.press(getByText('Sign In'));
    
    await waitFor(() => {
      expect(mockSignIn.create).toHaveBeenCalledWith({
        identifier: 'test@example.com',
        password: 'password123',
      });
      expect(mockSetActive).toHaveBeenCalledWith({ session: 'session_123' });
      expect(mockRouter.replace).toHaveBeenCalledWith('/(tabs)/esport');
    });
  });

  it('handles Google OAuth sign in successfully', async () => {
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
      expect(mockRouter.replace).toHaveBeenCalledWith('/(tabs)/esport');
    });
  });

  it('shows error alert when sign in fails', async () => {
    const mockError = {
      errors: [{ message: 'Invalid credentials' }],
    };
    
    mockSignIn.create.mockRejectedValue(mockError);
    
    const { getByPlaceholderText, getByText } = render(<SignInScreen />);
    
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'wrongpassword');
    fireEvent.press(getByText('Sign In'));
    
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Sign-in Failed', 'Invalid credentials');
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
    
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
    fireEvent.press(getByText('Sign In'));
    
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Unable to complete sign-in. Please try again.');
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
    
    const { getByTestId } = render(<SignInScreen />);
    
    // Should show loading screen instead of form
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('trims whitespace from email input', async () => {
    const mockSignInAttempt = {
      status: 'complete',
      createdSessionId: 'session_123',
    };
    
    mockSignIn.create.mockResolvedValue(mockSignInAttempt);
    
    const { getByPlaceholderText, getByText } = render(<SignInScreen />);
    
    fireEvent.changeText(getByPlaceholderText('Enter your email'), '  test@example.com  ');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
    fireEvent.press(getByText('Sign In'));
    
    await waitFor(() => {
      expect(mockSignIn.create).toHaveBeenCalledWith({
        identifier: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('handles OAuth user cancellation gracefully', async () => {
    const mockError = {
      code: 'user_cancelled',
      message: 'User cancelled OAuth flow',
    };
    
    mockStartOAuthFlow.mockRejectedValue(mockError);
    
    const { getByText } = render(<SignInScreen />);
    
    fireEvent.press(getByText('Continue with Google'));
    
    await waitFor(() => {
      expect(mockStartOAuthFlow).toHaveBeenCalled();
      // Should not show alert for user cancellation
      expect(Alert.alert).not.toHaveBeenCalled();
    });
  });

  it('shows loading indicator during sign in', async () => {
    // Mock a delay in the sign in process
    mockSignIn.create.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    const { getByPlaceholderText, getByText, queryByTestId } = render(<SignInScreen />);
    
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
    fireEvent.press(getByText('Sign In'));
    
    // Should show loading state
    expect(queryByTestId('sign-in-loading')).toBeTruthy();
  });
});
