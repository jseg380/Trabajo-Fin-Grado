import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Button } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { Link, Stack, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import TitleSetterWebPage from '@/components/TitleSetter';
import { API_URL } from '@/constants/config';
import { withAuth } from '@/utils/withAuth';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import CustomHeaderBackButton from '@/components/CustomHeaderBackButton';

interface UserData {
  username: string;
  name: string;
  email: string;
  avatar: any;
  avatarUrl: string;
  joinDate: string;
}

function ProfileScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { logout, user: authUser } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    navigation.setOptions({ title: t('pages.profile.title') });

    const fetchProfile = async () => {
      if (!authUser) {
        setLoading(false);
        return;
      }
      try {
        // We use axios to automatically handle cookies via withCredentials
        const response = await axios.get(new URL('users/profile', API_URL).href, {
          withCredentials: true,
        });
        setUserData(response.data);
      } catch (err) {
        console.warn(err);
        setError('Unable to load user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authUser]); // Re-fetch if the authUser object changes

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator
          size='large'
          color='#000'
        />
      </View>
    );
  }

  if (error || !userData) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || 'No user data'}</Text>
      </View>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerLeft: () => <CustomHeaderBackButton route='/' />,
        }}
      />
      <TitleSetterWebPage title={t('pages.profile.title')} />

      <View style={styles.header}>
        <Text style={styles.title}>{t('pages.profile.header-title')}</Text>
        <Link
          href='/profile/settings'
          asChild
        >
          <TouchableOpacity>
            <Ionicons
              name='settings-outline'
              size={24}
              color='black'
            />
          </TouchableOpacity>
        </Link>
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <Image
          source={{ uri: userData.avatarUrl }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{userData.name}</Text>
        <Text style={styles.email}>{userData.email}</Text>
        <Text style={styles.joinDate}>{userData.joinDate}</Text>
      </View>

      <Button
        title={t('pages.profile.logout-button')}
        onPress={handleLogout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#e0e0e0',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    color: '#666',
    marginBottom: 4,
  },
  joinDate: {
    color: '#888',
    fontSize: 12,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'column',
    gap: 18,
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  actions: {
    marginBottom: 16,
  },
  editButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  contentPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
  },
  placeholderText: {
    color: '#999',
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default withAuth(ProfileScreen);
