import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import ProfileButton from '@/components/ProfileButton';
import { useTranslation } from 'react-i18next';
import { withAuth } from '@/utils/withAuth';

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
    title: 'pages.maintenance.title',
    iconName: 'home',
    headerTitle: 'pages.maintenance.header-title'
  },
  vehicles: {
    title: 'pages.vehicles.title',
    iconName: 'car',
    headerTitle: 'pages.vehicles.header-title'
  },
  routes: {
    title: 'pages.routes.title',
    iconName: 'map',
    headerTitle: 'pages.routes.header-title'
  },
  stats: {
    title: 'pages.statistics.title',
    iconName: 'stats-chart',
    headerTitle: 'pages.statistics.header-title'
  },
} as const satisfies TabsConfig;

// Equivalent to:
// type TabRoutes = 'home' | 'vehicles' | 'routes' | ...;
type TabRoutes = keyof typeof TAB_CONFIG

// Pages not to be included in the tab bar
const HIDDEN_PAGES = [
  'vehicles/add',   // Add vehicle page
  'vehicles/[vehicleId]/edit',  // Edit vehicle page
  'vehicles/[vehicleId]/maintenance',  // Edit maintenance vehicle info
  'routes/recommendations',   // Recommendation selection page
];


function TabsLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2196F3',
        tabBarActiveBackgroundColor: '#F4F4F8',
        headerRight: () => ProfileButton()
      }}
    >
      {(Object.entries(TAB_CONFIG) as Array<[TabRoutes, TabConfig]>).map(
        ([name, config]) => (
          <Tabs.Screen
            key={name}
            name={`${name}/index`}
            options={{
              title: t(config.title),
              tabBarIcon: ({ color }) => (
                <Ionicons name={config.iconName} size={24} color={color} />
              ),
              headerTitle: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons 
                    name={config.iconName} 
                    size={20} 
                    color='black'
                    style={{ marginRight: 8 }} 
                  />
                  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                    {t(config.headerTitle)}
                  </Text>
                </View>
              )
            }}
          />
        )
      )}

      {HIDDEN_PAGES.map((name) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{ href: null }}
        />
      ))}
    </Tabs>
  );
}


export default withAuth(TabsLayout);
