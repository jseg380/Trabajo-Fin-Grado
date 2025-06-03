import { Stack } from 'expo-router';
import '@/localization';
import { PaperProvider } from 'react-native-paper';

export default function RootLayout() {
  return (
    <PaperProvider>
      <Stack>
        <Stack.Screen
          name='(tabs)'
          options={{ headerShown: false }}
        />
        <Stack.Screen name='+not-found' />
      </Stack>
    </PaperProvider>
  );
}
