import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { Link, router, Stack } from 'expo-router';
import { useState } from 'react';
import TitleSetterWebPage from '@/components/TitleSetter';
import { useTranslation } from 'react-i18next';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const { t } = useTranslation();

  const handleRegister = async () => {
    try {
      await register(username, email, password);
      router.replace('/(tabs)/home');
    } catch (err) {
      setError('Invalid registration details');
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: t('pages.register.title'),
          headerLeft: () => null, // Hide the back button
        }}
      />
      <TitleSetterWebPage title={t('pages.register.title')} />
      <Text style={styles.title}>{t('pages.register.header-title')}</Text>
      
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder={t('pages.register.username')}
        value={username}
        onChangeText={setUsername}
        autoCapitalize='none'
        inputMode='text'
      />
      
      <TextInput
        style={styles.input}
        placeholder={t('pages.register.email')}
        value={email}
        onChangeText={setEmail}
        autoCapitalize='none'
        inputMode='email'
      />
      
      <TextInput
        style={styles.input}
        placeholder={t('pages.register.password')}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <Button title={t('pages.register.register-button')} onPress={handleRegister} />
      
      <Link
        href='/(auth)/login'
        onPress={(e) => {
          e.preventDefault();
          router.replace('/(auth)/login');
        }}
        asChild
      >
        <Text style={styles.link}>{t('pages.register.login-link')}</Text>
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
