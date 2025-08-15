import React from 'react';
import { render } from '@testing-library/react-native';
import { useAuth } from '@clerk/clerk-expo';
import TabLayout from '../../app/(tabs)/_layout';

// Mock the Clerk module
jest.mock('@clerk/clerk-expo');
jest.mock('expo-router', () => ({
  Tabs: ({ children, screenOptions }: any) => (
    <div data-testid="tabs-container">{children}</div>
  ),
  Redirect: ({ href }: any) => (
    <div data-testid="redirect" data-href={href} />
  ),
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('Tab Layout Authentication Protection', () => {
  it('shows loading indicator while auth is not loaded', () => {
    mockUseAuth.mockReturnValue({
      isSignedIn: false,
      isLoaded: false,
    });

    const { getByTestId } = render(<TabLayout />);
    
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('redirects to sign-in when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      isSignedIn: false,
      isLoaded: true,
    });

    const { getByTestId } = render(<TabLayout />);
    
    const redirect = getByTestId('redirect');
    expect(redirect.props['data-href']).toBe('/(auth)/sign-in');
  });

  it('renders tabs when user is authenticated', () => {
    mockUseAuth.mockReturnValue({
      isSignedIn: true,
      isLoaded: true,
    });

    const { getByTestId } = render(<TabLayout />);
    
    expect(getByTestId('tabs-container')).toBeTruthy();
  });

  it('does not render tabs while auth is loading', () => {
    mockUseAuth.mockReturnValue({
      isSignedIn: true,
      isLoaded: false,
    });

    const { getByTestId, queryByTestId } = render(<TabLayout />);
    
    expect(getByTestId('loading-indicator')).toBeTruthy();
    expect(queryByTestId('tabs-container')).toBeNull();
  });
});
