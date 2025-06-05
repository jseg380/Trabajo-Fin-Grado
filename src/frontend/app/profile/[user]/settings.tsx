import React, { useState } from 'react';
import { Menu, Divider, Button } from 'react-native-paper';
import { Text, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LANGUAGE_KEY } from '@/localization';
import { Stack, useLocalSearchParams } from 'expo-router';
import TitleSetter from '@/components/TitleSetter';

type LanguageOption = {
  [key: string]: string;
};

const languageOptions: LanguageOption = {
  'Español (España)': 'es-ES',
  'English (United Kingdom)': 'en-UK',
};

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [selectedLanguageLabel, setSelectedLanguageLabel] = useState<string | null>(null);
  const { user: username } = useLocalSearchParams();

  const handleLanguageChange = async (label: string, value: string) => {
    setSelectedLanguageLabel(label);
    i18n.changeLanguage(value);
    setIsMenuVisible(false);
    await AsyncStorage.setItem(LANGUAGE_KEY, value);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: t('pages.settings.title') + ': ' + username,
        }}
      />
      <TitleSetter title={t('pages.settings.title')} />
      <Text style={styles.title}>{t('language.meta')}</Text>

      <View style={styles.menuContainer}>
        <Menu
          visible={isMenuVisible}
          onDismiss={() => setIsMenuVisible(false)}
          anchor={
            <Button onPress={() => setIsMenuVisible(true)}>{selectedLanguageLabel || t('language.select')}</Button>
          }
        >
          {Object.entries(languageOptions).map(([label, value], index) => (
            <React.Fragment key={value}>
              <Menu.Item
                onPress={() => handleLanguageChange(label, value)}
                title={label}
              />
              {index < Object.keys(languageOptions).length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </Menu>
      </View>
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
    color: 'black',
  },
  menuContainer: {
    padding: 20,
  },
});
