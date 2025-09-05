import { View, TextInput, Button, Text, StyleSheet, Image } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { Link, router, Stack } from 'expo-router';
import { useState } from 'react';
import TitleSetterWebPage from '@/components/TitleSetter';
import { useTranslation } from 'react-i18next';
import { SimpleLineIcons } from '@expo/vector-icons';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { t } = useTranslation();

  const handleLogin = async () => {
    try {
      await login(email, password);
      router.replace('/(tabs)/home');
    } catch (err) {
      setError(t('pages.login.invalid-credentials'));
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: t('pages.login.title'),
          headerLeft: () => null, // Hide the back button
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <SimpleLineIcons 
                name='login'
                size={20} 
                color='black'
                style={{ marginRight: 20 }} 
              />
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                {t('pages.login.title')}
              </Text>
            </View>
          ),
          headerRight: () => <LanguageSwitcher />,
        }}
      />
      <TitleSetterWebPage title={t('pages.login.title')} />
      <Image
        source={require('@/assets/images/aldiacar-logo-text.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>{t('pages.login.header-title')}</Text>
      
      {error ? <Text style={styles.error}>{error}</Text> : null}
      
      <Text style={styles.inputLabel}>{t('pages.login.email')}</Text>
      <TextInput
        style={styles.input}
        placeholder={t('pages.login.email')}
        value={email}
        onChangeText={setEmail}
        autoCapitalize='none'
        inputMode='email'
      />
      
      <Text style={styles.inputLabel}>{t('pages.login.password')}</Text>
      <TextInput
        style={styles.input}
        placeholder={t('pages.login.password')}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <Button title={t('pages.login.login-button')} onPress={handleLogin} />
      
      <Link
        href='/(auth)/register'
        onPress={(e) => {
          e.preventDefault();
          router.replace('/(auth)/register');
        }}
        asChild
      >
        <Text style={styles.link}>{t('pages.login.register-link')}</Text>
      </Link>
      <Link
        href='/(auth)/register'
        onPress={(e) => {
          e.preventDefault();
          router.replace('/(auth)/register');
        }}
        asChild
      >
        <Text style={styles.link}>{t('pages.login.forgotten-password')}</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    width: '60%',
    margin: 'auto'
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5
  },
  error: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center'
  },
  link: {
    color: '#2196F3',
    marginTop: 15,
    textAlign: 'center'
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 10
  },
  logo: {
    width: 200,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 20,
  },
});
