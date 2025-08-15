# Google OAuth Testing Guide

This guide provides comprehensive instructions for testing the Google OAuth authentication fixes implemented in the Expo React Native app.

## Overview of Fixes Implemented

### 1. Enhanced Session Activation
- **Robust Error Handling**: Added comprehensive try-catch blocks around session activation
- **Better Token Validation**: Enhanced tokenCache with JWT parsing and expiry checking
- **Multiple setActive Sources**: Use OAuth-returned setActive function or fallback to hook

### 2. Improved Navigation Timing
- **Auth State Monitoring**: Implemented retry mechanism that waits for `isSignedIn` to become true
- **Configurable Timeouts**: 10 attempts with 200ms intervals (2 seconds total)
- **Graceful Fallbacks**: Shows user-friendly error messages when navigation fails

### 3. Enhanced Debug Logging
- **OAuth Flow Tracking**: Detailed console logs for each step of OAuth process
- **Token Cache Monitoring**: Enhanced logging with JWT validation and timing
- **Auth State Changes**: Real-time monitoring of authentication state transitions

### 4. Configuration Updates
- **OAuth Redirects**: Updated app.json with proper redirect URLs for both native and web
- **Environment Variables**: Added extra configuration for Clerk integration
- **Platform Support**: Separate handling for native vs web platforms

## Testing Instructions

### Prerequisites

1. **Environment Setup**
   ```bash
   # Ensure environment variables are set
   echo $EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY
   
   # Should return your Clerk publishable key
   ```

2. **Google OAuth Configuration in Clerk**
   - Verify Google OAuth is enabled in Clerk Dashboard
   - Check redirect URLs match app.json configuration:
     - Native: `esports-center://oauth`
     - Web: `http://localhost:8081/oauth`

### Manual Testing Steps

#### 1. Clean Start Testing
```bash
# Clear app data and restart
npx expo start --clear

# On iOS Simulator: Device > Erase All Content and Settings
# On Android Emulator: Extended Controls > Settings > Wipe Data
```

#### 2. OAuth Flow Testing

**Test Case 1: Successful OAuth Flow**
1. Open app on device/simulator
2. Navigate to Sign In screen
3. Tap "Continue with Google"
4. Complete Google authentication in browser
5. **Expected Result**: 
   - App returns to foreground
   - User sees esport tab immediately
   - Console shows successful token storage and activation

**Test Case 2: User Cancellation**
1. Start OAuth flow
2. Cancel/close the browser during Google auth
3. **Expected Result**: 
   - No error alert shown
   - User remains on sign-in screen
   - Console shows cancellation log

**Test Case 3: Network Issues**
1. Disable internet during OAuth flow
2. Attempt Google sign-in
3. **Expected Result**: 
   - Specific network error message
   - User can retry after connection restored

#### 3. Edge Case Testing

**Test Case 4: Session Activation Failure**
1. Use a Clerk environment with restricted permissions
2. Attempt OAuth sign-in
3. **Expected Result**: 
   - Specific session activation error message
   - User prompted to restart app

**Test Case 5: Token Expiry**
1. Complete successful OAuth
2. Wait for token to expire (or manually delete from Secure Store)
3. Restart app
4. **Expected Result**: 
   - User redirected to sign-in
   - Old tokens cleaned up automatically

### Automated Testing

#### Running Tests
```bash
# Run OAuth integration tests
npm test -- __tests__/auth/oauth.integration.test.tsx

# Run all auth tests
npm test -- __tests__/auth/

# Run with coverage
npm run test:coverage
```

#### Test Coverage Areas
- ✅ Successful OAuth completion and navigation
- ✅ Session activation with proper error handling
- ✅ User cancellation scenarios
- ✅ Network failure handling
- ✅ Navigation timing and retry logic
- ✅ Loading states and button disabling
- ✅ Auth state monitoring and timeouts

### Debug Console Output

#### Expected Successful Flow
```
🚀 Starting Google OAuth flow...
🔐 OAuth flow result: { createdSessionId: true, setActive: true, signIn: true, signUp: false, currentAuthState: false }
✅ Session created, activating...
✅ Session activated successfully
🏠 Attempting navigation to main app...
🔍 Navigation attempt 1/10
🔍 Navigation attempt 2/10
✅ Auth state confirmed, navigating to app
```

#### Expected Error Flow
```
🚀 Starting Google OAuth flow...
❌ Google OAuth error: Error: Session activation failed
OAuth Error: Sign-in was successful but session activation failed. Please restart the app.
```

#### Token Cache Logs
```
✅ Token saved: __clerk_client_jwt (length: 1247, took: 15ms)
🔐 OAuth/Session token saved - this should enable authentication
✅ Token verification successful: __clerk_client_jwt
🔐 Token retrieved: __clerk_client_jwt (length: 1247, took: 8ms)
🕰️ Token expiry: 2024-12-15T10:30:00.000Z
🕰️ Current time: 2024-12-15T09:45:00.000Z
✅ Token valid: true
```

### Troubleshooting Common Issues

#### Issue 1: OAuth Completes but No Navigation
**Symptoms**: 
- Google auth succeeds
- Token is stored
- User stays on sign-in screen

**Solution**:
1. Check console for navigation timeout errors
2. Verify `isSignedIn` state in auth hooks
3. Restart app to refresh auth state

**Debug Steps**:
```javascript
// Check auth state manually
console.log('Auth State:', {
  isSignedIn: useAuth().isSignedIn,
  isLoaded: useAuth().isLoaded,
  userId: useAuth().userId,
  sessionId: useAuth().sessionId
});
```

#### Issue 2: Session Activation Fails
**Symptoms**:
- OAuth flow completes
- Session activation error shown

**Solution**:
1. Check Clerk dashboard for session limits
2. Verify environment variables
3. Clear app data and retry

#### Issue 3: Token Storage Issues
**Symptoms**:
- Authentication succeeds but doesn't persist
- User signed out on app restart

**Solution**:
1. Check device storage permissions
2. Verify SecureStore functionality
3. Check for iOS Keychain/Android Keystore issues

**Debug Steps**:
```bash
# Test SecureStore directly
expo install expo-secure-store
# Then test in app with tokenCache logs
```

#### Issue 4: Redirect URL Mismatch
**Symptoms**:
- OAuth flow starts but never returns to app
- Browser shows "redirect_uri_mismatch" error

**Solution**:
1. Verify app.json scheme and authSessionRedirectUrl
2. Check Clerk OAuth settings match exactly
3. Ensure proper URL encoding

### Performance Monitoring

#### Key Metrics to Track
- **OAuth Completion Time**: Should be < 10 seconds
- **Session Activation Time**: Should be < 2 seconds  
- **Navigation Response Time**: Should be < 3 seconds
- **Token Storage Time**: Should be < 100ms

#### Performance Logs
```
OAuth flow completed in 3.2s
Session activation took 0.8s
Navigation completed after 2 attempts (0.4s)
Token storage took 24ms
```

### Production Considerations

#### Before Deployment
1. **Test on Physical Devices**: OAuth behaves differently on real devices
2. **Test Different Networks**: WiFi, cellular, poor connections
3. **Test Background/Foreground**: App switching during OAuth
4. **Test Memory Pressure**: Low memory conditions
5. **Test Different Google Accounts**: New users, existing users, enterprise accounts

#### Monitoring in Production
1. **Error Tracking**: Monitor OAuth-related crashes
2. **Analytics**: Track OAuth success/failure rates
3. **Performance**: Monitor OAuth completion times
4. **User Experience**: Track drop-off rates during authentication

### Security Checklist

- ✅ Tokens stored in secure storage (Keychain/Keystore)
- ✅ No sensitive data logged in production
- ✅ Proper token expiry handling
- ✅ Session cleanup on sign-out
- ✅ HTTPS-only communication
- ✅ Proper error handling without data leaks

## Summary

The implemented OAuth fixes address the core issues of:
1. **Session Activation**: Robust error handling and multiple fallback mechanisms
2. **Navigation Timing**: Auth state monitoring with configurable timeouts
3. **Debug Visibility**: Comprehensive logging for troubleshooting
4. **Platform Support**: Proper configuration for both native and web platforms

The enhanced implementation ensures a smooth OAuth experience with proper error handling and user feedback, making the authentication process reliable and user-friendly.