import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link, useLocalSearchParams, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

interface UserStats {
  distanceTraveled: number;
  co2Saved: number;
  totalVehicles: number;
}


interface UserData {
  username: string;
  name: string;
  email: string;
  avatar: any;
  avatarUrl: string;
  joinDate: string;
  stats: UserStats;
}

export default function ProfileScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { user: username } = useLocalSearchParams();

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    navigation.setOptions({ title: t('pages.profile.title') });

    if (username) {
      navigation.setOptions({ title: t('pages.profile.title') });

      // Fetch from Express backend
      fetch(`http://192.168.1.110:5000/api/users/${username}`)
        .then((res) => {
          if (!res.ok) throw new Error(`User not found: ${res.status}`);
          return res.json();
        })
        .then((data: UserData) => {
          console.log('User data loaded:', data);
          setUserData(data);
        })
        .catch((err) => {
          console.warn(err);
          setError('Unable to load user');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [username]);


  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('pages.profile.header-title')}</Text>
        <Link
          href={`/profile/${username}/settings`}
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
        <Text style={styles.name}>{username}</Text>
        <Text style={styles.email}>{userData.email}</Text>
        <Text style={styles.joinDate}>{userData.joinDate}</Text>
      </View>

      {/* Action Buttons */}
      {/* <View style={styles.actions}> */}
      {/*   <TouchableOpacity style={styles.editButton}> */}
      {/*     <Text style={styles.editButtonText}>Edit Profile</Text> */}
      {/*   </TouchableOpacity> */}
      {/* </View> */}

      {/* Stats Row */}
      <View style={styles.statsContainer}>
        <StatItem
          value={userData.stats.distanceTraveled}
          label={t('stats.distanceTraveled')}
        />
        <StatItem
          value={userData.stats.co2Saved}
          label={t('stats.co2Saved')}
        />
        <StatItem
          value={userData.stats.totalVehicles}
          label={t('stats.totalVehicles')}
        />
      </View>
    </View>
  );
}

function StatItem({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
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
    // justifyContent: 'space-around',
    // width: '100%',
    // paddingVertical: 12,
    // borderTopWidth: 1,
    // borderTopColor: '#eee',
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
