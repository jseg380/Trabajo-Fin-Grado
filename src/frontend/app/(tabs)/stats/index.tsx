import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '@/constants/config';
import { withAuth } from '@/utils/withAuth';

interface StatsData {
  totalDistance: number;
  totalEmissions: number;
  tripCount: number;
  vehicleCount: number;
  averageEmissions: number;
}

function StatCard({ icon, value, label, unit, fontAwesomeIcon = false }: { icon: any; value: string; label: string; unit: string; fontAwesomeIcon?: boolean }) {
  return (
    <View style={styles.statCard}>
      {fontAwesomeIcon
        ? <FontAwesome name={icon} size={32} color='#007AFF' />
        : <Ionicons name={icon} size={32} color='#007AFF' />}
      
      <Text style={styles.statValue}>{value} <Text style={styles.statUnit}>{unit}</Text></Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Achievement({ icon, title, unlocked }: { icon: any; title: string; unlocked: boolean; }) {
  return (
    <View style={[styles.achieveCard, !unlocked && styles.achieveLocked]}>
      <Ionicons name={icon} size={40} color={unlocked ? '#FFC107' : '#ccc'} />
      <Text style={styles.achieveTitle}>{title}</Text>
    </View>
  );
}

function StatsScreen() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(new URL('stats', API_URL).href, { withCredentials: true });
        setStats(response.data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

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
        <StatCard icon='road' value={stats.totalDistance.toFixed(0)} label='Total Distance' unit='km' fontAwesomeIcon />
        <StatCard icon='leaf' value={(stats.totalEmissions / 1000).toFixed(2)} label='Total Emissions' unit='kg CO₂' />
        <StatCard icon='speedometer' value={stats.averageEmissions.toFixed(1)} label='Avg. Emissions' unit='g/km' />
        <StatCard icon='car-sport' value={String(stats.vehicleCount)} label='Your Vehicles' unit='' />
      </View>

      <Text style={styles.header}>Achievements</Text>
      {/* This section is hardcoded to show the concept of gamification */}
      <View style={styles.achieveGrid}>
        <Achievement icon='car' title='First Vehicle' unlocked={true} />
        <Achievement icon='navigate' title='First Trip' unlocked={true} />
        <Achievement icon='trophy' title='Eco-Warrior' unlocked={stats.averageEmissions < 120} />
        <Achievement icon='earth' title='Planet Saver' unlocked={false} />
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
    elevation: 2
  },
  achieveLocked: {
    backgroundColor: '#f9f9f9'
  },
  achieveTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 16
  },
});

export default withAuth(StatsScreen);
