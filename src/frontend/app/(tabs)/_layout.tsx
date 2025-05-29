import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ff00ff',
      }}
    >
      <Tabs.Screen
        name='home/index'
        options={{ 
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name='home' size={24} color={color} />,
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name='home' size={20} color='black' style={{ marginRight: 8 }} />
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Home</Text>
            </View>
          )
        }} 
      />
      <Tabs.Screen
        name='vehicles/index'
        options={{ 
          title: 'Vehicles',
          tabBarIcon: ({ color }) => <Ionicons name='car' size={24} color={color} />,
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name='car' size={20} color='black' style={{ marginRight: 8 }} />
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Vehicles</Text>
            </View>
          )
        }} 
      />
      <Tabs.Screen
        name='routes/index'
        options={{ 
          title: 'Routes',
          tabBarIcon: ({ color }) => <Ionicons name='map' size={24} color={color} />,
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name='map' size={20} color='black' style={{ marginRight: 8 }} />
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Routes</Text>
            </View>
          )
        }} 
      />
      <Tabs.Screen
        name='stats/index'
        options={{ 
          title: 'Stats',
          tabBarIcon: ({ color }) => <Ionicons name='stats-chart' size={24} color={color} />,
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name='stats-chart' size={20} color='black' style={{ marginRight: 8 }} />
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Statistics</Text>
            </View>
          )
        }} 
      />
    </Tabs>
  );
}
