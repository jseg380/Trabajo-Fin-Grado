import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Link, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

export default function ProfileScreen() {
  const navigation = useNavigation();

  React.useEffect(() => {
    navigation.setOptions({ title: 'My Profile' });
  }, [navigation]);

  // Mock user data for development
  const mockUser = {
    name: 'Developer User',
    email: 'dev@example.com',
    joinDate: 'Joined January 2025',
    avatar: require('@/assets/images/generic-avatar.png'),
    stats: {
      posts: 24,
      followers: 142,
      following: 87,
    },
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Profile</Text>
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
          source={mockUser.avatar}
          style={styles.avatar}
        />
        <Text style={styles.name}>{mockUser.name}</Text>
        <Text style={styles.email}>{mockUser.email}</Text>
        <Text style={styles.joinDate}>{mockUser.joinDate}</Text>

        {/* Stats Row */}
        <View style={styles.statsContainer}>
          <StatItem
            value={mockUser.stats.posts}
            label='Posts'
          />
          <StatItem
            value={mockUser.stats.followers}
            label='Followers'
          />
          <StatItem
            value={mockUser.stats.following}
            label='Following'
          />
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Placeholder for future content */}
      <View style={styles.contentPlaceholder}>
        <Text style={styles.placeholderText}>Your content will appear here</Text>
      </View>
    </View>
  );
}

// TODO: create component with this
// Reusable stat component
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
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
});
