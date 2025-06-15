import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { API_URL } from '@/constants/config';
import { withAuth } from '@/utils/withAuth';

interface MaintenanceTask {
  id: string; // A stable ID from the backend
  vehicle: string;
  taskType: 'itv' | 'brakes' | 'tires' | 'oilchange';
  isOverdue: boolean;
  unit: 'days' | 'km';
  value: number;
}

function MaintenanceItem({ item }: { item: MaintenanceTask }) {
  const { t } = useTranslation();
  
  const iconColor = item.isOverdue ? '#d32f2f' : '#f57c00';
  
  // --- COMPLETE ICON LOGIC ---
  let iconName: React.ComponentProps<typeof MaterialCommunityIcons>['name'] = 'wrench-outline';
  if (item.taskType === 'itv') iconName = 'file-document-outline';
  if (item.taskType === 'brakes') iconName = 'car-brake-worn-linings';
  if (item.taskType === 'tires') iconName = 'tire';
  if (item.taskType === 'oilchange') iconName = 'oil-level';

  const getDetailString = () => {
    if (item.value === 0 && item.unit === 'days') {
        return t('pages.maintenance.details.due_today');
    }
    const key_prefix = item.isOverdue ? 'overdue' : 'upcoming';
    const key_suffix = item.unit === 'days' ? 'days' : 'km';
    const key = `pages.maintenance.details.${key_prefix}_${key_suffix}`;
    // Use the t pluralization feature to handle both singular and plural cases
    return t(key, { count: item.value });
  };

  return (
    <View style={styles.card}>
      <MaterialCommunityIcons name={iconName} size={40} color={iconColor} style={styles.icon} />
      <View style={styles.content}>
        <Text style={styles.vehicleName}>{item.vehicle}</Text>
        <Text style={styles.taskName}>{t(`pages.maintenance.tasks.${item.taskType}`)}</Text>
        <Text style={[styles.statusText, { color: iconColor }]}>
          {getDetailString()}
        </Text>
      </View>
    </View>
  );
}

function MaintenanceScreen() {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMaintenance = async () => {
    setLoading(true);
    try {
      const response = await axios.get(new URL('maintenance/summary', API_URL).href, { withCredentials: true });
      setTasks(response.data);
    } catch (err) {
      console.error('Failed to fetch maintenance summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchMaintenance(); }, []));

  if (loading) return <ActivityIndicator size='large' style={styles.centered} />;

  return (
    <FlatList
      data={tasks}
      renderItem={({ item }) => <MaintenanceItem item={item} />}
      keyExtractor={(item) => item.id} // Use the stable ID from the backend
      contentContainerStyle={styles.list}
      ListHeaderComponent={<Text style={styles.header}>{t('pages.maintenance.subtitle')}</Text>}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name='checkbox-multiple-marked-circle-outline' size={60} color='#4caf50' />
            <Text style={styles.emptyText}>{t('pages.maintenance.all_clear')}</Text>
            <Text style={styles.emptySubText}>{t('pages.maintenance.no_tasks')}</Text>
        </View>
      }
    />
  );
}


const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center' 
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80 
  },
  list: {
    padding: 16,
    flexGrow: 1 
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 4 
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5 
  },
  icon: {
    marginRight: 16 
  },
  content: {
    flex: 1 
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: 'bold' 
  },

  taskName: {
    fontSize: 16,
    color: '#444',
    marginVertical: 2 
  },

  statusText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4 
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16 
  },
  emptySubText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center' 
  }
});

export default withAuth(MaintenanceScreen);
