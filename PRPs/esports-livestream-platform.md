---
name: "Esports Livestream Platform PRP"
description: "Complete React Native Expo Go application for esports live streaming with Clerk authentication, video playback, and real-time features"
confidence_score: 9
---

## Purpose

Build a production-ready esports livestream platform mobile application using React Native with Expo Go. The app provides stream discovery, video playback, authentication, and user profiles with a focus on mobile-first streaming experience and 1-month MVP delivery.

## Core Principles

1. **Mobile-First Streaming**: Optimized for mobile video consumption with gesture controls and adaptive streaming
2. **Rapid Development**: Leverage Expo Go for hot reloading and rapid iteration
3. **Production Ready**: Implement proper authentication, error handling, and performance optimization
4. **Esports Focus**: Specialized UI/UX for gaming content and esports community features
5. **Test-Driven Development**: Comprehensive testing strategy with Jest and Detox

## ⚠️ Implementation Guidelines: 1-Month MVP Focus

**IMPORTANT**: This is a 1-month MVP with specific constraints and priorities.

### What TO Build (MVP Phase 1):
- ✅ **Clerk authentication flow** - Core user management
- ✅ **Two-tab navigation** - Esport feed and Profile
- ✅ **Mock stream data** - Realistic esports content
- ✅ **Basic video player** - Stream viewing capability
- ✅ **Clean, professional UI** - No emojis, gaming aesthetic
- ✅ **Expo Go compatibility** - Development and testing

### What NOT to Build (Phase 2 - Future):
- ❌ **Real streaming backend** - Use mock data for MVP
- ❌ **Chat system** - Mock chat messages
- ❌ **Stream creation** - Focus on consumption only
- ❌ **Complex features** - Keep it simple and functional
- ❌ **Multiple platforms** - Mobile-first only

---

## Goal

Create a fully functional esports livestream mobile application that allows users to:
- Authenticate securely with Clerk
- Browse live esports streams (mocked data)
- Watch streams with a professional video player
- Navigate between main feed and profile
- Experience smooth, professional UI optimized for gaming content

## Why

- **Market Opportunity**: Dedicated esports streaming platform for mobile users
- **Community Building**: Focus on esports content creators and viewers
- **Technical Validation**: Prove concept with MVP before full backend investment
- **User Feedback**: Gather insights from real users with functional prototype
- **Development Speed**: 1-month timeline requires focused, practical approach

## What

### Core Features

**Authentication System**
- Clerk integration with email/password signup
- Persistent session management
- User profile creation and management
- Secure token storage with expo-secure-store

**Stream Discovery**
- Main feed displaying live esports streams
- Stream thumbnails with viewer counts
- Creator information and game titles
- Category filtering (League of Legends, Valorant, CS2)
- Pull-to-refresh functionality

**Video Streaming**
- Individual stream viewing pages
- Video player with basic controls (play/pause, fullscreen)
- Stream metadata display (title, creator, game, viewers)
- Mock chat integration
- Smooth video transitions

**Navigation & UI**
- Tab-based navigation (Esport tab, Profile tab)
- Professional dark theme for video content
- Clean typography without emojis
- Responsive design for various screen sizes
- Gaming-focused color scheme and aesthetics

### Success Criteria

- [ ] User can sign up and log in with Clerk authentication
- [ ] Browse mock streams on the main Esport tab
- [ ] Tap on streams to view individual stream pages
- [ ] Video player displays and controls mock stream content
- [ ] Navigate seamlessly between Esport and Profile tabs
- [ ] Profile displays user information and settings
- [ ] App maintains session across restarts
- [ ] UI follows professional esports aesthetic without emojis
- [ ] Performance is smooth with no major lag or crashes

## All Needed Context

### Essential Documentation & Research

```yaml
# CORE EXPO + REACT NATIVE DOCUMENTATION
- url: https://docs.expo.dev/
  why: Official Expo documentation for project setup and development workflow
  content: Expo Go setup, project configuration, and development best practices

- url: https://docs.expo.dev/router/introduction/
  why: Expo Router file-based routing system and navigation patterns
  content: Tab navigation, layout configuration, and route protection

- url: https://docs.expo.dev/router/advanced/tabs/
  why: Tab navigation implementation with Expo Router
  content: Bottom tab configuration, icons, and navigation structure

- url: https://docs.expo.dev/versions/latest/sdk/video/
  why: Expo video component for stream playback
  content: Video player setup, HLS streaming support, and controls

# CLERK AUTHENTICATION INTEGRATION
- url: https://clerk.com/docs/quickstarts/expo
  why: Official Clerk Expo integration guide and setup
  content: Installation, configuration, and authentication flows

- url: https://docs.expo.dev/router/advanced/authentication/
  why: Authentication patterns with Expo Router
  content: Protected routes, session management, and auth state

- url: https://github.com/clerk/clerk-expo-starter
  why: Official Clerk Expo starter project with working examples
  content: Complete authentication setup and navigation patterns

# VIDEO STREAMING AND PLAYER SETUP
- url: https://docs.expo.dev/versions/latest/sdk/av/
  why: Expo AV for video playback and streaming capabilities
  content: Video player implementation, HLS support, and media controls

- url: https://gist.github.com/lucky-c/91d96977f913d54f723b64c34ce03fac
  why: Working example of HLS streaming with expo-av
  content: Code example for video streaming setup and configuration

# REACT QUERY FOR STATE MANAGEMENT
- url: https://tanstack.com/query/latest/docs/framework/react/overview
  why: Data fetching and state management for React Native
  content: Query setup, caching strategies, and mobile optimization

# TESTING AND DEVELOPMENT
- url: https://docs.expo.dev/develop/development-builds/introduction/
  why: Development builds for testing authentication flows
  content: Building and testing apps with OAuth and custom schemes

- url: https://jestjs.io/docs/tutorial-react-native
  why: Jest testing setup for React Native applications
  content: Unit testing components, hooks, and navigation
```

### Existing Codebase Patterns

```yaml
# REFERENCE IMPLEMENTATIONS IN CURRENT CODEBASE
- file: use-cases/pydantic-ai/examples/TournamentScreen.tsx
  why: React Native component structure and patterns to follow
  content: Component architecture, styling, and state management patterns

- file: use-cases/pydantic-ai/examples/useTournaments.ts
  why: Custom hook patterns for data management
  content: React Query integration, optimistic updates, and error handling

- file: CLAUDE.md
  why: Project conventions and development guidelines
  content: TypeScript patterns, testing requirements, and code standards

- file: INITIAL.md
  why: Complete project requirements and constraints
  content: Feature scope, design requirements, and technical specifications
```

### Technology Architecture Analysis

```yaml
# EXPO GO DEVELOPMENT PATTERNS
expo_go_setup:
  project_creation: "npx create-expo-app --template"
  development_server: "npx expo start"
  device_testing: "Expo Go app with QR code scanning"
  hot_reloading: "Instant updates during development"
  limitations: "OAuth requires development build, not Expo Go client"

# CLERK AUTHENTICATION INTEGRATION
clerk_patterns:
  installation: "@clerk/clerk-expo, expo-secure-store"
  provider_setup: "ClerkProvider wrapping app/_layout.tsx"
  token_storage: "Secure token cache with expo-secure-store"
  protected_routes: "useAuth hook for route protection"
  session_management: "Automatic session persistence and refresh"

# EXPO ROUTER NAVIGATION
navigation_structure:
  file_based_routing: "app/ directory with route files"
  tab_navigation: "app/(tabs)/ directory for bottom tabs"
  layout_files: "_layout.tsx files for navigation configuration"
  protected_routes: "Conditional rendering based on auth state"
  deep_linking: "Universal URLs for all screens"

# VIDEO STREAMING SETUP
video_implementation:
  player_library: "expo-av or expo-video for playback"
  streaming_format: "HLS (.m3u8) for adaptive streaming"
  controls: "Custom controls overlay on video player"
  fullscreen: "Native fullscreen support"
  performance: "Optimize for mobile video consumption"
```

### Mock Data Strategy

```yaml
# REALISTIC ESPORTS CONTENT MOCKING
stream_data_structure:
  stream_id: "unique identifier for routing"
  title: "Stream title (e.g., 'Ranked Climbing to Diamond')"
  creator: "Streamer name (e.g., 'ProGamer_2024')"
  game: "Game title (e.g., 'League of Legends', 'Valorant', 'CS2')"
  viewer_count: "Realistic numbers (e.g., 1234, 2.5K, 15.2K)"
  thumbnail_url: "Mock image URLs for stream previews"
  category: "Game category for filtering"
  is_live: "Boolean for live status"
  duration: "Stream duration for non-live content"

# MOCK DATA CATEGORIES
popular_games:
  - "League of Legends"
  - "Valorant" 
  - "Counter-Strike 2"
  - "Rocket League"
  - "Apex Legends"
  - "Fortnite"
  - "Call of Duty"

mock_streamers:
  - "ProGamer_2024"
  - "EsportsLegend"
  - "RankedClimber"
  - "TournamentPro"
  - "GameMaster99"
  - "CompetitivePlayer"

realistic_viewer_counts:
  - "1,234 viewers"
  - "2.5K viewers" 
  - "856 viewers"
  - "15.2K viewers"
  - "3,891 viewers"
```

### Common React Native Expo Gotchas

```yaml
# DEVELOPMENT AND DEPLOYMENT ISSUES
expo_go_limitations:
  issue: "OAuth authentication doesn't work in Expo Go client"
  solution: "Use development build for testing authentication flows"
  workaround: "Mock authentication in Expo Go, test auth in dev build"

video_streaming_challenges:
  issue: "iOS requires .m3u8 extension for HLS streams"
  solution: "Ensure contentType is set to 'hls' for video sources"
  performance: "Caching not available with HLS on iOS platform"

navigation_state_management:
  issue: "Tab state may reset on app background/foreground"
  solution: "Implement proper state persistence with AsyncStorage"
  pattern: "Use React Query for persistent data across navigation"

authentication_flow_complexity:
  issue: "Session state management across app restarts"
  solution: "ClerkProvider with tokenCache handles persistence automatically"
  testing: "Mock authentication in development, real auth in builds"
```

## Implementation Blueprint

### Phase 1: Project Setup and Foundation

```yaml
Implementation Task 1 - Expo Project Initialization:
  CREATE new Expo project with proper configuration:
    - npx create-expo-app EsportsStream --template blank-typescript
    - Configure app.json with proper app name and bundle identifier
    - Set up development environment and Expo Go testing
    - Initialize git repository and commit initial setup

Implementation Task 2 - Directory Structure Setup:
  CREATE proper file-based routing structure:
    - app/_layout.tsx (root layout with ClerkProvider)
    - app/(auth)/login.tsx (authentication screen)
    - app/(auth)/signup.tsx (user registration)
    - app/(tabs)/_layout.tsx (tab navigation layout)
    - app/(tabs)/esport.tsx (main stream discovery)
    - app/(tabs)/profile.tsx (user profile)
    - app/stream/[id].tsx (individual stream viewing)

Implementation Task 3 - Core Dependencies Installation:
  INSTALL required packages with proper versions:
    - @clerk/clerk-expo (authentication)
    - expo-secure-store (token storage)
    - expo-router (navigation)
    - @tanstack/react-query (state management)
    - expo-av (video playback)
    - expo-linear-gradient (UI effects)
    - @expo/vector-icons (icons)
```

### Phase 2: Authentication System

```yaml
Implementation Task 4 - Clerk Authentication Setup:
  CONFIGURE Clerk authentication with Expo integration:
    - Set up Clerk dashboard and get publishable key
    - Configure ClerkProvider in app/_layout.tsx
    - Set up tokenCache with expo-secure-store
    - Create environment variables for API keys
    - Test authentication flow in development build

Implementation Task 5 - Authentication Screens:
  IMPLEMENT login and signup user interfaces:
    - Create login form with email/password fields
    - Implement signup flow with email verification
    - Add form validation and error handling
    - Style forms with professional esports aesthetic
    - Test authentication flows and session persistence

Implementation Task 6 - Protected Route System:
  SETUP route protection based on authentication state:
    - Create useAuth hook wrapper for Clerk authentication
    - Implement route guards for protected screens
    - Add loading states during authentication checks
    - Handle authentication redirects properly
    - Test protected route navigation
```

### Phase 3: Navigation and UI Foundation

```yaml
Implementation Task 7 - Tab Navigation Implementation:
  CREATE bottom tab navigation with Expo Router:
    - Configure (tabs) layout with proper tab structure
    - Add tab icons and labels for Esport and Profile tabs
    - Implement tab bar styling with gaming theme
    - Set up proper navigation state management
    - Test tab switching and state persistence

Implementation Task 8 - UI Theme and Components:
  DEVELOP consistent design system and reusable components:
    - Create color palette for professional esports aesthetic
    - Implement dark theme optimized for video content
    - Build reusable UI components (buttons, cards, headers)
    - Set up typography system without emoji usage
    - Create loading and error state components

Implementation Task 9 - Mock Data System:
  CREATE realistic mock data for development and testing:
    - Generate mock stream data with realistic esports content
    - Create mock user profiles and streamer information
    - Implement mock API services with proper TypeScript types
    - Add mock chat messages and interaction data
    - Set up data persistence with AsyncStorage
```

### Phase 4: Stream Discovery and Video Playback

```yaml
Implementation Task 10 - Stream Discovery Screen:
  IMPLEMENT main stream browsing interface:
    - Create stream card components with thumbnails and metadata
    - Implement FlatList for optimal performance with large lists
    - Add pull-to-refresh functionality for stream updates
    - Create category filtering for different games
    - Implement search functionality for finding specific streams

Implementation Task 11 - Video Player Integration:
  SETUP video streaming with expo-av:
    - Configure video player component with custom controls
    - Implement fullscreen video playback
    - Add basic player controls (play/pause, seek, volume)
    - Handle video loading states and error scenarios
    - Test video playback with mock HLS streams

Implementation Task 12 - Individual Stream Pages:
  CREATE detailed stream viewing experience:
    - Design stream detail layout with video player
    - Display stream metadata (title, creator, game, viewers)
    - Add mock chat interface and messages
    - Implement navigation to and from stream pages
    - Test deep linking to specific streams
```

### Phase 5: User Profile and Settings

```yaml
Implementation Task 13 - User Profile Screen:
  BUILD user profile management interface:
    - Display user information from Clerk authentication
    - Create profile editing functionality
    - Add user preferences and settings
    - Implement logout functionality
    - Show user's viewing history and favorites

Implementation Task 14 - App Settings and Preferences:
  IMPLEMENT application configuration options:
    - Add video quality preferences
    - Create notification settings
    - Implement theme customization options
    - Add privacy and security settings
    - Create about and help sections
```

### Phase 6: Testing and Polish

```yaml
Implementation Task 15 - Comprehensive Testing Setup:
  IMPLEMENT testing strategy with Jest and Detox:
    - Set up Jest configuration for React Native testing
    - Create unit tests for components and hooks
    - Write integration tests for authentication flows
    - Implement E2E tests with Detox for critical user journeys
    - Add performance testing for video playback

Implementation Task 16 - Performance Optimization:
  OPTIMIZE app performance for mobile devices:
    - Implement image caching and optimization
    - Optimize FlatList performance with proper configurations
    - Add proper loading states and skeleton screens
    - Minimize bundle size and optimize imports
    - Test performance on various device types

Implementation Task 17 - Final Polish and Bug Fixes:
  REFINE user experience and fix any remaining issues:
    - Conduct thorough testing on iOS and Android
    - Fix navigation and state management issues
    - Polish UI animations and transitions
    - Ensure accessibility compliance
    - Prepare app for production deployment
```

## Per-Task Implementation Guidance

### Authentication Flow Implementation
```typescript
// app/_layout.tsx - Root layout with Clerk setup
import { ClerkProvider } from '@clerk/clerk-expo';
import { Slot } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export default function RootLayout() {
  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
    >
      <Slot />
    </ClerkProvider>
  );
}
```

### Tab Navigation Structure
```typescript
// app/(tabs)/_layout.tsx - Tab layout configuration
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#00ff88', // Gaming green
        tabBarStyle: { backgroundColor: '#1a1a1a' }, // Dark theme
        headerStyle: { backgroundColor: '#1a1a1a' },
        headerTintColor: '#ffffff',
      }}
    >
      <Tabs.Screen
        name="esport"
        options={{
          title: 'Esport',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="game-controller" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
```

### Video Player Implementation
```typescript
// components/StreamPlayer.tsx - Video player component
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

interface StreamPlayerProps {
  streamUrl: string;
  isLive: boolean;
}

export default function StreamPlayer({ streamUrl, isLive }: StreamPlayerProps) {
  const [status, setStatus] = React.useState({});

  return (
    <View style={styles.container}>
      <Video
        style={styles.video}
        source={{ uri: streamUrl }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping={false}
        onPlaybackStatusUpdate={setStatus}
        shouldPlay={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
  },
  video: {
    flex: 1,
  },
});
```

## Validation Loop

### Level 1: Project Setup Validation

```bash
# Verify Expo project structure and dependencies
npx expo install --check
npx expo doctor

# Check required dependencies
npm list @clerk/clerk-expo expo-secure-store expo-router @tanstack/react-query expo-av

# Test development server startup
npx expo start --clear

# Expected: Clean project setup with all dependencies installed
# If failing: Reinstall dependencies and check Expo CLI version
```

### Level 2: Authentication Flow Validation

```bash
# Test Clerk authentication setup
npx expo start
# Scan QR code with development build (not Expo Go for auth)

# Verify environment variables
grep -r "EXPO_PUBLIC_CLERK" .env

# Test authentication screens
# Navigate to login/signup screens and test flows

# Expected: Authentication works in development build
# If failing: Check Clerk dashboard configuration and API keys
```

### Level 3: Navigation and UI Validation

```bash
# Test tab navigation
# Verify bottom tabs display correctly
# Test navigation between Esport and Profile tabs

# Check UI theme consistency
# Verify dark theme implementation
# Test on both iOS and Android simulators

# Validate responsive design
# Test on different screen sizes
# Check component rendering

# Expected: Smooth navigation and consistent UI
# If failing: Debug navigation configuration and styling
```

### Level 4: Video and Streaming Validation

```bash
# Test video player functionality
# Play mock video content
# Test fullscreen mode
# Verify video controls work

# Check stream discovery
# Browse mock streams
# Test pull-to-refresh
# Verify stream detail navigation

# Expected: Video playback works smoothly
# If failing: Check expo-av setup and video sources
```

### Level 5: Performance and Production Readiness

```bash
# Run React Native performance tests
npx react-native-performance-test

# Test on physical devices
# Install development build on iOS/Android devices
# Test authentication flow on real devices
# Verify video performance

# Check bundle size
npx expo export --dump-assetmap

# Expected: Good performance metrics and small bundle size
# If failing: Optimize imports and implement lazy loading
```

## Final Validation Checklist

### Core Functionality
- [ ] Clerk authentication works in development build
- [ ] Tab navigation between Esport and Profile screens
- [ ] Stream discovery with mock data displays correctly
- [ ] Video player plays mock content successfully
- [ ] Individual stream pages load and display properly
- [ ] User profile shows authentication information
- [ ] Session persists across app restarts
- [ ] Navigation deep linking works correctly

### Design and UX
- [ ] Professional dark theme throughout the app
- [ ] No emojis used anywhere in the interface
- [ ] Gaming-focused color scheme implemented
- [ ] Responsive design works on various screen sizes
- [ ] Loading states and error handling in place
- [ ] Smooth animations and transitions
- [ ] Accessibility features properly implemented

### Technical Requirements
- [ ] TypeScript used throughout the codebase
- [ ] React Query for state management setup
- [ ] Proper error boundaries implemented
- [ ] Performance optimized for mobile devices
- [ ] Bundle size within reasonable limits
- [ ] Code follows established patterns from CLAUDE.md

### Testing and Quality
- [ ] Unit tests written for key components
- [ ] Integration tests for authentication flows
- [ ] E2E tests for critical user journeys
- [ ] Performance tests pass on target devices
- [ ] Code linting and type checking pass
- [ ] No memory leaks or performance issues

---

## Anti-Patterns to Avoid

### React Native and Expo Development
- ❌ Don't test OAuth in Expo Go client - use development builds
- ❌ Don't ignore platform differences - test on both iOS and Android
- ❌ Don't skip performance optimization - mobile devices have limited resources
- ❌ Don't use large images without optimization - implement proper image caching

### Authentication and Security
- ❌ Don't store sensitive data in plain text - use expo-secure-store
- ❌ Don't skip session management - implement proper token refresh
- ❌ Don't ignore authentication edge cases - handle network failures
- ❌ Don't hardcode API keys - use environment variables

### Video Streaming and Performance
- ❌ Don't ignore video format requirements - use proper HLS streams
- ❌ Don't skip video loading states - provide clear feedback to users
- ❌ Don't ignore memory management - properly dispose of video resources
- ❌ Don't skip error handling - videos may fail to load

### UI and Design
- ❌ Don't use emojis anywhere in the app - violates design requirements
- ❌ Don't ignore dark theme - optimize for video content viewing
- ❌ Don't skip responsive design - support various screen sizes
- ❌ Don't ignore accessibility - implement proper screen reader support

**CONFIDENCE SCORE: 9/10** - High confidence for successful one-pass implementation with comprehensive context, detailed research, and clear validation gates. The 1-month timeline is realistic with proper scope management and focus on MVP features.