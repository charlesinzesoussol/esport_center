# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native Expo Go mobile application for esports live stream discovery and viewing. The app provides real-time stream browsing, user authentication, and video streaming capabilities for esports content.

## Technology Stack

- **Framework**: React Native 0.73+ with Expo 50 and TypeScript
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
│   │   ├── login.tsx     # Login screen
│   │   └── signup.tsx    # Sign up screen
│   ├── (tabs)/           # Tab navigation group
│   │   ├── _layout.tsx   # Tab layout with auth protection
│   │   ├── esport.tsx    # Main stream discovery screen
│   │   └── profile.tsx   # User profile screen
│   └── _layout.tsx       # Root layout with providers
├── components/           # Reusable UI components (planned)
├── hooks/               # Custom React hooks (planned)
├── utils/               # Helper functions and utilities (planned)
├── types/               # TypeScript type definitions (planned)
├── constants/           # App constants and configuration (planned)
├── __tests__/          # Test files
└── assets/             # Images, fonts, and other static assets
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
# Build for Expo Go development
npm run build

# Build for iOS production (requires EAS)
npm run build:ios

# Build for Android production (requires EAS)
npm run build:android

# Export for web deployment
npx expo export --platform web
```

### Code Quality
```bash
# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix

# Type checking
npm run type-check

# Format code with Prettier
npm run format
```

## Architecture Patterns

### Screen Component Structure
```typescript
// app/(tabs)/esport.tsx
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

export default function EsportScreen() {
  const router = useRouter();
  const [streams, setStreams] = useState(MOCK_STREAMS);

  const handleStreamPress = (streamId: string) => {
    router.push(`/stream/${streamId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Screen implementation */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  }
});
```

### Authentication Hook Pattern
```typescript
// Using Clerk authentication
import { useAuth, useUser } from '@clerk/clerk-expo';

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();
  
  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };
  
  return (
    <View>
      <Text>{user?.emailAddresses[0]?.emailAddress}</Text>
    </View>
  );
}
```

### Data Fetching with React Query
```typescript
// Future pattern for API integration
import { useQuery } from '@tanstack/react-query';

const useStreams = () => {
  return useQuery({
    queryKey: ['streams'],
    queryFn: async () => {
      // API call to fetch streams
      const response = await fetch('/api/streams');
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
```

## Current Features Implemented

### Authentication System
- **Clerk Integration**: Complete email/password authentication
- **Secure Token Storage**: Uses expo-secure-store for token caching
- **Protected Routes**: Tab navigation redirects to login if unauthenticated
- **Email Verification**: Two-step signup process with email verification

### Navigation Structure
- **Expo Router**: File-based routing with grouped routes
- **Tab Navigation**: Two main tabs (Esport and Profile)
- **Auth Flow**: Separate authentication screens outside main navigation

### Stream Discovery
- **Mock Data System**: Realistic esports stream data for development
- **Search Functionality**: Filter streams by title, creator, or game
- **Pull-to-Refresh**: Simulated data refresh capability
- **Performance Optimized**: FlatList with proper render optimization

### User Interface
- **Dark Gaming Theme**: Optimized for video content viewing
- **Consistent Design**: Gaming green accent (#00ff88) throughout
- **Responsive Layout**: Mobile-first design with proper safe areas
- **Professional Styling**: Clean, modern interface without distractions

## Future Development Roadmap

### Planned Features
- **Video Player Integration**: expo-av video streaming implementation
- **Individual Stream Pages**: Detailed stream viewing experience
- **Real API Integration**: Replace mock data with live streaming APIs
- **Enhanced Profile Settings**: User preferences and account management
- **Push Notifications**: Live stream alerts and updates
- **Offline Support**: Cache streams and enable offline viewing

### Testing Strategy
```typescript
// __tests__/screens/EsportScreen.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import EsportScreen from '@/app/(tabs)/esport';

describe('EsportScreen', () => {
  it('displays stream list', () => {
    const { getByText } = render(<EsportScreen />);
    
    expect(getByText('League of Legends')).toBeTruthy();
    expect(getByText('ProGamer_2024')).toBeTruthy();
  });
  
  it('filters streams by search query', () => {
    const { getByPlaceholderText, getByText } = render(<EsportScreen />);
    const searchInput = getByPlaceholderText('Search streams, games, or creators');
    
    fireEvent.changeText(searchInput, 'Valorant');
    expect(getByText('Valorant')).toBeTruthy();
  });
});
```

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

# Clear npm and Expo caches
npm run clean && npx expo install --fix

# Reset Metro bundler
npx expo start --clear
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

### Development Timeline
- **Week 1-2**: Core MVP (COMPLETED)
- **Week 3**: Video streaming features
- **Week 4**: API integration and testing
- **Month Goal**: Production-ready esports streaming app

## Git Workflow

### Current Branch: main
- All MVP features merged to main branch
- Ready for feature development branches

### Commit Style
```
feat: add user profile screen with sign out
fix: resolve authentication token refresh
docs: update CLAUDE.md with current implementation
chore: install dependencies with legacy peer deps
```

## Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router Guide](https://expo.github.io/router/)
- [Clerk Expo Integration](https://clerk.com/docs/quickstarts/expo)
- [React Query Documentation](https://tanstack.com/query)
- [Expo AV Documentation](https://docs.expo.dev/versions/latest/sdk/av/)