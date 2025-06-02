import { Stack } from 'expo-router';
import { t, setLanguage } from '@/localization/languageService';

export default function RootLayout() {
  setLanguage('en');
  return (
    <Stack>
      <Stack.Screen
        name='(tabs)'
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='+not-found'
        options={{ title: t('pages.not-found.title') }}
      />
    </Stack>
  );
}
