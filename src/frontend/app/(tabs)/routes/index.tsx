import { Text, View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import TitleSetter from '@/components/TitleSetter';
import { useTranslation } from 'react-i18next';

export default function Index() {
  const { t } = useTranslation();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <TitleSetter title={t('pages.routes.title')} />
      <Text style={{ color: 'blue' }}>INSIDE ROUTES</Text>
      <Link
        href='/home'
        style={styles.button}
      >
        Go to home screen
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007AFF',
    color: '#fff',
    borderRadius: 5,
  },
});
