# React Native Expo Go - Esports Center

A comprehensive React Native mobile application built with Expo Go for esports center management. This app provides tournament management, player profiles, team coordination, and real-time match tracking capabilities.

> **Built with React Native + Expo Go for rapid development and hot reloading.**

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/charlesinzesoussol/esport_center.git
cd esport_center

# 2. Install dependencies
npm install

# 3. Start the Expo development server
npx expo start

# 4. Open the Expo Go app on your device and scan the QR code
# Or press 'i' for iOS simulator, 'a' for Android emulator
```

## 📚 Table of Contents

- [What is this App?](#what-is-this-app)
- [Project Structure](#project-structure)
- [Development Setup](#development-setup)
- [Available Scripts](#available-scripts)
- [Building for Production](#building-for-production)
- [Testing](#testing)
- [Best Practices](#best-practices)

## What is this App?

The Esports Center app is a complete mobile solution for managing esports tournaments and player communities:

### Core Features

**Tournament Management:**
- Create and manage tournaments
- Real-time bracket updates
- Live match scoring and tracking

**Player Profiles:**
- Player statistics and rankings
- Achievement tracking
- Match history

**Team Coordination:**
- Team creation and management
- Communication tools
- Strategy planning

## Project Structure

```
esport_center/
├── app/                    # Expo Router app directory
│   ├── (tabs)/            # Tab-based navigation screens
│   ├── tournament/        # Tournament-related screens
│   ├── player/           # Player profile screens
│   └── _layout.tsx       # Root layout configuration
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI components
│   ├── forms/           # Form components
│   └── tournament/      # Tournament-specific components
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── constants/           # App constants and configuration
├── assets/              # Images, fonts, and other static assets
└── types/               # TypeScript type definitions
```

## Development Setup

### Prerequisites

- **Node.js** 18+ and npm
- **Expo CLI**: `npm install -g @expo/cli`
- **Expo Go app** on your mobile device
- **iOS Simulator** (macOS) or **Android Studio** (for emulators)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Development commands
npx expo start --ios          # iOS simulator
npx expo start --android      # Android emulator
npx expo start --web          # Web browser
npx expo start --tunnel       # Tunnel for external access
```

## Available Scripts

### Development
```bash
npm start              # Start Expo development server
npm run ios           # Run on iOS simulator
npm run android       # Run on Android emulator
npm run web           # Run in web browser
```

### Testing
```bash
npm test              # Run Jest tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate coverage report
npm run test:e2e      # Run end-to-end tests with Detox
```

### Code Quality
```bash
npm run lint          # Run ESLint
npm run lint:fix      # Fix ESLint issues
npm run type-check    # TypeScript type checking
npm run format        # Format code with Prettier
```

### Building
```bash
npm run build         # Create production build
npm run build:ios     # Build for iOS
npm run build:android # Build for Android
npm run preview       # Preview production build
```

## Building for Production

### Expo Application Services (EAS)

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for both platforms
eas build --platform all

# Build for specific platform
eas build --platform ios
eas build --platform android

# Submit to app stores
eas submit --platform ios
eas submit --platform android
```

### Local Development Build

```bash
# Create development build
npx expo run:ios
npx expo run:android

# Create production build locally
npx expo export
```

## Testing

### Unit Testing with Jest

```typescript
// components/__tests__/PlayerCard.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import { PlayerCard } from '../PlayerCard';

describe('PlayerCard', () => {
  it('displays player information correctly', () => {
    const player = { id: '1', name: 'ProGamer', rank: 'Diamond' };
    const { getByText } = render(<PlayerCard player={player} />);
    
    expect(getByText('ProGamer')).toBeTruthy();
    expect(getByText('Diamond')).toBeTruthy();
  });
});
```

### E2E Testing with Detox

```typescript
// e2e/tournament.test.ts
describe('Tournament Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should create a new tournament', async () => {
    await element(by.id('create-tournament-btn')).tap();
    await element(by.id('tournament-name')).typeText('Spring Championship');
    await element(by.id('submit-btn')).tap();
    
    await expect(element(by.text('Spring Championship'))).toBeVisible();
  });
});
```

## Technology Stack

- **Framework**: React Native with Expo Go
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Zustand / React Query
- **UI Components**: Expo UI + Custom components
- **Styling**: Nativewind (Tailwind for React Native)
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Real-time**: Firebase Realtime Database
- **Testing**: Jest + React Native Testing Library + Detox
- **Build**: Expo Application Services (EAS)

## Best Practices

### Component Development
- Use TypeScript for all components
- Implement proper error boundaries
- Follow React Native performance patterns
- Use memo() for expensive components

### State Management
- Use React Query for server state
- Zustand for client state
- Implement proper loading and error states
- Cache data appropriately

### Styling
- Use Nativewind for consistent styling
- Implement responsive design patterns
- Support dark mode
- Follow platform-specific design guidelines

### Performance
- Optimize FlatList usage
- Implement lazy loading
- Use React.memo strategically
- Monitor bundle size

## Environment Configuration

```bash
# .env.example
EXPO_PUBLIC_API_URL=https://api.esportscenter.com
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

## Deployment

### Development
- Use Expo Go for rapid development
- Hot reloading for instant feedback
- Over-the-air updates for quick iterations

### Production
- EAS Build for app store deployment
- OTA updates for non-native changes
- Staged rollouts for safe deployments

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router Documentation](https://expo.github.io/router/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.