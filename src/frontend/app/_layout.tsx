import { Stack } from 'expo-router';
import '@/localization';
import { useTranslation } from 'react-i18next';

export default function RootLayout() {
  const { t, i18n } = useTranslation();

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
