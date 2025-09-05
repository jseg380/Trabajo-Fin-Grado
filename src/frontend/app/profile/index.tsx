import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Button, FlatList } from 'react-native';
import { ActivityIndicator, TextInput } from 'react-native-paper';
import { Link, Stack, useFocusEffect, useNavigation } from 'expo-router';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import TitleSetterWebPage from '@/components/TitleSetter';
import { API_URL } from '@/constants/config';
import { withAuth } from '@/utils/withAuth';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import CustomHeaderBackButton from '@/components/CustomHeaderBackButton';
import { showConfirmationAlert, showInfoAlert } from '@/utils/CrossPlatformAlert';

interface HouseholdMember {
  _id: string;
  name: string;
}
interface Household {
  _id: string;
  name: string;
  joinCode: string;
  members: HouseholdMember[];
}

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
  const [household, setHousehold] = useState<Household | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState(false); // For join/leave buttons
  const [error, setError] = useState<string | null>(null);
  const [joinCodeInput, setJoinCodeInput] = useState('');

  const fetchHousehold = useCallback(async () => {
    try {
      const response = await axios.get(new URL('households/my-household', API_URL).href, { withCredentials: true });
      setHousehold(response.data);
    } catch (err) {
      console.error('Failed to fetch household', err);
    }
  }, []); // Empty dependency array as this function doesn't depend on props or state

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        // We can combine fetches to reduce loading states
        await Promise.all([fetchProfile(), fetchHousehold()]);
        setLoading(false);
      };
      fetchData();
    }, [fetchHousehold]) // Now fetchHousehold is stable
  );

  const fetchProfile = async () => {
    if (!authUser) return;
    try {
      const response = await axios.get(new URL('users/profile', API_URL).href, { withCredentials: true });
      setUserData(response.data);
    } catch (err) {
      console.warn(err);
    }
  };

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
        <Text style={styles.errorText}>{error || t('pages.profile.no-user-data')}</Text>
      </View>
    );
  }

  const handleJoinHousehold = async () => {
    if (!joinCodeInput.trim()) {
      showInfoAlert('Input Required', 'Please enter a household join code.');
      return;
    }
    setActionLoading(true);
    try {
      const response = await axios.post(new URL('households/join', API_URL).href, 
        { joinCode: joinCodeInput.trim() }, 
        { withCredentials: true }
      );
      setHousehold(response.data); // Update state with new household
      setJoinCodeInput(''); // Clear input
      showInfoAlert('Success', 'You have joined the new household!');
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to join household.';
      showInfoAlert('Error', errorMsg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeaveHousehold = async () => {
    const confirmed = await showConfirmationAlert(
      'Leave Household',
      'Are you sure you want to leave? A new personal household will be created for you.',
      'Leave'
    );
    if (!confirmed) return;

    setActionLoading(true);
    try {
      const response = await axios.post(new URL('households/leave', API_URL).href, {}, { withCredentials: true });
      setHousehold(response.data); // Update state with the newly created household
      showInfoAlert('Success', 'You have left the household.');
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to leave household.';
      showInfoAlert('Error', errorMsg);
    } finally {
      setActionLoading(false);
    }
  };

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
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <FontAwesome5
                name='user-alt'
                size={20}
                color='black'
                style={{ marginRight: 20 }}
              />
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{t('pages.profile.title')}</Text>
            </View>
          ),
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
        <Text style={styles.joinDate}>
          {t('pages.profile.member-since')}: {new Date(userData.joinDate).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.householdCard}>
        <Text style={styles.title}>My Household</Text>
        {household && (
          <>
            <Text style={styles.householdName}>{household.name}</Text>
            <Text style={styles.joinCode}>Invite Code: {household.joinCode}</Text>
            <Text style={styles.membersHeader}>Members:</Text>
            <FlatList
              data={household.members}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => <Text style={styles.memberName}>- {item.name}</Text>}
            />
          </>
        )}
      </View>

      <View style={styles.actionsCard}>
        <Text style={styles.title}>Household Actions</Text>
        <TextInput
          style={styles.input}
          placeholder='Enter Join Code'
          value={joinCodeInput}
          onChangeText={setJoinCodeInput}
        />
        <Button
          title='Join a Household'
          onPress={handleJoinHousehold}
        />
        <View style={{ marginTop: 10 }} />
        <Button
          title='Leave & Create New Household'
          onPress={handleLeaveHousehold}
          color='#f44336'
        />
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
  householdCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    marginBottom: 16,
  },
  householdName: {
    fontSize: 18,
    fontWeight: '600',
  },
  joinCode: {
    fontSize: 14,
    color: '#2196F3',
    fontStyle: 'italic',
    marginVertical: 8,
  },
  membersHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  memberName: {
    fontSize: 14,
    marginLeft: 8,
  },
  actionsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    elevation: 3,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
});

export default withAuth(ProfileScreen);
