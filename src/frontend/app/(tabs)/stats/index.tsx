import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, useWindowDimensions, StyleProp, ViewStyle } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '@/constants/config';
import { withAuth } from '@/utils/withAuth';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from 'expo-router';

// A map of all possible achievements
const ALL_ACHIEVEMENTS = {
  'FIRST_VEHICLE': { icon: 'car-sport', key: 'achievements.FIRST_VEHICLE' },
  'FIRST_TRIP': { icon: 'navigate', key: 'achievements.FIRST_TRIP' },
  'DIST_1000': { icon: 'trophy', key: 'achievements.DIST_1000' },
  'DIST_10000': { icon: 'earth', key: 'achievements.DIST_10000' },
};

interface StatsData {
  totalDistance: number;
  totalEmissions: number;
  tripCount: number;
  vehicleCount: number;
  averageEmissions: number;
};

interface UserProfile {
  achievements: string[]
};

function StatCard({
    icon,
    value,
    label,
    unit,
    fontAwesomeIcon = false,
    extraStyles
  }: {
    icon: any;
    value: string;
    label: string;
    unit: string;
    fontAwesomeIcon?: boolean;
    extraStyles?: StyleProp<ViewStyle>;
  }) {
  return (
    <View style={[styles.statCard, extraStyles]}>
      {fontAwesomeIcon
        ? <FontAwesome name={icon} size={32} color='#2196F3' />
        : <Ionicons name={icon} size={32} color='#2196F3' />}
      
      <Text style={styles.statValue}>{value} <Text style={styles.statUnit}>{unit}</Text></Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Achievement({ icon, title, unlocked }: { icon: any; title: string; unlocked: boolean; }) {
  return (
    <View style={styles.achieveCard}>
      <View style={!unlocked ? styles.achieveLocked : undefined}>
        <Ionicons name={icon} size={40} color={unlocked ? '#FFC107' : '#ccc'} />
        <Text style={styles.achieveTitle}>{title}</Text>
      </View>

      {unlocked ? (
          <Ionicons name='checkmark-circle' size={35} color='#4CAF50' style={{ marginLeft: 'auto' }} />
        ) : (
          <View style={styles.lockOverlay}>
            <Ionicons name='lock-closed' size={40} />
          </View>
      )}
    </View>
  );
}

function StatsScreen() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const isWideScreen = useWindowDimensions().width > 600;

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const [statsResponse, profileResponse] = await Promise.all([
            axios.get(new URL('stats', API_URL).href, { withCredentials: true }),
            axios.get(new URL('users/profile', API_URL).href, { withCredentials: true })
          ]);
          setStats(statsResponse.data);
          setUserProfile(profileResponse.data);
        } catch (err) {
          console.error('Failed to fetch stats or profile:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [])
  );

  if (loading) {
    return <ActivityIndicator size='large' style={styles.centered} />;
  }

  if (!stats) {
    return <View style={styles.centered}><Text>Could not load stats.</Text></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Your Impact</Text>
      <View style={styles.statsGrid}>
        <StatCard icon='road' fontAwesomeIcon value={stats.totalDistance.toFixed(0)} label='Total Distance' unit='km' extraStyles={isWideScreen ? styles.statCardWide : undefined} />
        <StatCard icon='leaf' value={(stats.totalEmissions / 1000).toFixed(2)} label='Total Emissions' unit='kg CO₂' extraStyles={isWideScreen ? styles.statCardWide : undefined} />
        <StatCard icon='speedometer' value={stats.averageEmissions.toFixed(1)} label='Avg. Emissions' unit='g/km' extraStyles={isWideScreen ? styles.statCardWide : undefined} />
        <StatCard icon='car-sport' value={String(stats.vehicleCount)} label='Your Vehicles' unit='' extraStyles={isWideScreen ? styles.statCardWide : undefined} />
      </View>

      <Text style={styles.header}>{t('achievements.title')}</Text>
      <View style={styles.achieveGrid}>
        {Object.entries(ALL_ACHIEVEMENTS).map(([key, config]) => (
          <Achievement
            key={key}
            icon={config.icon as any}
            title={t(config.key)}
            unlocked={userProfile?.achievements?.includes(key) ?? false}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f8'
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10
  },
  statCard: {
    backgroundColor: 'white',
    width: '45%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    elevation: 2
  },
  statCardWide: {
    backgroundColor: 'white',
    width: '22%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    elevation: 2
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 8
  },
  statUnit: {
    fontSize: 14,
    color: '#555'
  },
  statLabel: {
    fontSize: 14,
    color: '#777',
    marginTop: 4
  },
  achieveGrid: {
    paddingHorizontal: 20,
    paddingBottom: 20
  },
  achieveCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginVertical: 6,
    elevation: 2,
    overflow: 'hidden', // Important for Web to avoid icon overflow
  },
  achieveLocked: {
    backgroundColor: '#f9f9f9',
    opacity: 0.6,
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none', // Allows clicks to pass through
    backgroundColor: 'rgba(60, 60, 60, 0.1)',
  },
  achieveTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 16
  },
});

export default withAuth(StatsScreen);
