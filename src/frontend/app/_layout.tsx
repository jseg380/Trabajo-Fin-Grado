import { View } from 'react-native';
import { Stack } from 'expo-router';
import { ActivityIndicator, PaperProvider } from 'react-native-paper';
import TitleSetter from '@/components/TitleSetter';
import { useEffect, useState } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { i18nInitPromise } from '@/localization';
import '@/localization';

export default function RootLayout() {
  const [isI18nReady, setIsI18nReady] = useState(false);

  useEffect(() => {
    i18nInitPromise.then(() => {
      setIsI18nReady(true);
    });
  }, []);

  // Show a loading indicator until i18n is ready
  if (!isI18nReady) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff', // optional, to avoid black screen flash
        }}
      >
        <ActivityIndicator size='large' />
      </View>
    );
  }

  return (
    <AuthProvider>
      <PaperProvider>
        {/* Fallback title */}
        <TitleSetter />
        <Stack>
          <Stack.Screen
            name='(tabs)'
            options={{ headerShown: false }}
          />
          <Stack.Screen name='+not-found' />
          <Stack.Screen name='(auth)/login' />
          <Stack.Screen name='(auth)/register' />
          {/* <Stack.Screen name='profile/[user]' /> */}
        </Stack>
      </PaperProvider>
    </AuthProvider>
  );
}
