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
      <TitleSetter title={t('pages.home.title')} />
      <Text style={{ color: 'yellow' }}>INSIDE HOME</Text>
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
