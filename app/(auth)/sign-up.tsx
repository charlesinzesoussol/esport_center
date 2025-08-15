import React, { useState } from 'react';
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
import { useSignUp, useOAuth } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';

// Warm up the browser for OAuth
WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);

  const onSignUpPress = async () => {
    if (!isLoaded || loading) return;

    if (!emailAddress.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      await signUp.create({
        emailAddress: emailAddress.trim(),
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: any) {
      console.error('Sign-up error:', err);
      
      let errorMessage = 'An error occurred during sign-up';
      if (err.errors?.[0]?.message) {
        errorMessage = err.errors[0].message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      Alert.alert('Sign-up Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded || verifyLoading) return;

    if (!code.trim()) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }

    setVerifyLoading(true);

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: code.trim(),
      });

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace('/(tabs)/esport');
      } else {
        console.error('Verification incomplete:', signUpAttempt);
        Alert.alert('Error', 'Unable to verify email. Please try again.');
      }
    } catch (err: any) {
      console.error('Verification error:', err);
      
      let errorMessage = 'Invalid verification code';
      if (err.errors?.[0]?.message) {
        errorMessage = err.errors[0].message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      Alert.alert('Verification Failed', errorMessage);
    } finally {
      setVerifyLoading(false);
    }
  };

  const resendCode = async () => {
    if (!isLoaded) return;

    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      Alert.alert('Success', 'Verification code sent!');
    } catch (err: any) {
      console.error('Resend code error:', err);
      Alert.alert('Error', 'Failed to resend verification code');
    }
  };

  const onGoogleSignUp = async () => {
    if (oauthLoading) return;
    
    setOauthLoading(true);
    
    try {
      const { createdSessionId, setActive: oauthSetActive } = await startOAuthFlow();
      
      if (createdSessionId && oauthSetActive) {
        await oauthSetActive({ session: createdSessionId });
        router.replace('/(tabs)/esport');
      }
    } catch (err: any) {
      console.error('Google OAuth error:', err);
      
      if (err.code !== 'oauth_error' && err.code !== 'user_cancelled') {
        Alert.alert('OAuth Error', 'Failed to sign up with Google. Please try again.');
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

  // Verification screen
  if (pendingVerification) {
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
                <Ionicons name="mail-outline" size={64} color="#00ff88" />
                <Text style={styles.title}>Check Your Email</Text>
                <Text style={styles.subtitle}>
                  We sent a verification code to {emailAddress}
                </Text>
              </View>

              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Verification Code</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter 6-digit code"
                    placeholderTextColor="#666"
                    value={code}
                    onChangeText={setCode}
                    keyboardType="number-pad"
                    maxLength={6}
                    autoComplete="one-time-code"
                    textContentType="oneTimeCode"
                  />
                </View>

                <TouchableOpacity
                  style={[styles.button, verifyLoading && styles.buttonDisabled]}
                  onPress={onVerifyPress}
                  disabled={verifyLoading}
                >
                  {verifyLoading ? (
                    <ActivityIndicator color="#000" />
                  ) : (
                    <Text style={styles.buttonText}>Verify Email</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.resendButton} onPress={resendCode}>
                  <Text style={styles.resendText}>Didn't receive the code? Resend</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => setPendingVerification(false)}
              >
                <Text style={styles.backText}>Back to Sign Up</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // Sign-up screen
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
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join the esports community</Text>
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
                  placeholder="Enter your password (min 6 characters)"
                  placeholderTextColor="#666"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoComplete="new-password"
                  textContentType="newPassword"
                />
              </View>

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={onSignUpPress}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <Text style={styles.buttonText}>Sign Up</Text>
                )}
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                style={[styles.googleButton, oauthLoading && styles.buttonDisabled]}
                onPress={onGoogleSignUp}
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
                Already have an account?{' '}
                <Link href="/(auth)/sign-in" asChild>
                  <Text style={styles.link}>Sign in</Text>
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
    textAlign: 'center',
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
  resendButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  resendText: {
    color: '#00ff88',
    fontSize: 14,
    fontWeight: '600',
  },
  backButton: {
    alignItems: 'center',
    marginTop: 'auto',
  },
  backText: {
    color: '#999',
    fontSize: 14,
  },
});

