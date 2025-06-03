import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import ProfileButton from '@/components/ProfileButton';
import '@/localization';
import { useTranslation } from 'react-i18next';

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
    title: 'pages.home.title',
    iconName: 'home',
    headerTitle: 'pages.home.header-title'
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
  settings: {
    title: 'pages.settings.title',
    iconName: 'settings',
    headerTitle: 'pages.settings.header-title'
  },
} as const satisfies TabsConfig;

// Equivalent to:
// type TabRoutes = "home" | "vehicles" | "routes" | ...;
type TabRoutes = keyof typeof TAB_CONFIG


export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ff00ff',
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
                    color="black" 
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
    </Tabs>
  );
}
