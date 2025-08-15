import * as React from 'react';
import { Text, TextInput, TouchableOpacity, View, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useSignUp, useOAuth } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const router = useRouter();

  // Debug OAuth hook initialization
  React.useEffect(() => {
    console.log('SignUp screen mounted');
    console.log('OAuth hook status:', {
      hasStartOAuthFlow: !!startOAuthFlow,
      isSignUpLoaded: isLoaded
    });
  }, [startOAuthFlow, isLoaded]);

  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState('');
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);

  // Handle Google OAuth
  const onGoogleSignUp = React.useCallback(async () => {
    console.log('Google OAuth button pressed - starting sign-up flow');
    
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
        console.log('Google OAuth sign-up successful, setting active session');
        await setActive({ session: createdSessionId });
        
        // Navigate after a brief delay to ensure auth state is updated
        setTimeout(() => {
          console.log('Redirecting to esport tab after Google OAuth sign-up');
          router.replace('/(tabs)/esport');
        }, 100);
      } else {
        console.error('OAuth flow incomplete:', { createdSessionId, setActive });
        Alert.alert('Error', 'OAuth sign-up was incomplete. Please try again.');
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
      const errorMessage = err?.errors?.[0]?.message || err?.message || 'Failed to sign up with Google';
      Alert.alert('Google Sign-Up Error', `${errorMessage}\n\nPlease check that Google OAuth is enabled in your Clerk dashboard.`);
    } finally {
      setIsGoogleLoading(false);
    }
  }, [startOAuthFlow, router]);

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
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
    if (!firstName.trim()) {
      Alert.alert('Error', 'First name is required');
      return;
    }
    if (!lastName.trim()) {
      Alert.alert('Error', 'Last name is required');
      return;
    }

    try {
      await signUp.create({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        emailAddress: emailAddress.trim().toLowerCase(),
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: any) {
      console.error('Sign-up error:', JSON.stringify(err, null, 2));
      const errorMessage = err.errors?.[0]?.message || err.message || 'Failed to sign up';
      Alert.alert('Sign-up Error', errorMessage);
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === 'complete') {
        console.log('Email verification successful, setting active session');
        await setActive({ session: signUpAttempt.createdSessionId });
        
        // Navigate after a brief delay to ensure auth state is updated
        setTimeout(() => {
          console.log('Redirecting to esport tab after email verification');
          router.replace('/(tabs)/esport');
        }, 100);
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
        Alert.alert('Error', 'Email verification incomplete. Please try again.');
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert('Error', err.errors?.[0]?.message || 'Failed to verify email');
    }
  };

  if (pendingVerification) {
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
            <Text style={styles.title}>Verify your email</Text>
            <Text style={styles.subtitle}>Enter the code sent to your email</Text>
          </View>
          
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Verification code</Text>
              <TextInput
                style={styles.input}
                value={code}
                placeholder="Enter your verification code"
                placeholderTextColor="#94a3b8"
                onChangeText={setCode}
              />
            </View>
            <TouchableOpacity style={styles.continueButton} onPress={onVerifyPress}>
              <Text style={styles.continueButtonText}>Verify Email</Text>
            </TouchableOpacity>
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
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>to continue to Esports Center</Text>
        </View>
        
        <View style={styles.form}>
          {/* Google OAuth Button */}
          <TouchableOpacity 
            style={[styles.googleButton, isGoogleLoading && styles.googleButtonLoading]} 
            onPress={onGoogleSignUp}
            disabled={isGoogleLoading}
          >
            <Ionicons name="logo-google" size={20} color="#4285F4" />
            <Text style={styles.googleButtonText}>
              {isGoogleLoading ? 'Signing up...' : 'Continue with Google'}
            </Text>
          </TouchableOpacity>
          
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Name Fields */}
          <View style={styles.nameRow}>
            <View style={[styles.inputContainer, styles.nameInput]}>
              <Text style={styles.inputLabel}>First name</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                placeholder="Enter your first name"
                placeholderTextColor="#94a3b8"
                onChangeText={setFirstName}
              />
            </View>
            <View style={[styles.inputContainer, styles.nameInput]}>
              <Text style={styles.inputLabel}>Last name</Text>
              <TextInput
                style={styles.input}
                value={lastName}
                placeholder="Enter your last name"
                placeholderTextColor="#94a3b8"
                onChangeText={setLastName}
              />
            </View>
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
          
          <TouchableOpacity style={styles.continueButton} onPress={onSignUpPress}>
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="/(auth)/sign-in">
            <Text style={styles.link}>Sign in</Text>
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
  nameRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 0,
  },
  nameInput: {
    flex: 1,
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