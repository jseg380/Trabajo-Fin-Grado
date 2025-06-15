import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ActivityIndicator, Menu, Button as PaperButton } from 'react-native-paper';
import axios from 'axios';
import { API_URL, SPECS_API_URL } from '@/constants/config';
import { withAuth } from '@/utils/withAuth';
import { showInfoAlert } from '@/utils/CrossPlatformAlert';

// --- This function simulates a call to an external API ---
// In a real app, this would be a fetch call to a service like "Auto-data"
const fetchExternalVehicleSpecs = async (make: string, model: string, year: string, fuelType: string) => {
  const params = new URLSearchParams({ make, model, year, fuelType });
  const response = await axios.get(`${SPECS_API_URL}/specs?${params.toString()}`);
  return response.data;
};

// --- Static list of fuel types ---
const FUEL_TYPES = ['gasoline', 'diesel', 'electric', 'hybrid'];


function AddVehicleScreen() {
  const router = useRouter();
  
  // Form state
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [emissionFactor, setEmissionFactor] = useState<number | null>(null);

  // UI state
  const [isFetchingSpecs, setIsFetchingSpecs] = useState(false);
  const [isFuelTypeMenuVisible, setIsFuelTypeMenuVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleFetchSpecs = async () => {
    if (!make || !model || !year || !fuelType) {
      setError('Please fill in Make, Model, Year and FuelType first.');
      return;
    }
    setError('');
    setIsFetchingSpecs(true);
    try {
      const specs = await fetchExternalVehicleSpecs(make, model, year, fuelType);
      setEmissionFactor(specs.emissionFactor);
    } catch (err) {
      setError('Could not fetch vehicle specs.');
    } finally {
      setIsFetchingSpecs(false);
    }
  };

  const handleAddVehicle = async () => {
    if (emissionFactor === null) {
      setError('Please fetch vehicle specs before adding.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await axios.post(
        new URL('vehicles', API_URL).href,
        {
          make: make,
          model: model,
          year: Number(year),
          fuelType: fuelType, // Use the selected fuel type
          emissionFactor,
        },
        { withCredentials: true }
      );
      showInfoAlert('Success', 'Vehicle added successfully!');
      router.back(); // Go back to the vehicles list
    } catch (err) {
      setError('Failed to add vehicle. Please try again.');
      showInfoAlert('Error', 'Failed to add vehicle. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canFetchSpecs = make.length > 0 && model.length > 0 && year.length === 4;

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: 'Add New Vehicle' }} />
      <Text style={styles.title}>Add Your Vehicle</Text>
      <Text style={styles.subtitle}>Enter basic details to get started.</Text>

      <TextInput
        style={styles.input}
        placeholder='Make (e.g., Toyota)'
        value={make}
        onChangeText={setMake}
      />
      <TextInput
        style={styles.input}
        placeholder='Model (e.g., Corolla)'
        value={model}
        onChangeText={setModel}
      />
      <TextInput
        style={styles.input}
        placeholder='Year (e.g., 2021)'
        value={year}
        onChangeText={setYear}
        keyboardType='numeric'
        maxLength={4}
      />

      <Menu
        visible={isFuelTypeMenuVisible}
        onDismiss={() => setIsFuelTypeMenuVisible(false)}
        anchor={
          <PaperButton mode='outlined' onPress={() => setIsFuelTypeMenuVisible(true)} disabled={!model}>
            {fuelType ? `Fuel: ${fuelType.charAt(0).toUpperCase() + fuelType.slice(1)}` : 'Select a Fuel Type'}
          </PaperButton>
        }
      >
        {FUEL_TYPES.map(type => (
          <Menu.Item
            key={type}
            onPress={() => {
              setFuelType(type);
              setIsFuelTypeMenuVisible(false);
            }}
            title={type.charAt(0).toUpperCase() + type.slice(1)}
          />
        ))}
      </Menu>

      {/* --- Step 1: Fetch Specs --- */}
      <View style={{
        opacity: canFetchSpecs ? 1 : 0.5,
        marginTop: 20,
      }}>
        <Button
          title='Fetch Technical Specs'
          onPress={handleFetchSpecs}
          disabled={!canFetchSpecs}
        />
      </View>

      {/* --- Fetched Specs Display --- */}
      {isFetchingSpecs && <ActivityIndicator style={{ marginTop: 20 }} />}
      {emissionFactor !== null && (
        <View style={styles.specsContainer}>
          <Text style={styles.specsTitle}>Technical Specs Found:</Text>
          <Text style={styles.specsText}>Fuel Type: {fuelType}</Text>
          <Text style={styles.specsText}>Emissions: {emissionFactor} gCO₂/km</Text>
        </View>
      )}

      {/* --- Step 2: Add Vehicle --- */}
      <View style={[styles.submitButton, { opacity: emissionFactor !== null ? 1 : 0.5 }]}>
        <Button
          title={isSubmitting ? 'Adding...' : 'Add Vehicle to My Garage'}
          onPress={handleAddVehicle}
          disabled={emissionFactor === null || isSubmitting}
          color='#007AFF'
        />
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  specsContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f4f4f8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  specsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  specsText: {
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    marginTop: 30,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default withAuth(AddVehicleScreen);
