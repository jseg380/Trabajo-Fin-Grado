import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { FAB, Modal, Portal, Card, Title, Paragraph } from 'react-native-paper';
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
  upcomingMaintenance?: {
    tires?: { date?: string; distance?: number };
    brakes?: { distance?: number };
    oilChange?: { distance?: number };
    itv?: string;
  }
}

function VehicleItem({ vehicle, onDelete, onEdit, onMaintenance, onViewDetails }: { 
    vehicle: Vehicle, 
    onDelete: (id: string) => void, 
    onEdit: () => void,
    onMaintenance: () => void,
    onViewDetails: () => void
}) {
  const handleDelete = async () => {
    const confirmed = await showConfirmationAlert('Delete Vehicle', `Delete ${vehicle.make} ${vehicle.model}?`, 'Delete');
    if (confirmed) onDelete(vehicle._id);
  };

  return (
    <View style={styles.card}>
      <Ionicons name='car-sport-outline' size={40} color='#333' style={styles.cardIcon} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{vehicle.make} {vehicle.model}</Text>
        <Text style={styles.cardSubtitle}>Year: {vehicle.year} - Fuel: {vehicle.fuelType}</Text>
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={onViewDetails} style={styles.actionButton}><Ionicons name='eye' size={24} color='#555' /></TouchableOpacity>
        <TouchableOpacity onPress={onMaintenance} style={styles.actionButton}><Ionicons name='build' size={24} color='#f57c00' /></TouchableOpacity>
        <TouchableOpacity onPress={onEdit} style={styles.actionButton}><Ionicons name='pencil' size={24} color='#2196F3' /></TouchableOpacity>
        <TouchableOpacity onPress={handleDelete} style={styles.actionButton}><Ionicons name='trash' size={24} color='#FF3B30' /></TouchableOpacity>
      </View>
    </View>
  );
}

function VehiclesScreen() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(new URL('vehicles', API_URL).href, { withCredentials: true });
      setVehicles(response.data);
    } catch (err) { console.error('Failed to fetch vehicles:', err); } 
    finally { setLoading(false); }
  };

  useFocusEffect(useCallback(() => { fetchVehicles(); }, []));

  const handleDeleteVehicle = async (id: string) => {
    try {
      await axios.delete(new URL(`vehicles/${id}`, API_URL).href, { withCredentials: true });
      setVehicles(currentVehicles => currentVehicles.filter(v => v._id !== id));
      showInfoAlert('Success', 'Vehicle deleted.');
    } catch (err) { showInfoAlert('Error', 'Could not delete vehicle.'); }
  };

  const showModal = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalVisible(true);
  };
  const hideModal = () => {
    setIsModalVisible(false);
    setSelectedVehicle(null);
  };

  if (loading) return <ActivityIndicator size='large' style={styles.centered} />;

  return (
    <View style={styles.container}>
      <Portal>
        <Modal visible={isModalVisible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>
          <Card>
            <Card.Content>
              <Title>{selectedVehicle?.make} {selectedVehicle?.model} - Maintenance</Title>
              <Paragraph>ITV Date: {selectedVehicle?.upcomingMaintenance?.itv ? new Date(selectedVehicle.upcomingMaintenance.itv).toLocaleDateString() : 'N/A'}</Paragraph>
              <Paragraph>Tire Date: {selectedVehicle?.upcomingMaintenance?.tires?.date ? new Date(selectedVehicle.upcomingMaintenance.tires.date).toLocaleDateString() : 'N/A'}</Paragraph>
              <Paragraph>Tire Distance: {selectedVehicle?.upcomingMaintenance?.tires?.distance ?? 'N/A'} km</Paragraph>
              <Paragraph>Brake Distance: {selectedVehicle?.upcomingMaintenance?.brakes?.distance ?? 'N/A'} km</Paragraph>
              <Paragraph>Oil Change: {selectedVehicle?.upcomingMaintenance?.oilChange?.distance ?? 'N/A'} km</Paragraph>
            </Card.Content>
          </Card>
        </Modal>
      </Portal>

      <FlatList
        data={vehicles}
        renderItem={({ item }) => 
            <VehicleItem 
                vehicle={item} 
                onDelete={handleDeleteVehicle} 
                onViewDetails={() => showModal(item)}
                onEdit={() => router.push({ pathname: `/(tabs)/vehicles/${item._id}/edit`, params: { ...item }})}
                onMaintenance={() => router.push({ pathname: `/(tabs)/vehicles/${item._id}/maintenance`, params: { vehicleName: `${item.make} ${item.model}` }})}
            />
        }
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
      />
      <FAB style={styles.fab} icon='plus' onPress={() => router.push('/(tabs)/vehicles/add')} />
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
    padding: 20
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3
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
    backgroundColor: '#2196F3'
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 12
  },
});

export default withAuth(VehiclesScreen);
