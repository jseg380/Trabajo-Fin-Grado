import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { FAB } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '@/constants/config';
import { withAuth } from '@/utils/withAuth';
import { showConfirmationAlert, showInfoAlert } from '@/utils/CrossPlatformAlert';

interface Vehicle {
  _id: string;
  make: string;
  model: string;
  year: number;
  fuelType: string;
  emissions: number;
}

// Pass router and a refresh function down to the item
function VehicleItem({ vehicle, onDelete, router }: { vehicle: Vehicle, onDelete: (id: string) => void, router: any }) {
  const handleDelete = async () => {
    // --- Use crossplatform confirmation alert ---
    const confirmed = await showConfirmationAlert(
      'Delete Vehicle',
      `Are you sure you want to delete the ${vehicle.make} ${vehicle.model}?`,
      'Delete'
    );

    if (confirmed) {
      onDelete(vehicle._id);
    }
  };

  const handleEdit = () => {
    router.push({
      pathname: `/(tabs)/vehicles/${vehicle._id}/edit`,
      params: { ...vehicle }
    });
  };

  return (
    <View style={styles.card}>
      <Ionicons name='car-sport-outline' size={40} color='#333' style={styles.cardIcon} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{vehicle.make} {vehicle.model}</Text>
        <Text style={styles.cardSubtitle}>Year: {vehicle.year} - Fuel: {vehicle.fuelType}</Text>
        <Text style={styles.cardEmissions}>Emissions: {vehicle.emissions} gCO₂/km</Text>
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={handleEdit} style={styles.actionButton}>
          <Ionicons name='pencil' size={24} color='#007AFF' />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
          <Ionicons name='trash' size={24} color='#FF3B30' />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function VehiclesScreen() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(new URL('vehicles', API_URL).href, { withCredentials: true });
      setVehicles(response.data);
    } catch (err) {
      console.error('Failed to fetch vehicles:', err);
      setError('Could not load your vehicles. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // useFocusEffect will re-fetch data every time the screen comes into view.
  // This is crucial for seeing updates after adding or editing a vehicle.
  useFocusEffect(
    useCallback(() => {
      fetchVehicles();
    }, [])
  );

  const handleDeleteVehicle = async (id: string) => {
    try {
      await axios.delete(new URL(`vehicles/${id}`, API_URL).href, { withCredentials: true });
      // Remove the vehicle from the local state for an instant UI update
      setVehicles(currentVehicles => currentVehicles.filter(v => v._id !== id));
      showInfoAlert('Success', 'Vehicle deleted.');
    } catch (err) {
      showInfoAlert('Error', 'Could not delete vehicle.');
      console.error(err);
    }
  };

  if (loading) return <ActivityIndicator size='large' style={styles.centered} />;
  if (error) return <View style={styles.centered}><Text style={styles.errorText}>{error}</Text></View>;

  return (
    <View style={styles.container}>
      {vehicles.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No vehicles yet.</Text>
          <Text style={styles.emptySubText}>Press '+' to add your first one!</Text>
        </View>
      ) : (
        <FlatList
          data={vehicles}
          renderItem={({ item }) => <VehicleItem vehicle={item} onDelete={handleDeleteVehicle} router={router} />}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
        />
      )}

      <FAB
        style={styles.fab}
        icon='plus'
        onPress={() => router.push('/(tabs)/vehicles/add')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f8'
  },
  list: {
    padding: 16
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555'
  },
  emptySubText: {
    fontSize: 14,
    color: '#777',
    marginTop: 8
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
  },
  cardIcon: {
    marginRight: 16
  },
  cardContent: {
    flex: 1
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4
  },
  cardEmissions: {
    fontSize: 12,
    color: '#007A7A',
    marginTop: 8,
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row'
  },
  actionButton: {
    padding: 8
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#007AFF',
  },
})

export default withAuth(VehiclesScreen);
