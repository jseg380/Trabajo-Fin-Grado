import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import { TAB_CONFIG } from './tabsConfig';
import type { TabRoutes } from './tabsConfig';
import type { TabConfig } from './tabsConfig.types';

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
