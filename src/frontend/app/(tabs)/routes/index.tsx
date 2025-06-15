import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '@/constants/config';
import { withAuth } from '@/utils/withAuth';

interface Recommendation {
  _id: string;
  make: string;
  model: string;
  totalEmissions: number;
}

function RecommendationItem({ item, isBest }: { item: Recommendation; isBest: boolean }) {
  return (
    <View style={[styles.card, isBest && styles.bestCard]}>
      {isBest && <View style={styles.badge}><Text style={styles.badgeText}>Best Choice</Text></View>}
      <Ionicons name='map-outline' size={40} color={isBest ? '#2e7d32' : '#333'} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.make} {item.model}</Text>
        <Text style={styles.cardSubtitle}>Estimated Emissions: {item.totalEmissions.toFixed(0)} gCO₂</Text>
      </View>
    </View>
  );
}

function RoutesScreen() {
  const [distance, setDistance] = useState('');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGetRecommendation = async () => {
    if (!distance) {
      setError('Please enter a trip distance.');
      return;
    }
    setError('');
    setLoading(true);
    setRecommendations([]);
    try {
      const response = await axios.post(
        new URL('recommendations', API_URL).href,
        { distance: parseFloat(distance) },
        { withCredentials: true }
      );
      setRecommendations(response.data);
    } catch (err) {
      setError('Could not fetch recommendations.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.title}>Plan a Sustainable Trip</Text>
        <TextInput
          style={styles.input}
          placeholder='Enter trip distance (km)'
          value={distance}
          onChangeText={setDistance}
          keyboardType='numeric'
        />
        <Button title={loading ? 'Calculating...' : 'Get Recommendation'} onPress={handleGetRecommendation} disabled={loading} />
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      
      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

      <FlatList
        data={recommendations}
        renderItem={({ item, index }) => <RecommendationItem item={item} isBest={index === 0} />}
        keyExtractor={(item) => item._id}
        style={{ width: '100%' }}
        contentContainerStyle={{ padding: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f4f4f8'
  },
  inputContainer: {
    width: '100%',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16
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
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2
  },
  bestCard: {
    borderColor: '#4caf50',
    borderWidth: 2
  },
  cardContent: {
    marginLeft: 16 
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600'
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#555',
    marginTop: 4
  },
  badge: {
    position: 'absolute',
    top: -1,
    right: 10,
    backgroundColor: '#4caf50',
    paddingHorizontal: 8,
    paddingVertical: 4, 
    borderRadius: 12 
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold' }
});

export default withAuth(RoutesScreen);
