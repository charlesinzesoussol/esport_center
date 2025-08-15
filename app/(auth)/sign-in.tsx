import { useSignIn, useOAuth } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { Text, TextInput, TouchableOpacity, View, StyleSheet, SafeAreaView, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const router = useRouter();

  // Debug OAuth hook initialization
  React.useEffect(() => {
    console.log('SignIn screen mounted');
    console.log('OAuth hook status:', {
      hasStartOAuthFlow: !!startOAuthFlow,
      isSignInLoaded: isLoaded
    });
  }, [startOAuthFlow, isLoaded]);

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);

  // Handle Google OAuth
  const onGoogleSignIn = React.useCallback(async () => {
    console.log('🔥 GOOGLE BUTTON CLICKED! 🔥');
    Alert.alert('Button Test', 'Google button is working! Starting OAuth...');
    
    setIsGoogleLoading(true);
    
    try {
      // Check if startOAuthFlow is available
      if (!startOAuthFlow) {
        console.error('startOAuthFlow is not available');
        Alert.alert('Configuration Error', 'Google OAuth is not properly configured');
        return;
      }

      console.log('Dismissing any existing browser sessions');
      await WebBrowser.dismissBrowser();
      
      console.log('Starting OAuth flow...');
      const { createdSessionId, setActive } = await startOAuthFlow();
      
      console.log('OAuth flow completed:', { 
        hasSessionId: !!createdSessionId, 
        hasSetActive: !!setActive 
      });
      
      if (createdSessionId && setActive) {
        console.log('Google OAuth successful, setting active session');
        await setActive({ session: createdSessionId });
        
        // Navigate after a brief delay to ensure auth state is updated
        setTimeout(() => {
          console.log('Redirecting to esport tab after Google OAuth');
          router.replace('/(tabs)/esport');
        }, 100);
      } else {
        console.error('OAuth flow incomplete:', { createdSessionId, setActive });
        Alert.alert('Error', 'OAuth sign-in was incomplete. Please try again.');
      }
    } catch (err: any) {
      console.error('OAuth error details:', {
        message: err?.message,
        code: err?.code,
        errors: err?.errors,
        fullError: err
      });
      
      // Cleanup browser session on error
      try {
        await WebBrowser.dismissBrowser();
      } catch (cleanupErr) {
        console.error('Browser cleanup error:', cleanupErr);
      }
      
      // More detailed error message
      const errorMessage = err?.errors?.[0]?.message || err?.message || 'Failed to sign in with Google';
      Alert.alert('Google Sign-In Error', `${errorMessage}\n\nPlease check that Google OAuth is enabled in your Clerk dashboard.`);
    } finally {
      setIsGoogleLoading(false);
    }
  }, [startOAuthFlow, router]);

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return;

    // Validate required fields
    if (!emailAddress.trim()) {
      Alert.alert('Error', 'Email address is required');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Error', 'Password is required');
      return;
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress.trim().toLowerCase(),
        password,
      });

      if (signInAttempt.status === 'complete') {
        console.log('Email/password sign-in successful, setting active session');
        await setActive({ session: signInAttempt.createdSessionId });
        
        // Navigate after a brief delay to ensure auth state is updated
        setTimeout(() => {
          console.log('Redirecting to esport tab after email/password sign-in');
          router.replace('/(tabs)/esport');
        }, 100);
      } else {
        console.error('Sign-in incomplete:', JSON.stringify(signInAttempt, null, 2));
        Alert.alert('Error', 'Sign in incomplete. Please try again.');
      }
    } catch (err: any) {
      console.error('Sign-in error:', JSON.stringify(err, null, 2));
      const errorMessage = err.errors?.[0]?.message || err.message || 'Failed to sign in';
      Alert.alert('Sign-in Error', errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Clerk Branding Header */}
        <View style={styles.clerkHeader}>
          <View style={styles.clerkLogo}>
            <Text style={styles.clerkLogoText}>clerk</Text>
          </View>
          <Text style={styles.clerkSecured}>🔒 Secured by Clerk</Text>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Sign in</Text>
          <Text style={styles.subtitle}>to continue to Esports Center</Text>
        </View>
        
        <View style={styles.form}>
          {/* Google OAuth Button */}
          <TouchableOpacity 
            style={[styles.googleButton, isGoogleLoading && styles.googleButtonLoading]} 
            onPress={onGoogleSignIn}
            disabled={isGoogleLoading}
          >
            <Ionicons name="logo-google" size={20} color="#4285F4" />
            <Text style={styles.googleButtonText}>
              {isGoogleLoading ? 'Signing in...' : 'Continue with Google'}
            </Text>
          </TouchableOpacity>
          
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Email/Password Form */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email address</Text>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Enter your email address"
              placeholderTextColor="#94a3b8"
              keyboardType="email-address"
              onChangeText={setEmailAddress}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              placeholder="Enter your password"
              placeholderTextColor="#94a3b8"
              secureTextEntry={true}
              onChangeText={setPassword}
            />
          </View>
          
          <TouchableOpacity style={styles.continueButton} onPress={onSignInPress}>
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Link href="/(auth)/sign-up">
            <Text style={styles.link}>Sign up</Text>
          </Link>
        </View>

        {/* Clerk Footer Branding */}
        <View style={styles.clerkFooter}>
          <Text style={styles.clerkFooterText}>Secured by </Text>
          <Text style={styles.clerkFooterBrand}>Clerk</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 24,
  },
  clerkHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  clerkLogo: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 8,
  },
  clerkLogoText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  clerkSecured: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '500',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  form: {
    marginBottom: 24,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  googleButtonLoading: {
    opacity: 0.6,
    backgroundColor: '#f8f9fa',
  },
  googleButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    color: '#94a3b8',
    marginHorizontal: 16,
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  continueButton: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  continueButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  footerText: {
    fontSize: 14,
    color: '#64748b',
  },
  link: {
    color: '#6366f1',
    fontWeight: '500',
  },
  clerkFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  clerkFooterText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  clerkFooterBrand: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '600',
  },
});