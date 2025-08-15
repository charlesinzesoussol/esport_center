import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { ClerkProvider, useAuth, useSignIn, useSignUp, useOAuth } from '@clerk/clerk-expo';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { tokenCache } from '../../lib/tokenCache';
import RootLayout from '../../app/_layout';
import IndexPage from '../../app/index';
import SignInScreen from '../../app/(auth)/sign-in';
import SignUpScreen from '../../app/(auth)/sign-up';
import TabLayout from '../../app/(tabs)/_layout';

// Mock all the external dependencies
jest.mock('@clerk/clerk-expo');
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  Slot: ({ children }: any) => <div data-testid="slot">{children}</div>,
  Stack: ({ children }: any) => <div data-testid="stack">{children}</div>,
  Tabs: ({ children }: any) => <div data-testid="tabs">{children}</div>,
  Link: ({ children, href }: any) => (
    <div data-testid="link" data-href={href}>{children}</div>
  ),
}));
jest.mock('expo-status-bar', () => ({
  StatusBar: () => <div data-testid="status-bar" />,
}));
jest.mock('expo-web-browser', () => ({
  maybeCompleteAuthSession: jest.fn(),
}));
jest.mock('../../lib/tokenCache');
jest.spyOn(Alert, 'alert');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseSignIn = useSignIn as jest.MockedFunction<typeof useSignIn>;
const mockUseSignUp = useSignUp as jest.MockedFunction<typeof useSignUp>;
const mockUseOAuth = useOAuth as jest.MockedFunction<typeof useOAuth>;
const mockTokenCache = tokenCache as jest.Mocked<typeof tokenCache>;

// Mock router with navigation tracking
let currentRoute = '/';
const navigationHistory: string[] = [];

const mockRouter = {
  replace: jest.fn((route: string) => {
    currentRoute = route;
    navigationHistory.push(route);
  }),
  push: jest.fn(),
  back: jest.fn(),
  canGoBack: jest.fn(() => false),
};

// Mock useRouter hook
const { useRouter } = require('expo-router');
useRouter.mockReturnValue(mockRouter);

describe('Authentication Flow Integration Tests', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    // Reset mocks
    jest.clearAllMocks();
    currentRoute = '/';
    navigationHistory.length = 0;

    // Default auth state
    mockUseAuth.mockReturnValue({
      isSignedIn: false,
      isLoaded: true,
    });

    // Default sign in mock
    mockUseSignIn.mockReturnValue({
      signIn: {
        create: jest.fn(),
      },
      setActive: jest.fn(),
      isLoaded: true,
    } as any);

    // Default sign up mock
    mockUseSignUp.mockReturnValue({
      signUp: {
        create: jest.fn(),
        prepareEmailAddressVerification: jest.fn(),
        attemptEmailAddressVerification: jest.fn(),
      },
      setActive: jest.fn(),
      isLoaded: true,
    } as any);

    // Default OAuth mock
    mockUseOAuth.mockReturnValue({
      startOAuthFlow: jest.fn(),
    } as any);

    // Default token cache mocks
    mockTokenCache.getToken.mockResolvedValue(null);
    mockTokenCache.saveToken.mockResolvedValue(undefined);
    mockTokenCache.clearToken.mockResolvedValue(undefined);
  });

  describe('Unauthenticated User Journey', () => {
    it('redirects unauthenticated user from index to sign-in', async () => {
      render(<IndexPage />);

      await waitFor(() => {
        expect(mockRouter.replace).toHaveBeenCalledWith('/(auth)/sign-in');
      });
    });

    it('shows sign-in form for unauthenticated users', () => {
      const { getByText, getByPlaceholderText } = render(<SignInScreen />);

      expect(getByText('Welcome Back')).toBeTruthy();
      expect(getByPlaceholderText('Enter your email')).toBeTruthy();
      expect(getByPlaceholderText('Enter your password')).toBeTruthy();
      expect(getByText('Sign In')).toBeTruthy();
      expect(getByText('Continue with Google')).toBeTruthy();
    });

    it('allows navigation between sign-in and sign-up', () => {
      const { getByText } = render(<SignInScreen />);
      const signUpLink = getByText('Sign up');
      
      expect(signUpLink.closest('[data-testid="link"]')?.getAttribute('data-href')).toBe('/(auth)/sign-up');
    });
  });

  describe('Email/Password Authentication Flow', () => {
    it('completes full sign-in flow successfully', async () => {
      const mockSignInAttempt = {
        status: 'complete',
        createdSessionId: 'session_123',
      };

      const mockSignIn = {
        create: jest.fn().mockResolvedValue(mockSignInAttempt),
      };
      const mockSetActive = jest.fn().mockResolvedValue(undefined);

      mockUseSignIn.mockReturnValue({
        signIn: mockSignIn,
        setActive: mockSetActive,
        isLoaded: true,
      } as any);

      const { getByPlaceholderText, getByText } = render(<SignInScreen />);

      // Fill out sign-in form
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

    it('completes full sign-up and verification flow', async () => {
      const mockSignUp = {
        create: jest.fn().mockResolvedValue(undefined),
        prepareEmailAddressVerification: jest.fn().mockResolvedValue(undefined),
        attemptEmailAddressVerification: jest.fn().mockResolvedValue({
          status: 'complete',
          createdSessionId: 'new_session_123',
        }),
      };
      const mockSetActive = jest.fn().mockResolvedValue(undefined);

      mockUseSignUp.mockReturnValue({
        signUp: mockSignUp,
        setActive: mockSetActive,
        isLoaded: true,
      } as any);

      const { getByPlaceholderText, getByText } = render(<SignUpScreen />);

      // Fill out sign-up form
      fireEvent.changeText(getByPlaceholderText('Enter your email'), 'newuser@example.com');
      fireEvent.changeText(getByPlaceholderText('Enter your password (min 6 characters)'), 'newpassword123');
      fireEvent.press(getByText('Sign Up'));

      await waitFor(() => {
        expect(mockSignUp.create).toHaveBeenCalledWith({
          emailAddress: 'newuser@example.com',
          password: 'newpassword123',
        });
        expect(mockSignUp.prepareEmailAddressVerification).toHaveBeenCalledWith({ strategy: 'email_code' });
      });

      // Should show verification screen
      expect(getByText('Check Your Email')).toBeTruthy();
      expect(getByText('We sent a verification code to newuser@example.com')).toBeTruthy();

      // Complete verification
      fireEvent.changeText(getByPlaceholderText('Enter 6-digit code'), '123456');
      fireEvent.press(getByText('Verify Email'));

      await waitFor(() => {
        expect(mockSignUp.attemptEmailAddressVerification).toHaveBeenCalledWith({
          code: '123456',
        });
        expect(mockSetActive).toHaveBeenCalledWith({ session: 'new_session_123' });
        expect(mockRouter.replace).toHaveBeenCalledWith('/(tabs)/esport');
      });
    });
  });

  describe('OAuth Authentication Flow', () => {
    it('completes Google OAuth sign-in successfully', async () => {
      const mockStartOAuthFlow = jest.fn().mockResolvedValue({
        createdSessionId: 'oauth_session_123',
        setActive: jest.fn().mockResolvedValue(undefined),
      });

      mockUseOAuth.mockReturnValue({
        startOAuthFlow: mockStartOAuthFlow,
      } as any);

      const { getByText } = render(<SignInScreen />);

      fireEvent.press(getByText('Continue with Google'));

      await waitFor(() => {
        expect(mockStartOAuthFlow).toHaveBeenCalled();
        expect(mockRouter.replace).toHaveBeenCalledWith('/(tabs)/esport');
      });
    });

    it('handles OAuth user cancellation gracefully', async () => {
      const mockStartOAuthFlow = jest.fn().mockRejectedValue({
        code: 'user_cancelled',
        message: 'User cancelled',
      });

      mockUseOAuth.mockReturnValue({
        startOAuthFlow: mockStartOAuthFlow,
      } as any);

      const { getByText } = render(<SignInScreen />);

      fireEvent.press(getByText('Continue with Google'));

      await waitFor(() => {
        expect(mockStartOAuthFlow).toHaveBeenCalled();
        // Should not show error alert for cancellation
        expect(Alert.alert).not.toHaveBeenCalled();
        // Should not redirect
        expect(mockRouter.replace).not.toHaveBeenCalled();
      });
    });
  });

  describe('Authenticated User Journey', () => {
    it('redirects authenticated user from index to main app', async () => {
      mockUseAuth.mockReturnValue({
        isSignedIn: true,
        isLoaded: true,
      });

      render(<IndexPage />);

      await waitFor(() => {
        expect(mockRouter.replace).toHaveBeenCalledWith('/(tabs)/esport');
      });
    });

    it('allows authenticated user to access protected tabs', () => {
      mockUseAuth.mockReturnValue({
        isSignedIn: true,
        isLoaded: true,
      });

      const { getByTestId } = render(<TabLayout />);

      expect(getByTestId('tabs')).toBeTruthy();
      expect(mockRouter.replace).not.toHaveBeenCalled();
    });

    it('redirects authenticated users away from auth screens', async () => {
      mockUseAuth.mockReturnValue({
        isSignedIn: true,
        isLoaded: true,
      });

      const AuthLayout = require('../../app/(auth)/_layout').default;
      const { getByTestId } = render(<AuthLayout />);

      // Should redirect to esport tab
      expect(getByTestId('redirect')).toBeTruthy();
    });
  });

  describe('Error Handling', () => {
    it('handles sign-in errors gracefully', async () => {
      const mockError = {
        errors: [{ message: 'Invalid credentials' }],
      };

      const mockSignIn = {
        create: jest.fn().mockRejectedValue(mockError),
      };

      mockUseSignIn.mockReturnValue({
        signIn: mockSignIn,
        setActive: jest.fn(),
        isLoaded: true,
      } as any);

      const { getByPlaceholderText, getByText } = render(<SignInScreen />);

      fireEvent.changeText(getByPlaceholderText('Enter your email'), 'wrong@example.com');
      fireEvent.changeText(getByPlaceholderText('Enter your password'), 'wrongpassword');
      fireEvent.press(getByText('Sign In'));

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Sign-in Failed', 'Invalid credentials');
        expect(mockRouter.replace).not.toHaveBeenCalled();
      });
    });

    it('handles sign-up errors gracefully', async () => {
      const mockError = {
        errors: [{ message: 'Email already exists' }],
      };

      const mockSignUp = {
        create: jest.fn().mockRejectedValue(mockError),
        prepareEmailAddressVerification: jest.fn(),
        attemptEmailAddressVerification: jest.fn(),
      };

      mockUseSignUp.mockReturnValue({
        signUp: mockSignUp,
        setActive: jest.fn(),
        isLoaded: true,
      } as any);

      const { getByPlaceholderText, getByText } = render(<SignUpScreen />);

      fireEvent.changeText(getByPlaceholderText('Enter your email'), 'existing@example.com');
      fireEvent.changeText(getByPlaceholderText('Enter your password (min 6 characters)'), 'password123');
      fireEvent.press(getByText('Sign Up'));

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Sign-up Failed', 'Email already exists');
        expect(mockSignUp.prepareEmailAddressVerification).not.toHaveBeenCalled();
      });
    });
  });

  describe('Loading States', () => {
    it('shows loading state while Clerk is initializing', () => {
      mockUseAuth.mockReturnValue({
        isSignedIn: false,
        isLoaded: false,
      });

      const { getByTestId } = render(<IndexPage />);

      expect(getByTestId('loading-indicator')).toBeTruthy();
      expect(mockRouter.replace).not.toHaveBeenCalled();
    });

    it('shows loading state for sign-in screen when Clerk is not loaded', () => {
      mockUseSignIn.mockReturnValue({
        signIn: { create: jest.fn() },
        setActive: jest.fn(),
        isLoaded: false,
      } as any);

      const { getByTestId } = render(<SignInScreen />);

      expect(getByTestId('loading-indicator')).toBeTruthy();
    });

    it('shows loading state for protected routes when auth is not loaded', () => {
      mockUseAuth.mockReturnValue({
        isSignedIn: true,
        isLoaded: false,
      });

      const { getByTestId } = render(<TabLayout />);

      expect(getByTestId('loading-indicator')).toBeTruthy();
    });
  });

  describe('Token Cache Integration', () => {
    it('initializes ClerkProvider with token cache', () => {
      const mockClerkProvider = ClerkProvider as jest.MockedFunction<typeof ClerkProvider>;
      
      render(<RootLayout />);

      expect(mockClerkProvider).toHaveBeenCalledWith(
        expect.objectContaining({
          tokenCache: mockTokenCache,
        }),
        expect.anything()
      );
    });

    it('handles token cache errors gracefully', async () => {
      mockTokenCache.getToken.mockRejectedValue(new Error('Token cache error'));
      
      // Should not crash the app
      const { getByTestId } = render(<IndexPage />);
      
      // Should still show loading indicator
      expect(getByTestId('loading-indicator')).toBeTruthy();
    });
  });

  describe('Navigation Flow Validation', () => {
    it('follows correct navigation flow for new user', async () => {
      // Start unauthenticated
      render(<IndexPage />);

      await waitFor(() => {
        expect(navigationHistory).toContain('/(auth)/sign-in');
      });

      // After successful sign-in
      mockUseAuth.mockReturnValue({
        isSignedIn: true,
        isLoaded: true,
      });

      render(<IndexPage />);

      await waitFor(() => {
        expect(navigationHistory).toContain('/(tabs)/esport');
      });
    });

    it('prevents accessing protected routes when unauthenticated', () => {
      mockUseAuth.mockReturnValue({
        isSignedIn: false,
        isLoaded: true,
      });

      render(<TabLayout />);

      expect(mockRouter.replace).toHaveBeenCalledWith('/(auth)/sign-in');
    });
  });
});