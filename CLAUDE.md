# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native mobile application for an esports center management system. The app provides tournament management, player profiles, team coordination, and real-time match tracking capabilities.

## Technology Stack

- **Framework**: React Native 0.73+ with TypeScript
- **Navigation**: React Navigation v6
- **State Management**: Redux Toolkit with Redux Persist
- **UI Components**: React Native Elements + Custom styled components
- **API Client**: Axios with interceptors for auth
- **Testing**: Jest, React Native Testing Library, Detox for E2E
- **CI/CD**: GitHub Actions with automated testing and deployment
- **Platform Support**: iOS 13+ and Android 8+ (API 26+)

## Project Structure

```
esport_center/
├── src/
│   ├── components/        # Reusable UI components
│   ├── screens/           # Screen components (one per route)
│   ├── navigation/        # Navigation configuration
│   ├── services/          # API clients and external services
│   ├── store/            # Redux store, slices, and actions
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Helper functions and utilities
│   ├── types/            # TypeScript type definitions
│   └── constants/        # App constants and configuration
├── ios/                  # iOS native code and configuration
├── android/              # Android native code and configuration
├── __tests__/           # Test files
└── assets/              # Images, fonts, and other static assets
```

## Development Commands

### Setup and Installation
```bash
# Install dependencies
npm install

# iOS specific setup
cd ios && pod install && cd ..

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration
```

### Running the Application
```bash
# Start Metro bundler
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on specific device
npm run ios --device "iPhone 15 Pro"
npm run android --deviceId emulator-5554
```

### Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run e2e:ios
npm run e2e:android

# Run specific test file
npm test -- components/Button.test.tsx
```

### Building and Deployment
```bash
# Build iOS release
npm run build:ios

# Build Android APK
npm run build:android

# Build Android AAB for Play Store
cd android && ./gradlew bundleRelease

# Deploy to TestFlight
npm run deploy:ios:beta

# Deploy to Google Play Internal Testing
npm run deploy:android:beta
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

### Component Structure
```typescript
// src/components/PlayerCard/PlayerCard.tsx
import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Player } from '@/types';

interface PlayerCardProps {
  player: Player;
  onPress?: (player: Player) => void;
}

export const PlayerCard = memo<PlayerCardProps>(({ player, onPress }) => {
  return (
    <View style={styles.container}>
      {/* Component implementation */}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    // Styles
  }
});
```

### Custom Hook Pattern
```typescript
// src/hooks/usePlayer.ts
import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';
import { fetchPlayer } from '@/store/slices/playerSlice';

export const usePlayer = (playerId: string) => {
  const dispatch = useDispatch();
  const player = useSelector(state => state.players.entities[playerId]);
  const loading = useSelector(state => state.players.loading);
  
  useEffect(() => {
    dispatch(fetchPlayer(playerId));
  }, [playerId, dispatch]);
  
  return { player, loading };
};
```

### Service Layer Pattern
```typescript
// src/services/api/playerService.ts
import { apiClient } from '@/services/api/client';
import { Player } from '@/types';

export class PlayerService {
  static async getPlayer(id: string): Promise<Player> {
    const { data } = await apiClient.get(`/players/${id}`);
    return data;
  }
  
  static async updatePlayer(id: string, updates: Partial<Player>): Promise<Player> {
    const { data } = await apiClient.patch(`/players/${id}`, updates);
    return data;
  }
}
```

## Native Module Integration

### iOS Native Module
```objective-c
// ios/ESportCenterModule.m
#import <React/RCTBridgeModule.h>

@interface ESportCenterModule : NSObject <RCTBridgeModule>
@end

@implementation ESportCenterModule
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(processMatch:(NSString *)matchId
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  // Native implementation
}
@end
```

### Android Native Module
```java
// android/src/main/java/com/esportcenter/ESportCenterModule.java
package com.esportcenter;

import com.facebook.react.bridge.*;

public class ESportCenterModule extends ReactContextBaseJavaModule {
  @Override
  public String getName() {
    return "ESportCenterModule";
  }
  
  @ReactMethod
  public void processMatch(String matchId, Promise promise) {
    // Native implementation
  }
}
```

## Testing Patterns

### Component Testing
```typescript
// __tests__/components/PlayerCard.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PlayerCard } from '@/components/PlayerCard';

describe('PlayerCard', () => {
  it('displays player information', () => {
    const player = { id: '1', name: 'John Doe', rank: 'Diamond' };
    const { getByText } = render(<PlayerCard player={player} />);
    
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('Diamond')).toBeTruthy();
  });
});
```

### E2E Testing
```typescript
// e2e/tournament.test.ts
describe('Tournament Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });
  
  it('should create a new tournament', async () => {
    await element(by.id('create-tournament-button')).tap();
    await element(by.id('tournament-name-input')).typeText('Spring Championship');
    await element(by.id('submit-button')).tap();
    
    await expect(element(by.text('Spring Championship'))).toBeVisible();
  });
});
```

## Performance Optimization

### List Optimization
- Use `FlatList` for large lists with `getItemLayout` when possible
- Implement `keyExtractor` for stable keys
- Use `removeClippedSubviews` and `maxToRenderPerBatch`
- Optimize `renderItem` with `memo` and `useCallback`

### Image Optimization
- Use `react-native-fast-image` for image caching
- Implement lazy loading for images
- Use appropriate image formats (WebP for Android, HEIC for iOS)
- Resize images on the server side

### Bundle Optimization
- Enable Hermes for Android
- Use React Native's RAM bundles
- Implement code splitting with dynamic imports
- Remove unused dependencies and dead code

## Security Best Practices

### API Security
- Store API keys in react-native-config or react-native-dotenv
- Implement certificate pinning for production
- Use secure storage (Keychain/Keystore) for sensitive data
- Implement proper JWT token refresh logic

### App Security
- Enable ProGuard/R8 for Android production builds
- Implement jailbreak/root detection
- Use react-native-obfuscating-transformer for code obfuscation
- Disable debugging in production builds

## Platform-Specific Considerations

### iOS Specific
- Handle notch and safe areas with SafeAreaView
- Implement proper keyboard avoidance
- Support Dark Mode with dynamic colors
- Handle iOS 14+ App Tracking Transparency

### Android Specific
- Handle back button with BackHandler
- Implement proper status bar handling
- Support different screen densities
- Handle Android 12+ splash screen API

## Common Issues and Solutions

### Metro Bundler Issues
```bash
# Clear Metro cache
npx react-native start --reset-cache

# Clear all caches
npm run clean:all
```

### Build Issues
```bash
# iOS build issues
cd ios && pod deintegrate && pod install

# Android build issues
cd android && ./gradlew clean
```

### State Management
- Always use Redux Toolkit for slice creation
- Implement proper error handling in async thunks
- Use Redux Persist for offline support
- Normalize state shape for better performance

## Git Workflow

### Branch Naming
- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `hotfix/description` - Production hotfixes
- `refactor/description` - Code refactoring

### Commit Messages
Follow conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions or changes
- `chore:` - Build process or auxiliary tool changes

## Deployment Checklist

### Pre-deployment
- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Bundle size within limits
- [ ] Performance metrics meet targets
- [ ] Security audit passed

### iOS Deployment
- [ ] Increment build number
- [ ] Update version if needed
- [ ] Archive and upload to App Store Connect
- [ ] Submit for TestFlight review
- [ ] Test on multiple devices

### Android Deployment
- [ ] Increment versionCode
- [ ] Update versionName if needed
- [ ] Generate signed AAB
- [ ] Upload to Play Console
- [ ] Submit for internal testing

## Monitoring and Analytics

- Use Sentry for crash reporting
- Implement Firebase Analytics for user behavior
- Use Flipper for development debugging
- Monitor performance with React DevTools
- Track bundle size with react-native-bundle-visualizer

## Additional Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [TypeScript React Native Guide](https://reactnative.dev/docs/typescript)
- [React Navigation Documentation](https://reactnavigation.org/docs/getting-started)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)