import { Ionicons } from '@expo/vector-icons';

// Type for individual tab configuration
export type TabConfig = {
  title: string;
  iconName: React.ComponentProps<typeof Ionicons>['name']; // Icon names
  headerTitle: string;
};

// Type for the complete tabs config
export type TabsConfig = Record<string, TabConfig>;
