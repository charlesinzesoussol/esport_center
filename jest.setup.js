import '@testing-library/jest-native/extend-expect';

// Mock react-native modules
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

// Mock expo modules
jest.mock('expo-constants', () => ({
  default: {
    deviceName: 'Test Device',
    isDevice: false,
  },
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock('expo-web-browser', () => ({
  maybeCompleteAuthSession: jest.fn(),
  openBrowserAsync: jest.fn(),
}));

jest.mock('expo-linking', () => ({
  createURL: jest.fn(),
  useURL: jest.fn(),
}));

// Mock clerk
jest.mock('@clerk/clerk-expo', () => ({
  ClerkProvider: ({ children }) => children,
  useAuth: jest.fn(() => ({
    isSignedIn: false,
    isLoaded: true,
    userId: null,
    sessionId: null,
    getToken: jest.fn(),
  })),
  useOAuth: jest.fn(() => ({
    startOAuthFlow: jest.fn(),
  })),
  useSignIn: jest.fn(() => ({
    signIn: { create: jest.fn() },
    setActive: jest.fn(),
    isLoaded: true,
  })),
  useSignUp: jest.fn(() => ({
    signUp: { create: jest.fn() },
    setActive: jest.fn(),
    isLoaded: true,
  })),
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  })),
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
  Link: ({ children }) => children,
  Slot: ({ children }) => children,
}));

// Mock react-query
jest.mock('@tanstack/react-query', () => ({
  QueryClient: jest.fn(() => ({
    defaultQueryOptions: {},
  })),
  QueryClientProvider: ({ children }) => children,
}));

// Silence console warnings in tests
global.console.warn = jest.fn();
global.console.error = jest.fn();

// Mock Dimensions
jest.mock('react-native/Libraries/Utilities/Dimensions', () => ({
  get: jest.fn().mockReturnValue({ width: 375, height: 812 }),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

// Mock Platform
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: jest.fn((options) => options.ios),
}));

// Also mock the Platform import in react-native
jest.mock('react-native', () => {
  const RN = {
    Platform: {
      OS: 'ios',
      select: jest.fn((options) => options.ios),
    },
    Alert: {
      alert: jest.fn(),
    },
    StyleSheet: {
      create: jest.fn((styles) => styles),
    },
    View: 'View',
    Text: 'Text',
    TextInput: 'TextInput',
    TouchableOpacity: 'TouchableOpacity',
    ActivityIndicator: 'ActivityIndicator',
    SafeAreaView: 'SafeAreaView',
    KeyboardAvoidingView: 'KeyboardAvoidingView',
    ScrollView: 'ScrollView',
    FlatList: 'FlatList',
    RefreshControl: 'RefreshControl',
  };
  return RN;
});

// Mock Alert
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

// Setup console logging for development
if (process.env.NODE_ENV === 'development') {
  console.log('Jest setup complete for OAuth testing');
}