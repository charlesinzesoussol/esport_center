import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { useSignUp, useOAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import SignUpScreen from '../../app/(auth)/sign-up';

// Mock the dependencies
jest.mock('@clerk/clerk-expo');
jest.mock('expo-router');
jest.mock('expo-web-browser', () => ({
  maybeCompleteAuthSession: jest.fn(),
}));
jest.spyOn(Alert, 'alert');

const mockUseSignUp = useSignUp as jest.MockedFunction<typeof useSignUp>;
const mockUseOAuth = useOAuth as jest.MockedFunction<typeof useOAuth>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('Sign Up Screen', () => {
  const mockSignUp = {
    create: jest.fn(),
    prepareEmailAddressVerification: jest.fn(),
    attemptEmailAddressVerification: jest.fn(),
  };
  const mockSetActive = jest.fn();
  const mockStartOAuthFlow = jest.fn();
  const mockRouter = {
    replace: jest.fn(),
  };

  beforeEach(() => {
    mockUseSignUp.mockReturnValue({
      signUp: mockSignUp,
      setActive: mockSetActive,
      isLoaded: true,
    } as any);
    
    mockUseOAuth.mockReturnValue({
      startOAuthFlow: mockStartOAuthFlow,
    } as any);
    
    mockUseRouter.mockReturnValue(mockRouter as any);
    
    jest.clearAllMocks();
  });

  it('renders sign up form correctly', () => {
    const { getByPlaceholderText, getByText } = render(<SignUpScreen />);
    
    expect(getByPlaceholderText('Enter your email')).toBeTruthy();
    expect(getByPlaceholderText('Enter your password (min 6 characters)')).toBeTruthy();
    expect(getByText('Sign Up')).toBeTruthy();
    expect(getByText('Continue with Google')).toBeTruthy();
    expect(getByText('Create Account')).toBeTruthy();
  });

  it('shows loading indicator when Clerk is not loaded', () => {
    mockUseSignUp.mockReturnValue({
      signUp: mockSignUp,
      setActive: mockSetActive,
      isLoaded: false,
    } as any);

    const { getByTestId } = render(<SignUpScreen />);
    
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('validates empty fields before sign up', async () => {
    const { getByText } = render(<SignUpScreen />);
    
    fireEvent.press(getByText('Sign Up'));
    
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please fill in all fields');
      expect(mockSignUp.create).not.toHaveBeenCalled();
    });
  });

  it('validates password length', async () => {
    const { getByPlaceholderText, getByText } = render(<SignUpScreen />);
    
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter your password (min 6 characters)'), '123');
    fireEvent.press(getByText('Sign Up'));
    
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Password must be at least 6 characters long');
      expect(mockSignUp.create).not.toHaveBeenCalled();
    });
  });

  it('handles successful sign up and shows verification screen', async () => {
    mockSignUp.prepareEmailAddressVerification.mockResolvedValue(undefined);
    
    const { getByPlaceholderText, getByText } = render(<SignUpScreen />);
    
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter your password (min 6 characters)'), 'password123');
    fireEvent.press(getByText('Sign Up'));
    
    await waitFor(() => {
      expect(mockSignUp.create).toHaveBeenCalledWith({
        emailAddress: 'test@example.com',
        password: 'password123',
      });
      expect(mockSignUp.prepareEmailAddressVerification).toHaveBeenCalledWith({ strategy: 'email_code' });
    });

    // Should show verification screen
    expect(getByText('Check Your Email')).toBeTruthy();
    expect(getByText('We sent a verification code to test@example.com')).toBeTruthy();
  });

  it('handles email verification successfully', async () => {
    // First set up the pending verification state
    mockSignUp.create.mockResolvedValue(undefined);
    mockSignUp.prepareEmailAddressVerification.mockResolvedValue(undefined);
    
    const { getByPlaceholderText, getByText, rerender } = render(<SignUpScreen />);
    
    // Trigger sign up to get to verification screen
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter your password (min 6 characters)'), 'password123');
    fireEvent.press(getByText('Sign Up'));
    
    await waitFor(() => {
      expect(getByText('Check Your Email')).toBeTruthy();
    });

    // Mock successful verification
    const mockVerificationAttempt = {
      status: 'complete',
      createdSessionId: 'session_123',
    };
    mockSignUp.attemptEmailAddressVerification.mockResolvedValue(mockVerificationAttempt);
    
    // Enter verification code and verify
    fireEvent.changeText(getByPlaceholderText('Enter 6-digit code'), '123456');
    fireEvent.press(getByText('Verify Email'));
    
    await waitFor(() => {
      expect(mockSignUp.attemptEmailAddressVerification).toHaveBeenCalledWith({
        code: '123456',
      });
      expect(mockSetActive).toHaveBeenCalledWith({ session: 'session_123' });
      expect(mockRouter.replace).toHaveBeenCalledWith('/(tabs)/esport');
    });
  });

  it('handles verification code resend', async () => {
    // Set up verification screen state
    mockSignUp.create.mockResolvedValue(undefined);
    mockSignUp.prepareEmailAddressVerification.mockResolvedValue(undefined);
    
    const { getByPlaceholderText, getByText } = render(<SignUpScreen />);
    
    // Get to verification screen
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter your password (min 6 characters)'), 'password123');
    fireEvent.press(getByText('Sign Up'));
    
    await waitFor(() => {
      expect(getByText('Check Your Email')).toBeTruthy();
    });

    // Test resend functionality
    fireEvent.press(getByText("Didn't receive the code? Resend"));
    
    await waitFor(() => {
      expect(mockSignUp.prepareEmailAddressVerification).toHaveBeenCalledTimes(2);
      expect(Alert.alert).toHaveBeenCalledWith('Success', 'Verification code sent!');
    });
  });

  it('handles Google OAuth sign up successfully', async () => {
    const mockOAuthResult = {
      createdSessionId: 'oauth_session_123',
      setActive: mockSetActive,
    };
    
    mockStartOAuthFlow.mockResolvedValue(mockOAuthResult);
    
    const { getByText } = render(<SignUpScreen />);
    
    fireEvent.press(getByText('Continue with Google'));
    
    await waitFor(() => {
      expect(mockStartOAuthFlow).toHaveBeenCalled();
      expect(mockSetActive).toHaveBeenCalledWith({ session: 'oauth_session_123' });
      expect(mockRouter.replace).toHaveBeenCalledWith('/(tabs)/esport');
    });
  });

  it('shows error alert when sign up fails', async () => {
    const mockError = {
      errors: [{ message: 'Email already exists' }],
    };
    
    mockSignUp.create.mockRejectedValue(mockError);
    
    const { getByPlaceholderText, getByText } = render(<SignUpScreen />);
    
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'existing@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter your password (min 6 characters)'), 'password123');
    fireEvent.press(getByText('Sign Up'));
    
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Sign-up Failed', 'Email already exists');
      expect(mockSignUp.prepareEmailAddressVerification).not.toHaveBeenCalled();
    });
  });

  it('shows error alert when verification fails', async () => {
    // Set up verification screen
    mockSignUp.create.mockResolvedValue(undefined);
    mockSignUp.prepareEmailAddressVerification.mockResolvedValue(undefined);
    
    const { getByPlaceholderText, getByText } = render(<SignUpScreen />);
    
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter your password (min 6 characters)'), 'password123');
    fireEvent.press(getByText('Sign Up'));
    
    await waitFor(() => {
      expect(getByText('Check Your Email')).toBeTruthy();
    });

    // Mock verification failure
    const mockError = {
      errors: [{ message: 'Invalid verification code' }],
    };
    mockSignUp.attemptEmailAddressVerification.mockRejectedValue(mockError);
    
    fireEvent.changeText(getByPlaceholderText('Enter 6-digit code'), '000000');
    fireEvent.press(getByText('Verify Email'));
    
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Verification Failed', 'Invalid verification code');
      expect(mockSetActive).not.toHaveBeenCalled();
    });
  });

  it('validates verification code input', async () => {
    // Set up verification screen
    mockSignUp.create.mockResolvedValue(undefined);
    mockSignUp.prepareEmailAddressVerification.mockResolvedValue(undefined);
    
    const { getByPlaceholderText, getByText } = render(<SignUpScreen />);
    
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter your password (min 6 characters)'), 'password123');
    fireEvent.press(getByText('Sign Up'));
    
    await waitFor(() => {
      expect(getByText('Check Your Email')).toBeTruthy();
    });

    // Try to verify without entering code
    fireEvent.press(getByText('Verify Email'));
    
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please enter the verification code');
      expect(mockSignUp.attemptEmailAddressVerification).not.toHaveBeenCalled();
    });
  });

  it('trims whitespace from email input', async () => {
    const { getByPlaceholderText, getByText } = render(<SignUpScreen />);
    
    fireEvent.changeText(getByPlaceholderText('Enter your email'), '  test@example.com  ');
    fireEvent.changeText(getByPlaceholderText('Enter your password (min 6 characters)'), 'password123');
    fireEvent.press(getByText('Sign Up'));
    
    await waitFor(() => {
      expect(mockSignUp.create).toHaveBeenCalledWith({
        emailAddress: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('allows going back to sign up form from verification screen', async () => {
    // Set up verification screen
    mockSignUp.create.mockResolvedValue(undefined);
    mockSignUp.prepareEmailAddressVerification.mockResolvedValue(undefined);
    
    const { getByPlaceholderText, getByText } = render(<SignUpScreen />);
    
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter your password (min 6 characters)'), 'password123');
    fireEvent.press(getByText('Sign Up'));
    
    await waitFor(() => {
      expect(getByText('Check Your Email')).toBeTruthy();
    });

    // Go back to sign up form
    fireEvent.press(getByText('Back to Sign Up'));
    
    expect(getByText('Create Account')).toBeTruthy();
    expect(getByPlaceholderText('Enter your email')).toBeTruthy();
  });

  it('handles OAuth user cancellation gracefully', async () => {
    const mockError = {
      code: 'user_cancelled',
      message: 'User cancelled OAuth flow',
    };
    
    mockStartOAuthFlow.mockRejectedValue(mockError);
    
    const { getByText } = render(<SignUpScreen />);
    
    fireEvent.press(getByText('Continue with Google'));
    
    await waitFor(() => {
      expect(mockStartOAuthFlow).toHaveBeenCalled();
      // Should not show alert for user cancellation
      expect(Alert.alert).not.toHaveBeenCalled();
    });
  });
});