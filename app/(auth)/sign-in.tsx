import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useSignIn, useOAuth, useAuth } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';

// Warm up the browser for OAuth
WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { isSignedIn } = useAuth();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);

  const onSignInPress = async () => {
    if (!isLoaded || loading) return;

    if (!emailAddress.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress.trim(),
        password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        // Wait for auth state to propagate before navigating
        setTimeout(() => {
          navigateToApp();
        }, 200);
      } else {
        // Handle additional verification steps if needed
        console.error('Sign-in incomplete:', signInAttempt);
        Alert.alert('Error', 'Unable to complete sign-in. Please try again.');
      }
    } catch (err: any) {
      console.error('Sign-in error:', err);
      
      // Handle specific Clerk errors
      let errorMessage = 'An error occurred during sign-in';
      if (err.errors?.[0]?.message) {
        errorMessage = err.errors[0].message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      Alert.alert('Sign-in Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced navigation function with auth state monitoring
  const navigateToApp = useCallback(async () => {
    console.log('🏠 Attempting navigation to main app...');
    
    // Use a more reliable approach with multiple checks
    let attempts = 0;
    const maxAttempts = 10;
    const checkInterval = 200;
    
    const checkAuthAndNavigate = () => {
      attempts++;
      console.log(`🔍 Navigation attempt ${attempts}/${maxAttempts}`);
      
      if (isSignedIn) {
        console.log('✅ Auth state confirmed, navigating to app');
        router.replace('/(tabs)/esport');
        return true;
      }
      
      if (attempts < maxAttempts) {
        setTimeout(checkAuthAndNavigate, checkInterval);
      } else {
        console.error('❌ Navigation timeout - auth state not confirmed');
        Alert.alert(
          'Navigation Error',
          'Authentication was successful but navigation failed. Please restart the app.',
          [{ text: 'OK', onPress: () => router.replace('/') }]
        );
      }
      
      return false;
    };
    
    checkAuthAndNavigate();
  }, [isSignedIn, router]);

  const onGoogleSignIn = async () => {
    if (oauthLoading) return;
    
    setOauthLoading(true);
    console.log('🚀 Starting Google OAuth flow...');
    
    try {
      const { createdSessionId, setActive: oauthSetActive, signIn: signInResult, signUp: signUpResult } = await startOAuthFlow();
      
      console.log('🔐 OAuth flow result:', { 
        createdSessionId: !!createdSessionId, 
        setActive: !!oauthSetActive,
        signIn: !!signInResult,
        signUp: !!signUpResult,
        currentAuthState: isSignedIn
      });
      
      if (createdSessionId) {
        console.log('✅ Session created, activating...');
        
        try {
          // Use the returned setActive function OR fallback to the hook's setActive
          const activateSession = oauthSetActive || setActive;
          
          if (!activateSession) {
            throw new Error('No setActive function available');
          }
          
          // Activate the session with proper error handling
          await activateSession({ session: createdSessionId });
          console.log('✅ Session activated successfully');
          
          // Wait a bit for auth state to propagate, then navigate
          setTimeout(() => {
            navigateToApp();
          }, 300);
          
        } catch (activationError: any) {
          console.error('❌ Session activation error:', activationError);
          throw new Error(`Session activation failed: ${activationError.message}`);
        }
      } else {
        console.error('❌ No session created from OAuth flow');
        throw new Error('Google sign-in was incomplete - no session created');
      }
    } catch (err: any) {
      console.error('❌ Google OAuth error:', err);
      
      // Don't show alert for user cancellation
      if (err.code !== 'oauth_error' && err.code !== 'user_cancelled' && err.message !== 'User cancelled') {
        let errorMessage = 'Failed to sign in with Google. Please try again.';
        
        // Handle specific OAuth errors
        if (err.code === 'oauth_callback_error') {
          errorMessage = 'OAuth callback failed. Please check your internet connection and try again.';
        } else if (err.message?.includes('Session activation failed')) {
          errorMessage = 'Sign-in was successful but session activation failed. Please restart the app.';
        } else if (err.message?.includes('no session created')) {
          errorMessage = 'Google sign-in was incomplete. Please try again.';
        }
        
        Alert.alert('OAuth Error', errorMessage);
      }
    } finally {
      setOauthLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator testID="loading-indicator" size="large" color="#00ff88" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to your account</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#666"
                  value={emailAddress}
                  onChangeText={setEmailAddress}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  textContentType="emailAddress"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#666"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoComplete="password"
                  textContentType="password"
                />
              </View>

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={onSignInPress}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <Text style={styles.buttonText}>Sign In</Text>
                )}
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                style={[styles.googleButton, oauthLoading && styles.buttonDisabled]}
                onPress={onGoogleSignIn}
                disabled={oauthLoading}
              >
                {oauthLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="logo-google" size={20} color="#fff" />
                    <Text style={styles.googleButtonText}>Continue with Google</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Don't have an account?{' '}
                <Link href="/(auth)/sign-up" asChild>
                  <Text style={styles.link}>Sign up</Text>
                </Link>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
  },
  form: {
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#333',
  },
  button: {
    backgroundColor: '#00ff88',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#333',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#666',
    fontSize: 14,
  },
  googleButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    marginTop: 'auto',
  },
  footerText: {
    fontSize: 14,
    color: '#999',
  },
  link: {
    color: '#00ff88',
    fontWeight: '600',
  },
});

