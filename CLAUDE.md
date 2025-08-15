# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native Expo Go mobile application for esports live stream discovery and viewing. The app provides real-time stream browsing, user authentication, and video streaming capabilities for esports content.

## Technology Stack

- **Framework**: React Native 0.79+ with Expo 53 and TypeScript
- **Navigation**: Expo Router (file-based routing)
- **Authentication**: Clerk with expo-secure-store for token management
- **State Management**: React Query (@tanstack/react-query)
- **UI Components**: React Native core components with custom styled components
- **Video Streaming**: expo-av for video playback
- **Testing**: Jest for unit tests, planned Playwright for E2E
- **CI/CD**: GitHub Actions with automated testing and deployment
- **Platform Support**: iOS 13+ and Android 8+ (API 26+)

## Project Structure

```
esport_center/
├── app/                   # Expo Router app directory
│   ├── (auth)/           # Authentication screens group
│   │   ├── login.tsx     # Login screen with Clerk integration
│   │   └── signup.tsx    # Sign up screen with email verification
│   ├── (tabs)/           # Tab navigation group
│   │   ├── _layout.tsx   # Tab layout with auth protection and redirect
│   │   ├── esport.tsx    # Main stream discovery screen with search
│   │   └── profile.tsx   # User profile screen with settings
│   └── _layout.tsx       # Root layout with Clerk and React Query providers
├── assets/               # Images, fonts, and other static assets
│   ├── adaptive-icon.png # Android adaptive icon
│   ├── favicon.png       # Web favicon
│   ├── icon.png         # iOS app icon
│   └── splash.png       # Splash screen image
├── babel.config.js       # Babel configuration with expo-router and module resolver
├── metro.config.js       # Metro bundler configuration
├── app.json             # Expo app configuration
├── tsconfig.json        # TypeScript configuration with path mapping
├── package.json         # Dependencies and scripts
└── CLAUDE.md           # This file - development guidance
```

## Development Commands

### Setup and Installation
```bash
# Install dependencies
npm install --legacy-peer-deps

# Setup environment variables for Clerk authentication
# Create .env file with:
# EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### Running the Application
```bash
# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web (limited support)
npm run web

# Start with specific tunnel
npx expo start --tunnel
```

### Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- components/Button.test.tsx
```

### Building and Deployment
```bash
# Export for Expo Go development
npm run build
# Note: This runs 'expo export' for development builds

# Build for iOS production (requires EAS)
npm run build:ios
# Note: This runs 'eas build --platform ios'

# Build for Android production (requires EAS)
npm run build:android
# Note: This runs 'eas build --platform android'

# Export for web deployment
npx expo start --web
```

### Code Quality
```bash
# Run ESLint
npm run lint
# Note: Runs 'eslint . --ext .js,.jsx,.ts,.tsx'

# Fix ESLint issues
npm run lint:fix
# Note: Runs 'eslint . --ext .js,.jsx,.ts,.tsx --fix'

# Type checking
npm run type-check
# Note: Runs 'tsc --noEmit'

# Note: Prettier is not currently configured in package.json
# but can be added as a dev dependency if needed
```

## Architecture Patterns

### Screen Component Structure
```typescript
// app/(tabs)/esport.tsx - Actual implementation
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Mock streams data with complete structure
const MOCK_STREAMS = [
  {
    id: '1',
    title: 'Ranked Climbing to Diamond - League of Legends',
    creator: 'ProGamer_2024',
    game: 'League of Legends',
    viewerCount: 2543,
    thumbnailUrl: 'https://via.placeholder.com/300x200/1a1a1a/00ff88?text=LoL',
    isLive: true,
  },
  // ... more streams
];

export default function EsportScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [streams, setStreams] = useState(MOCK_STREAMS);

  const handleStreamPress = (streamId: string) => {
    router.push(`/stream/${streamId}`);
  };

  const filteredStreams = streams.filter(stream =>
    stream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stream.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stream.game.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Search functionality */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search streams, games, or creators"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      {/* Optimized FlatList with performance settings */}
      <FlatList
        data={filteredStreams}
        renderItem={renderStreamCard}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
      />
    </SafeAreaView>
  );
}
```

### Authentication Hook Pattern
```typescript
// app/(tabs)/profile.tsx - Actual Clerk implementation
import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/(auth)/login');
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out');
            }
          },
        },
      ]
    );
  };

  return (
    <View>
      <Text>{user?.firstName || user?.emailAddresses[0]?.emailAddress || 'User'}</Text>
      <Text>{user?.emailAddresses[0]?.emailAddress}</Text>
      <TouchableOpacity onPress={handleSignOut}>
        <Text>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
```

### React Query Configuration
```typescript
// app/_layout.tsx - Actual React Query setup
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Global query client configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="light" backgroundColor="#1a1a1a" />
        <Slot />
      </QueryClientProvider>
    </ClerkProvider>
  );
}

// Future pattern for API integration
const useStreams = () => {
  return useQuery({
    queryKey: ['streams'],
    queryFn: async () => {
      const response = await fetch('/api/streams');
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
  });
};
```

## Current Features Implemented

### Authentication System
- **Clerk Integration**: Complete email/password authentication with @clerk/clerk-expo ^1.0.0
- **Secure Token Storage**: expo-secure-store ~12.8.1 for iOS Keychain/Android Keystore
- **Protected Routes**: Tab layout redirects to login if not authenticated using useAuth hook
- **Error Handling**: Comprehensive error handling with user-friendly alerts
- **Session Management**: Automatic session handling with setActive on successful login

### Navigation Structure
- **Expo Router**: File-based routing ~3.4.0 with typed routes enabled
- **Route Groups**: (auth) and (tabs) groups for organized navigation
- **Tab Navigation**: Two main tabs (Esport and Profile) with Ionicons
- **Auth Guards**: Authentication checks in tab layout with loading states
- **Deep Linking**: Configured with custom scheme 'esports-stream'

### Stream Discovery
- **Mock Data System**: Complete mock streams with viewerCount, thumbnails, live status
- **Search Functionality**: Real-time filtering by title, creator, or game
- **Pull-to-Refresh**: RefreshControl integration with loading states
- **Performance Optimized**: FlatList with removeClippedSubviews, maxToRenderPerBatch=10, windowSize=10
- **Stream Cards**: Custom TouchableOpacity cards with live indicators

### User Interface
- **Dark Gaming Theme**: Consistent #0a0a0a background, #1a1a1a cards
- **Gaming Green Accent**: #00ff88 used for buttons, links, and active states
- **Typography**: Hierarchical text styling with proper contrast ratios
- **Icons**: @expo/vector-icons integration throughout the app
- **Safe Areas**: Proper SafeAreaView usage on all screens
- **Status Bar**: Configured for dark theme with light content

## Future Development Roadmap

### Planned Features
- **Video Player Integration**: expo-av video streaming implementation
- **Individual Stream Pages**: Detailed stream viewing experience
- **Real API Integration**: Replace mock data with live streaming APIs
- **Enhanced Profile Settings**: User preferences and account management
- **Push Notifications**: Live stream alerts and updates
- **Offline Support**: Cache streams and enable offline viewing

### Testing Configuration
```json
// package.json - Jest configuration
"jest": {
  "preset": "jest-expo",
  "transformIgnorePatterns": [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)"
  ],
  "collectCoverageFrom": [
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "hooks/**/*.{ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**"
  ]
}
```

### Testing Commands Available
```bash
# Run all tests
npm test

# Run tests in watch mode  
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

**Note**: No test files currently exist in the project. Testing infrastructure is configured but tests need to be created.

## Performance Optimization

### Current Optimizations Implemented
- **FlatList Performance**: Configured with `removeClippedSubviews`, `maxToRenderPerBatch`, and `windowSize`
- **Component Optimization**: Stream cards optimized for rendering performance
- **Stable Keys**: Proper `keyExtractor` implementation for stream lists
- **Dark Theme**: Reduces battery usage on OLED screens

### Future Optimizations
- **Image Caching**: Implement expo-image for better image performance
- **Video Streaming**: Optimize expo-av for smooth video playback
- **Bundle Splitting**: Code splitting for better app startup times
- **Memory Management**: Efficient handling of video streams and thumbnails

### Expo-Specific Optimizations
- **Over-the-Air Updates**: Use Expo Updates for faster deployments
- **Asset Optimization**: Optimize images and videos for mobile viewing
- **Network Caching**: React Query for efficient data caching
- **Expo Router**: File-based routing for better performance

## Security Implementation

### Current Security Measures
- **Clerk Authentication**: Industry-standard OAuth implementation
- **Secure Token Storage**: expo-secure-store for iOS Keychain/Android Keystore
- **Environment Variables**: Proper handling of sensitive configuration
- **Protected Routes**: Authentication required for main app features

### Production Security Checklist
- **Expo EAS Build**: Secure cloud builds with proper signing
- **API Key Management**: Environment-based configuration
- **Session Management**: Automatic token refresh with Clerk
- **Input Validation**: Sanitization of user inputs

### Future Security Enhancements
- **Certificate Pinning**: For production API calls
- **Biometric Authentication**: Face ID/Touch ID integration
- **Device Security**: Root/jailbreak detection
- **Content Security**: Video stream encryption for premium content

## Platform-Specific Implementation

### Current Expo Implementation
- **Universal SafeAreaView**: Proper safe area handling across all devices
- **Status Bar Configuration**: Dark theme with proper status bar styling
- **Keyboard Handling**: KeyboardAvoidingView in authentication screens
- **Navigation Gestures**: Native navigation feel with Expo Router

### iOS Considerations
- **Face ID/Touch ID**: Future biometric authentication support
- **Picture-in-Picture**: Video playback in background
- **App Store Guidelines**: Compliance with streaming app requirements
- **Dynamic Island**: Future support for Live Activities

### Android Considerations
- **Back Button Handling**: Proper navigation behavior
- **Notification Permissions**: Stream notification management
- **Background Playback**: Audio-only stream support
- **Play Store Guidelines**: Compliance with content streaming policies

## Common Issues and Solutions

### Expo Development Issues
```bash
# Clear Expo cache
npx expo start -c

# Clear Metro bundler cache
npx expo start --clear

# Reset Metro bundler (alternative)
npx expo start --reset-cache

# Note: 'npm run clean' is not defined in package.json
# Clear node_modules and reinstall if needed:
# rm -rf node_modules package-lock.json && npm install
```

### Authentication Issues
```bash
# Check Clerk configuration
echo $EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY

# Verify secure store permissions
npx expo install expo-secure-store
```

### Dependency Issues
```bash
# Install with legacy peer deps (recommended)
npm install --legacy-peer-deps

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

## Development Status

### MVP Features Completed ✅
- [x] Expo project setup with TypeScript
- [x] Clerk authentication with email/password
- [x] Protected route navigation
- [x] Tab navigation (Esport/Profile)
- [x] Dark gaming theme UI
- [x] Stream discovery with search
- [x] Mock data system
- [x] User profile management

### Next Phase Development 🚧
- [ ] Video player integration with expo-av
- [ ] Individual stream detail pages
- [ ] Real streaming API integration
- [ ] Enhanced user settings
- [ ] Comprehensive testing suite
- [ ] Performance optimizations

### Development Status Update
- **MVP Core Features**: ✅ COMPLETED
  - Expo Router navigation with authentication
  - Clerk authentication integration
  - Stream discovery with search and refresh
  - User profile management
  - Dark gaming theme implementation
- **Current Phase**: Ready for feature expansion
- **Next Priorities**: Video streaming, API integration, testing suite

## Git Workflow

### Current Branch: update-claude-md-20250813-223843
- Working branch for documentation updates
- Main branch contains completed MVP features
- Ready for feature development branches

### Commit Style
```
feat: add user profile screen with sign out
fix: resolve authentication token refresh
docs: update CLAUDE.md with current implementation
chore: install dependencies with legacy peer deps
```

## Additional Configuration Files

### TypeScript Configuration
- **Base**: Extends `expo/tsconfig.base`
- **Strict Mode**: Enabled for type safety
- **Path Mapping**: Configured for `@/*` aliases pointing to app, components, hooks, etc.
- **Include**: All TypeScript files plus Expo generated types

### Babel Configuration
- **Preset**: `babel-preset-expo`
- **Plugins**: 
  - `expo-router/babel` for file-based routing
  - `module-resolver` for path aliases matching tsconfig

### App Configuration (app.json)
- **Name**: EsportsStream
- **Slug**: esports-stream
- **Orientation**: Portrait only
- **Theme**: Dark mode (`userInterfaceStyle: "dark"`)
- **Splash**: Dark background (#1a1a1a)
- **Plugins**: expo-router
- **Experiments**: Typed routes enabled

## Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router Guide](https://expo.github.io/router/)
- [Clerk Expo Integration](https://clerk.com/docs/quickstarts/expo)
- [React Query Documentation](https://tanstack.com/query)
- [Expo AV Documentation](https://docs.expo.dev/versions/latest/sdk/av/)
- [React Native Safe Area Context](https://github.com/th3rdwave/react-native-safe-area-context)


**ALWAYS USE SUB AGENTS WHEN YOU HAVE TO MAKE A SPECIALISED TASK IN THE AGENT DOMAIN !**