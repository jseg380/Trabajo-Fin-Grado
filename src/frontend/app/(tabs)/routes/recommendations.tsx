import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Card, Title, Paragraph, Button, Modal, Portal } from 'react-native-paper';
import axios from 'axios';
import { API_URL } from '@/constants/config';

interface Recommendation {
  _id: string;
  make: string;
  model: string;
  year: number;
  fuelType: string;
  emissionFactor: number;
  totalEmissions: number;
}

export default function RecommendationsScreen() {
  const params = useLocalSearchParams();
  const [recs, setRecs] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVeh, setSelectedVeh] = useState<Recommendation | null>(null);

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const payload = {
          distance: params.distance,
          origin: { lat: params.originLat, lng: params.originLng },
          destination: { lat: params.destinationLat, lng: params.destinationLng }
        };
        const response = await axios.post(`${API_URL}recommendations`, payload, { withCredentials: true });
        setRecs(response.data);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchRecs();
  }, [params]);

  const handleSelectVehicle = (vehicle: Recommendation) => {
    setSelectedVeh(vehicle);
    setModalVisible(true);
  };

  const openMaps = (app: 'google' | 'waze') => {
    const oLat = params.originLat;
    const oLng = params.originLng;
    const dLat = params.destinationLat;
    const dLng = params.destinationLng;
    const url = app === 'google'
      ? `https://www.google.com/maps/dir/?api=1&origin=${oLat},${oLng}&destination=${dLat},${dLng}&travelmode=driving`
      : `https://waze.com/ul?ll=${dLat},${dLng}&navigate=yes`;
    Linking.openURL(url);
  };

  if (loading) {
    return <ActivityIndicator size="large" style={styles.centered} />;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Vehicle Recommendations' }} />
      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContainer}>
          <Title>Ready to drive?</Title>
          <Paragraph>{selectedVeh?.make} {selectedVeh?.model}</Paragraph>
          <Paragraph>{params.originName} -{'>'} {params.destinationName}</Paragraph>
          <View style={styles.modalActions}>
            <Button mode="outlined" onPress={() => openMaps('google')} style={styles.mapButton}>
              Open in Google Maps
            </Button>
            <Button mode="outlined" onPress={() => openMaps('waze')} style={styles.mapButton}>
              Open in Waze
            </Button>
            <View style={styles.cancelButtonContainer}>
              <Button 
                mode="contained" 
                onPress={() => setModalVisible(false)}
                buttonColor="#d32f2f"
              >
                Cancel
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>

      {recs?.tripIsInZBE && <Text style={styles.zbeWarning}>ZBE DETECTED: Showing compliant vehicles only.</Text>}
      <FlatList
        data={recs?.recommendations || []}
        keyExtractor={item => item._id}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => handleSelectVehicle(item)}>
            <Card style={[styles.card, index === 0 && styles.bestCard]}>
              {index === 0 && <Text style={styles.badge}>Best Choice</Text>}
              <Card.Title title={`${item.make} ${item.model}`} subtitle={`Fuel: ${item.fuelType}`} />
              <Card.Content>
                <Paragraph>Emissions: {item.totalEmissions.toFixed(0)} gCO₂</Paragraph>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    padding: 10
  },
  zbeWarning: {
    color: 'orange',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10
  },
  card: {
    marginVertical: 8
  },
  bestCard: {
    borderWidth: 2,
    borderColor: 'green'
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'green',
    color: 'white',
    paddingHorizontal: 6,
    borderRadius: 5
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 12
  },
  modalActions: { 
    marginTop: 20,
  },
  mapButton: {
    marginBottom: 12,
  },
  cancelButtonContainer: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
});
