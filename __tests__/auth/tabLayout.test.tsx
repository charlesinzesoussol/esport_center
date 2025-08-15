import React from 'react';
import { render } from '@testing-library/react-native';
import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import TabLayout from '../../app/(tabs)/_layout';

// Mock the dependencies
jest.mock('@clerk/clerk-expo');
jest.mock('expo-router', () => ({
  Tabs: ({ children, screenOptions }: any) => (
    <div data-testid="tabs-container" data-screen-options={JSON.stringify(screenOptions)}>
      {children}
    </div>
  ),
  useRouter: jest.fn(),
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('Tab Layout Authentication Protection', () => {
  const mockRouter = {
    replace: jest.fn(),
  };

  beforeEach(() => {
    mockUseRouter.mockReturnValue(mockRouter as any);
    jest.clearAllMocks();
  });

  it('shows loading indicator while auth is not loaded', () => {
    mockUseAuth.mockReturnValue({
      isSignedIn: false,
      isLoaded: false,
    });

    const { getByTestId } = render(<TabLayout />);
    
    expect(getByTestId('loading-indicator')).toBeTruthy();
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });

  it('shows loading indicator when user is not authenticated and loaded', () => {
    mockUseAuth.mockReturnValue({
      isSignedIn: false,
      isLoaded: true,
    });

    const { getByTestId } = render(<TabLayout />);
    
    expect(getByTestId('loading-indicator')).toBeTruthy();
    // useEffect should trigger redirect
    expect(mockRouter.replace).toHaveBeenCalledWith('/(auth)/sign-in');
  });

  it('renders tabs when user is authenticated', () => {
    mockUseAuth.mockReturnValue({
      isSignedIn: true,
      isLoaded: true,
    });

    const { getByTestId } = render(<TabLayout />);
    
    expect(getByTestId('tabs-container')).toBeTruthy();
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });

  it('does not render tabs while auth is loading', () => {
    mockUseAuth.mockReturnValue({
      isSignedIn: true,
      isLoaded: false,
    });

    const { getByTestId, queryByTestId } = render(<TabLayout />);
    
    expect(getByTestId('loading-indicator')).toBeTruthy();
    expect(queryByTestId('tabs-container')).toBeNull();
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });

  it('configures gaming theme correctly', () => {
    mockUseAuth.mockReturnValue({
      isSignedIn: true,
      isLoaded: true,
    });

    const { getByTestId } = render(<TabLayout />);
    
    const tabsContainer = getByTestId('tabs-container');
    const screenOptions = JSON.parse(tabsContainer.props['data-screen-options']);
    
    expect(screenOptions.tabBarActiveTintColor).toBe('#00ff88');
    expect(screenOptions.tabBarInactiveTintColor).toBe('#666');
    expect(screenOptions.tabBarStyle.backgroundColor).toBe('#1a1a1a');
    expect(screenOptions.headerStyle.backgroundColor).toBe('#1a1a1a');
  });

  it('redirects unauthenticated users on mount', () => {
    mockUseAuth.mockReturnValue({
      isSignedIn: false,
      isLoaded: true,
    });

    render(<TabLayout />);
    
    expect(mockRouter.replace).toHaveBeenCalledWith('/(auth)/sign-in');
  });

  it('does not redirect authenticated users', () => {
    mockUseAuth.mockReturnValue({
      isSignedIn: true,
      isLoaded: true,
    });

    render(<TabLayout />);
    
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });

  it('handles auth state changes properly', () => {
    // Start with loading state
    mockUseAuth.mockReturnValue({
      isSignedIn: false,
      isLoaded: false,
    });

    const { rerender } = render(<TabLayout />);
    expect(mockRouter.replace).not.toHaveBeenCalled();

    // Change to authenticated
    mockUseAuth.mockReturnValue({
      isSignedIn: true,
      isLoaded: true,
    });

    rerender(<TabLayout />);
    expect(mockRouter.replace).not.toHaveBeenCalled();

    // Change to unauthenticated
    mockUseAuth.mockReturnValue({
      isSignedIn: false,
      isLoaded: true,
    });

    rerender(<TabLayout />);
    expect(mockRouter.replace).toHaveBeenCalledWith('/(auth)/sign-in');
  });
});
