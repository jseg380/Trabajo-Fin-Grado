import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme, // Start with all the default theme properties
  colors: {
    ...DefaultTheme.colors, // Inherit all default colors
    primary: '#2196F3',     // Override the primary color with our brand's blue
    secondary: '#007A7A',   // Override the secondary color
  },
};
