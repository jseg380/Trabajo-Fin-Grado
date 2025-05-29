import { TabsConfig } from './tabsConfig.types';

export const TAB_CONFIG = {
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
export type TabRoutes = keyof typeof TAB_CONFIG
