# Esports Livestream Platform - React Native App

## FEATURE OVERVIEW
Esports-exclusive livestream platform built with React Native and Expo Go. Users can discover and watch live esports streams from content creators in a dedicated, gaming-focused environment.

## CORE REQUIREMENTS

### MVP Features (1-Month Release)
**Authentication Flow**
- Clerk authentication integration
- Simple login/signup flow
- Secure user session management

**Main Stream Discovery**
- Homepage displaying live esports streams
- Stream thumbnails with viewer count
- Creator names and game titles
- Real-time stream status updates

**Navigation Structure**
- Tab-based navigation with 2 main tabs:
  - "Esport" tab: Main stream discovery feed
  - "Profile" tab: User profile and settings

**Stream Viewing**
- Basic video player integration
- Stream chat functionality (mock for MVP)
- Stream metadata display

### Design Requirements
- No emojis in UI
- Clean, minimal typography
- Unique color scheme representing streaming/gaming
- Dark theme optimized for video content
- Professional esports aesthetic

## TECHNICAL SPECIFICATIONS

### Technology Stack
- React Native with Expo Go
- Clerk for authentication
- Expo Router for navigation
- React Query for data management
- Mock data for streams (Phase 1)

### App Structure
```
app/
├── (auth)/
│   ├── login.tsx
│   └── signup.tsx
├── (tabs)/
│   ├── esport.tsx      # Main stream discovery
│   └── profile.tsx     # User profile
├── stream/
│   └── [id].tsx        # Individual stream view
└── _layout.tsx
```

### Authentication Flow
1. App launch → Check Clerk session
2. No session → Login screen
3. Successful auth → Main esport tab
4. Persistent session across app restarts

### Main Features Flow
1. **Login** → Clerk authentication
2. **Stream Discovery** → Browse live esports streams
3. **Stream Viewing** → Watch selected stream
4. **Profile Management** → Basic user settings

## IMPLEMENTATION PHASES

### Phase 1 (MVP - 1 Month)
- Clerk authentication setup
- Basic UI with 2 tabs
- Mock stream data display
- Simple stream player
- Core navigation

### Phase 2 (Future)
- Real streaming integration
- Advanced chat features
- Stream creation tools
- Enhanced discovery algorithms

## EXAMPLES TO REFERENCE
Focus development on mobile-first streaming patterns similar to:
- Twitch mobile app structure
- Gaming-focused UI designs
- Clean authentication flows
- Video player implementations

## MOCKING STRATEGY
For MVP, mock these components:
- Stream data (title, creator, viewer count, thumbnail)
- Chat messages
- User profiles
- Stream metadata

Create realistic mock data that represents actual esports content:
- Popular games (League of Legends, Valorant, CS2)
- Realistic creator names
- Appropriate viewer counts
- Stream categories

## SUCCESS CRITERIA
- User can authenticate with Clerk
- Browse mock streams on main tab
- Navigate between esport and profile tabs
- View individual stream pages
- Maintain session across app restarts
- Clean, professional UI without emojis
- Unique streaming-focused color scheme

## CONSTRAINTS
- No emoji usage anywhere in the app
- Focus on esports content only
- Mobile-first design
- 1-month development timeline
- Use mocked data for initial release