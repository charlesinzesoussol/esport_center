import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              // Let the root navigation handle the redirect automatically
              // router.replace('/(auth)/sign-in'); - Removed to prevent race conditions
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out');
            }
          },
        },
      ]
    );
  };

  const showClerkProfile = () => {
    const userInfo = {
      'User ID': user?.id,
      'First Name': user?.firstName,
      'Last Name': user?.lastName,
      'Email': user?.emailAddresses[0]?.emailAddress,
      'Email Verified': user?.emailAddresses[0]?.verification?.status === 'verified' ? 'Yes' : 'No',
      'Phone': user?.phoneNumbers[0]?.phoneNumber || 'Not provided',
      'Created': user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown',
      'Last Sign In': user?.lastSignInAt ? new Date(user.lastSignInAt).toLocaleDateString() : 'Unknown',
    };

    const infoText = Object.entries(userInfo)
      .map(([key, value]) => `${key}: ${value || 'Not available'}`)
      .join('\n');

    Alert.alert('Clerk Profile Information', infoText);
  };

  const profileOptions = [
    {
      id: 'clerk-profile',
      title: 'View Clerk Profile',
      icon: 'person-circle-outline',
      onPress: showClerkProfile,
    },
    {
      id: 'account',
      title: 'Account Settings',
      icon: 'person-outline',
      onPress: () => Alert.alert('Coming Soon', 'Account settings will be available soon'),
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: 'notifications-outline',
      onPress: () => Alert.alert('Coming Soon', 'Notification settings will be available soon'),
    },
    {
      id: 'preferences',
      title: 'Preferences',
      icon: 'settings-outline',
      onPress: () => Alert.alert('Coming Soon', 'Preferences will be available soon'),
    },
    {
      id: 'support',
      title: 'Help & Support',
      icon: 'help-circle-outline',
      onPress: () => Alert.alert('Coming Soon', 'Help & support will be available soon'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Clerk Branding Header */}
          <View style={styles.clerkHeader}>
            <View style={styles.clerkLogo}>
              <Text style={styles.clerkLogoText}>clerk</Text>
            </View>
            <Text style={styles.clerkSecured}>🔒 Profile secured by Clerk</Text>
          </View>

          {/* User Info Section */}
          <View style={styles.userSection}>
            <View style={styles.avatarContainer}>
              {user?.imageUrl ? (
                <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
              ) : (
                <Ionicons name="person" size={48} color="#6366f1" />
              )}
            </View>
            <Text style={styles.userName}>
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}` 
                : user?.firstName || user?.fullName || 'User'}
            </Text>
            <Text style={styles.userEmail}>
              {user?.emailAddresses[0]?.emailAddress}
            </Text>
            {user?.emailAddresses[0]?.verification?.status === 'verified' && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            )}
          </View>

          {/* Clerk Profile Info Card */}
          <View style={styles.clerkInfoCard}>
            <Text style={styles.clerkInfoTitle}>Clerk Account Information</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Account ID:</Text>
              <Text style={styles.infoValue}>{user?.id?.slice(0, 20)}...</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Member since:</Text>
              <Text style={styles.infoValue}>
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Last sign in:</Text>
              <Text style={styles.infoValue}>
                {user?.lastSignInAt ? new Date(user.lastSignInAt).toLocaleDateString() : 'Unknown'}
              </Text>
            </View>
          </View>

          {/* Profile Options */}
          <View style={styles.optionsSection}>
            {profileOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.optionItem}
                onPress={option.onPress}
              >
                <View style={styles.optionContent}>
                  <Ionicons name={option.icon as any} size={24} color="#6366f1" />
                  <Text style={styles.optionTitle}>{option.title}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Sign Out Button */}
          <View style={styles.signOutSection}>
            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
              <Ionicons name="log-out-outline" size={20} color="#ef4444" />
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>

          {/* Clerk Footer Branding */}
          <View style={styles.clerkFooter}>
            <Text style={styles.clerkFooterText}>Authentication powered by </Text>
            <Text style={styles.clerkFooterBrand}>Clerk</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  clerkHeader: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 16,
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
  userSection: {
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 8,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 12,
    color: '#15803d',
    fontWeight: '500',
    marginLeft: 4,
  },
  clerkInfoCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  clerkInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '400',
    maxWidth: 180,
    textAlign: 'right',
  },
  optionsSection: {
    marginBottom: 24,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionTitle: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
    fontWeight: '500',
  },
  signOutSection: {
    marginBottom: 24,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  signOutText: {
    fontSize: 16,
    color: '#ef4444',
    fontWeight: '600',
    marginLeft: 8,
  },
  clerkFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    marginTop: 16,
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