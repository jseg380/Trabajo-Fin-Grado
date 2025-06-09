import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { Link, router, Stack } from 'expo-router';
import { useState } from 'react';
import TitleSetter from '@/components/TitleSetter';
import { useTranslation } from 'react-i18next';

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
      setError('Invalid credentials');
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: t('pages.login.title'),
        }}
      />
      <TitleSetter title={t('pages.login.title')} />
      <Text style={styles.title}>{t('pages.login.header-title')}</Text>
      
      {error && <Text style={styles.error}>{error}</Text>}
      
      <TextInput
        style={styles.input}
        placeholder={t('pages.login.email')}
        value={email}
        onChangeText={setEmail}
        autoCapitalize='none'
        inputMode='email'
      />
      
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
    color: 'blue',
    marginTop: 15,
    textAlign: 'center'
  }
});
