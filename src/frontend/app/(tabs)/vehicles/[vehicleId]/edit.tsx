import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { API_URL } from '@/constants/config';
import { ActivityIndicator } from 'react-native-paper';
import { showInfoAlert } from '@/utils/CrossPlatformAlert';

// This is a simplified edit screen. It doesn't re-fetch external specs.
export default function EditVehicleScreen() {
  const router = useRouter();
  const { vehicleId, make, model, year, emissions } = useLocalSearchParams();

  const [formState, setFormState] = useState({
    make: make || '',
    model: model || '',
    year: year || '',
    emissions: emissions || '',
  });
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await axios.put(
        new URL(`vehicles/${vehicleId}`, API_URL).href,
        {
          make: formState.make,
          model: formState.model,
          year: Number(formState.year),
          emissions: Number(formState.emissions),
        },
        { withCredentials: true }
      );
      showInfoAlert('Success', 'Vehicle updated!');
      router.back(); // Go back to the vehicle list
    } catch (err) {
      showInfoAlert('Error', 'Could not update vehicle.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `Edit ${make} ${model}` }} />
      <Text style={styles.title}>Edit Vehicle</Text>
      
      <TextInput
        style={styles.input}
        placeholder='Make'
        value={formState.make as string}
        onChangeText={(text) => setFormState({ ...formState, make: text })}
      />
      <TextInput
        style={styles.input}
        placeholder='Model'
        value={formState.model as string}
        onChangeText={(text) => setFormState({ ...formState, model: text })}
      />
       <TextInput
        style={styles.input}
        placeholder='Year'
        value={formState.year as string}
        onChangeText={(text) => setFormState({ ...formState, year: text })}
        keyboardType='numeric'
      />
       <TextInput
        style={styles.input}
        placeholder='Emissions (gCO2/km)'
        value={formState.emissions as string}
        onChangeText={(text) => setFormState({ ...formState, emissions: text })}
        keyboardType='numeric'
      />
      
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Button title='Save Changes' onPress={handleUpdate} />
      )}
    </View>
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
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
    fontSize: 16
  },
});
