import { View, Text, StyleSheet } from 'react-native';
import { Link, Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import TitleSetterWebPage from '@/components/TitleSetter';
import { withAuth } from '@/utils/withAuth';
import CustomHeaderBackButton from '@/components/CustomHeaderBackButton';

function NotFoundScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: t('pages.not-found.title'),
          headerLeft: () => <CustomHeaderBackButton route='/' />,
        }}
      />
      <TitleSetterWebPage title={t('pages.not-found.title')} />

      <Text style={styles.title}>{t('pages.not-found.content.title')}</Text>
      <Text style={styles.subtitle}>{t('pages.not-found.content.description')}</Text>
      <Link
        href='/'
        style={styles.button}
        onPress={(e) => {
          e.preventDefault();
          router.replace('/');
        }}
      >
        {t('pages.not-found.content.back')}
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 24,
    marginTop: 10,
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#2196F3',
    color: '#fff',
    borderRadius: 5,
  },
});


export default withAuth(NotFoundScreen);
