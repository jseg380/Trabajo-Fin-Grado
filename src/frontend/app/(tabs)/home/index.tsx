import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Modal, Portal, TextInput, Button as PaperButton } from 'react-native-paper';
import axios from 'axios';
import { API_URL } from '@/constants/config';
import { withAuth } from '@/utils/withAuth';
import { useAuth } from '@/context/AuthContext';
import { showInfoAlert } from '@/utils/CrossPlatformAlert';

interface Vehicle {
  _id: string;
  make: string;
  model: string;
  status: {
    state: 'at_home' | 'in_use' | 'reserved';
    checkedOutBy?: { _id: string; name: string; };
    reservedBy?: { _id: string; name: string; };
    reservedFrom?: string;
    reservedUntil?: string;
  };
}

function VehicleStatusCard({ vehicle, onStatusChange, onReservePress }: { vehicle: Vehicle, onStatusChange: () => void, onReservePress: () => void }) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleAction = async (action: 'checkout' | 'checkin' | 'cancel-reservation') => {
    setIsLoading(true);
    try {
      await axios.post(`${API_URL}vehicles/${vehicle._id}/${action}`, {}, { withCredentials: true });
      onStatusChange();
    } catch (err: any) {
      showInfoAlert('Error', err.response?.data?.error || `Action failed.`);
    } finally {
      setIsLoading(false);
    }
  };

  let statusText, statusColor, iconName;
  const isReservedByMe = vehicle.status.reservedBy?._id === user._id;

  // Determine display properties based on vehicle state
  switch (vehicle.status.state) {
    case 'in_use':
      statusText = `In Use by: ${vehicle.status.checkedOutBy?.name || 'Unknown'}`;
      statusColor = '#d32f2f';
      iconName = 'car-arrow-right';
      break;
    case 'reserved':
      const from = vehicle.status.reservedFrom ? new Date(vehicle.status.reservedFrom).toLocaleString() : 'N/A';
      const until = vehicle.status.reservedUntil ? new Date(vehicle.status.reservedUntil).toLocaleString() : 'N/A';
      statusText = `Reserved by ${vehicle.status.reservedBy?.name} from ${from} to ${until}`;
      statusColor = '#f57c00';
      iconName = 'car-clock';
      break;
    default: // 'at_home'
      statusText = 'At Home';
      statusColor = '#4caf50';
      iconName = 'car-parking-lights';
  }

  return (
    <View style={styles.card}>
      <MaterialCommunityIcons name={iconName} size={40} color={statusColor} style={{ marginRight: 16 }} />
      <View style={styles.content}>
        <Text style={styles.vehicleName}>{vehicle.make} {vehicle.model}</Text>
        <Text style={styles.statusText}>{statusText}</Text>
      </View>
      <View style={styles.actionsContainer}>
        {isLoading ? <ActivityIndicator /> : <>
          {vehicle.status.state === 'at_home' && (
            <>
              <PaperButton compact mode="outlined" onPress={() => handleAction('checkout')}>Check-Out</PaperButton>
              <PaperButton compact mode="outlined" onPress={onReservePress} style={{ marginTop: 4 }}>Reserve</PaperButton>
            </>
          )}
          {vehicle.status.state === 'in_use' && (
            <PaperButton compact mode="outlined" onPress={() => handleAction('checkin')}>Check-In</PaperButton>
          )}
          {vehicle.status.state === 'reserved' && isReservedByMe && (
            <>
              <PaperButton compact mode="outlined" onPress={() => handleAction('checkout')}>Check-Out</PaperButton>
              <PaperButton compact mode="outlined" onPress={() => handleAction('cancel-reservation')} style={{ marginTop: 4 }}>Cancel</PaperButton>
            </>
          )}
        </>}
      </View>
    </View>
  );
}

// --- Main Dashboard Screen ---
function DashboardScreen() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [reservationFromTime, setReservationFromTime] = useState('');
  const [reservationUntilTime, setReservationUntilTime] = useState('');

  const fetchVehicleStatus = async () => {
    // No setLoading(true) here, to allow for background refresh
    try {
      const response = await axios.get(`${API_URL}vehicles`, { withCredentials: true });
      setVehicles(response.data);
    } catch (err) {
      console.error('Failed to fetch vehicles:', err);
    } finally {
      setLoading(false);
    }
  };
  
  useFocusEffect(useCallback(() => { setLoading(true); fetchVehicleStatus(); }, []));

  const showModal = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setModalVisible(true);
  };
  const hideModal = () => {
    setModalVisible(false);
    setSelectedVehicle(null);
    setReservationFromTime('');
    setReservationUntilTime('');
  };

  const handleReserve = async () => {
    if (!selectedVehicle || !reservationFromTime || !reservationUntilTime) return;
    try {
      const payload = { 
        reservedFrom: reservationFromTime,
        reservedUntil: reservationUntilTime 
      };
      await axios.post(`${API_URL}vehicles/${selectedVehicle._id}/reserve`, payload, { withCredentials: true });
      showInfoAlert('Success', 'Vehicle Reserved!');
      hideModal();
      setLoading(true);
      fetchVehicleStatus();
    } catch (err: any) {
      showInfoAlert('Error', err.response?.data?.error || 'Could not reserve vehicle.');
    }
  };

  if (loading && vehicles.length === 0) return <ActivityIndicator size="large" style={styles.centered} />;

  return (
    <View style={styles.container}>
      <Portal>
        <Modal visible={modalVisible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>
          <Text style={styles.modalTitle}>Reserve {selectedVehicle?.make} {selectedVehicle?.model}</Text>
          <TextInput
            label="Reserve From (YYYY-MM-DD HH:MM)"
            value={reservationFromTime}
            onChangeText={setReservationFromTime}
            style={{ marginBottom: 10 }}
          />
          <TextInput
            label="Reserve Until (YYYY-MM-DD HH:MM)"
            value={reservationUntilTime}
            onChangeText={setReservationUntilTime}
            style={{ marginBottom: 20 }}
          />
          <PaperButton mode="contained" onPress={handleReserve}>Confirm Reservation</PaperButton>
        </Modal>
      </Portal>

      <FlatList
        data={vehicles}
        renderItem={({ item }) => <VehicleStatusCard vehicle={item} onStatusChange={() => { setLoading(true); fetchVehicleStatus(); }} onReservePress={() => showModal(item)} />}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={<Text style={styles.header}>Vehicle Status</Text>}
        ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No vehicles found.</Text>
            </View>
        }
        refreshing={loading}
        onRefresh={() => { setLoading(true); fetchVehicleStatus(); }}
      />
    </View>
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
  list: {
    padding: 16,
    flexGrow: 1
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3
  },
  content: {
    flex: 1
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  statusText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    flexWrap: 'wrap'
  },
  actionsContainer: {
    alignItems: 'flex-end'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600'
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 12
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
});

export default withAuth(DashboardScreen);
