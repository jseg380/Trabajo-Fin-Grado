import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import ProfileButton from '@/components/ProfileButton';

// Type for individual tab configuration
type TabConfig = {
  title: string;
  iconName: React.ComponentProps<typeof Ionicons>['name']; // Icon names
  headerTitle: string;
};

// Type for the complete tabs config
type TabsConfig = Record<string, TabConfig>;


const TAB_CONFIG = {
  home: {
    title: 'Home',
    iconName: 'home',
    headerTitle: 'Home'
  },
  vehicles: {
    title: 'Vehicles',
    iconName: 'car',
    headerTitle: 'Vehicles'
  },
  routes: {
    title: 'Routes',
    iconName: 'map',
    headerTitle: 'Routes'
  },
  stats: {
    title: 'Stats',
    iconName: 'stats-chart',
    headerTitle: 'Statistics'
  }
} as const satisfies TabsConfig;

// Equivalent to:
// type TabRoutes = "home" | "vehicles" | "routes" | ...;
type TabRoutes = keyof typeof TAB_CONFIG


export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ff00ff',
      }}
    >
      {(Object.entries(TAB_CONFIG) as Array<[TabRoutes, TabConfig]>).map(
        ([name, config]) => (
          <Tabs.Screen
            key={name}
            name={`${name}/index`}
            options={{
              title: config.title,
              tabBarIcon: ({ color }) => (
                <Ionicons name={config.iconName} size={24} color={color} />
              ),
              headerTitle: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons 
                    name={config.iconName} 
                    size={20} 
                    color="black" 
                    style={{ marginRight: 8 }} 
                  />
                  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                    {config.headerTitle}
                  </Text>
                </View>
              )
            }}
          />
        )
      )}
    </Tabs>
  );
}
