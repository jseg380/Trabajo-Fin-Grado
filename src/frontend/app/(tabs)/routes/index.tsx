import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Menu } from 'react-native-paper';
import { withAuth } from '@/utils/withAuth';
import { showInfoAlert } from '@/utils/CrossPlatformAlert';

// Hardcoded locations for the demo
const LOCATIONS = {
  "Plaza Nueva (ZBE)": { lat: 37.1773, lng: -3.5986, distance: 5 }, // 5 km trip
  "Alhambra (Outside ZBE)": { lat: 37.1761, lng: -3.5881, distance: 8 }, // 8 km trip
};
type LocationKey = keyof typeof LOCATIONS;

function TripPlannerScreen() {
  const router = useRouter();
  const [origin, setOrigin] = useState<LocationKey | null>(null);
  const [destination, setDestination] = useState<LocationKey | null>(null);
  const [originMenu, setOriginMenu] = useState(false);
  const [destMenu, setDestMenu] = useState(false);

  const handleFindVehicle = () => {
    if (!origin || !destination) {
      showInfoAlert('Missing Info', 'Please select an origin and destination.');
      return;
    }
    router.push({
      pathname: '/(tabs)/routes/recommendations',
      params: {
        originLat: LOCATIONS[origin].lat,
        originLng: LOCATIONS[origin].lng,
        destinationLat: LOCATIONS[destination].lat,
        destinationLng: LOCATIONS[destination].lng,
        distance: LOCATIONS[origin].distance, // Using origin's dummy distance
        originName: origin,
        destinationName: destination
      }
    });
  };

  return (
    <View style={styles.container}>
        <Text style={styles.title}>Plan Your Trip</Text>
        <Menu
            visible={originMenu} onDismiss={() => setOriginMenu(false)}
            anchor={<Button mode="outlined" onPress={() => setOriginMenu(true)}>{origin || "Select Origin"}</Button>}
        >
            {Object.keys(LOCATIONS).map(loc => <Menu.Item key={loc} onPress={() => { setOrigin(loc as LocationKey); setOriginMenu(false); }} title={loc} />)}
        </Menu>
        <Menu
            visible={destMenu} onDismiss={() => setDestMenu(false)}
            anchor={<Button mode="outlined" onPress={() => setDestMenu(true)} style={{marginVertical: 20}}>{destination || "Select Destination"}</Button>}
        >
            {Object.keys(LOCATIONS).map(loc => <Menu.Item key={loc} onPress={() => { setDestination(loc as LocationKey); setDestMenu(false); }} title={loc} />)}
        </Menu>
        <Button mode="contained" onPress={handleFindVehicle}>Find The Best Vehicle</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30
  },
});

export default withAuth(TripPlannerScreen);
