import React, { useState } from 'react';
import { Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { Tabs, Stack, useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { API_URL } from '@/constants/config';
import { ActivityIndicator } from 'react-native-paper';
import { showInfoAlert } from '@/utils/CrossPlatformAlert';
import CustomHeaderBackButton from '@/components/CustomHeaderBackButton';

// We only need a subset of the vehicle data for this form
type MaintenanceData = {
  tires?: { date?: string; distance?: number };
  brakes?: { distance?: number };
  oilChange?: { distance?: number };
  itv?: string;
};

export default function MaintenanceLogScreen() {
  const router = useRouter();
  const { vehicleId, vehicleName } = useLocalSearchParams();

  // The form state will hold the string values from the text inputs
  const [formState, setFormState] = useState({
    itv: '',
    tiresDate: '',
    tiresDistance: '',
    brakesDistance: '',
    oilChangeDistance: '',
  });
  const [loading, setLoading] = useState(false);

  // Helper function to update the nested state
  const handleInputChange = (field: keyof typeof formState, value: string) => {
    setFormState(prevState => ({ ...prevState, [field]: value }));
  };

  const handleUpdate = async () => {
    setLoading(true);
    
    // Construct the payload for the API from our form state.
    // Ensure numbers are converted from strings.
    const payload: { upcomingMaintenance: MaintenanceData } = {
      upcomingMaintenance: {
        itv: formState.itv || undefined,
        tires: {
          date: formState.tiresDate || undefined,
          distance: formState.tiresDistance ? Number(formState.tiresDistance) : undefined
        },
        brakes: {
          distance: formState.brakesDistance ? Number(formState.brakesDistance) : undefined
        },
        oilChange: {
          distance: formState.oilChangeDistance ? Number(formState.oilChangeDistance) : undefined
        }
      }
    };

    try {
      await axios.put(`${API_URL}vehicles/${vehicleId}`, payload, { withCredentials: true });

      showInfoAlert('Success', 'Maintenance schedule updated!');
      router.back();
    } catch (err) {
      showInfoAlert('Error', 'Could not update maintenance info.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <Tabs.Screen options={{ tabBarStyle: { display: 'none' } }} />
      <Stack.Screen 
        options={{
          title: `Maintenance: ${vehicleName}`,
          headerLeft: () => <CustomHeaderBackButton route='/vehicles' />,
        }}
      />
      <Text style={styles.title}>Log Maintenance</Text>
      <Text style={styles.subtitle}>Enter the new date or remaining distance for each task.</Text>
      
      <Text style={styles.label}>ITV Date (YYYY-MM-DD)</Text>
      <TextInput style={styles.input} placeholder="e.g., 2025-10-20" value={formState.itv} onChangeText={(val) => handleInputChange('itv', val)} />
      
      <Text style={styles.label}>Tire Change Date (YYYY-MM-DD)</Text>
      <TextInput style={styles.input} placeholder="e.g., 2026-03-15" value={formState.tiresDate} onChangeText={(val) => handleInputChange('tiresDate', val)} />
      
      <Text style={styles.label}>Tire Change Remaining Distance (km)</Text>
      <TextInput style={styles.input} placeholder="e.g., 40000" keyboardType="numeric" value={formState.tiresDistance} onChangeText={(val) => handleInputChange('tiresDistance', val)} />
      
      <Text style={styles.label}>Brake Change Remaining Distance (km)</Text>
      <TextInput style={styles.input} placeholder="e.g., 50000" keyboardType="numeric" value={formState.brakesDistance} onChangeText={(val) => handleInputChange('brakesDistance', val)} />
      
      <Text style={styles.label}>Oil Change Remaining Distance (km)</Text>
      <TextInput style={styles.input} placeholder="e.g., 15000" keyboardType="numeric" value={formState.oilChangeDistance} onChangeText={(val) => handleInputChange('oilChangeDistance', val)} />

      {loading ? <ActivityIndicator /> : <Button title="Save Maintenance Info" onPress={handleUpdate} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333'
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 16,
    fontSize: 16
  },
});
