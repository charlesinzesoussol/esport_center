import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import Index from '../../app/index';

// Mock the Clerk and Expo Router modules
jest.mock('@clerk/clerk-expo');
jest.mock('expo-router');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('Index Screen Authentication Flow', () => {
  const mockReplace = jest.fn();

  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      replace: mockReplace,
    } as any);
    mockReplace.mockClear();
  });

  it('shows loading indicator while auth is not loaded', () => {
    mockUseAuth.mockReturnValue({
      isSignedIn: false,
      isLoaded: false,
    });

    const { getByTestId } = render(<Index />);
    
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('redirects to esports tab when user is signed in', async () => {
    mockUseAuth.mockReturnValue({
      isSignedIn: true,
      isLoaded: true,
    });

    render(<Index />);
    
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/(tabs)/esport');
    });
  });

  it('redirects to sign-in when user is not signed in', async () => {
    mockUseAuth.mockReturnValue({
      isSignedIn: false,
      isLoaded: true,
    });

    render(<Index />);
    
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/(auth)/sign-in');
    });
  });

  it('does not redirect while auth is loading', () => {
    mockUseAuth.mockReturnValue({
      isSignedIn: false,
      isLoaded: false,
    });

    render(<Index />);
    
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('handles auth state changes correctly', async () => {
    // Start with loading state
    const { rerender } = render(<Index />);
    
    mockUseAuth.mockReturnValue({
      isSignedIn: false,
      isLoaded: false,
    });
    
    rerender(<Index />);
    expect(mockReplace).not.toHaveBeenCalled();
    
    // Then simulate auth loaded and signed in
    mockUseAuth.mockReturnValue({
      isSignedIn: true,
      isLoaded: true,
    });
    
    rerender(<Index />);
    
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/(tabs)/esport');
    });
  });
});
