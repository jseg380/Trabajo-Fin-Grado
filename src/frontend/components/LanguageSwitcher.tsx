import React, { useState } from 'react';
import { Menu } from 'react-native-paper';
import { Text } from 'react-native';    // Import Text for styling the emoji
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LANGUAGE_KEY } from '@/localization';

// --- Step 1: Define our mapping objects ---
const languageOptions: { [key: string]: string } = {
  '🇪🇸 Español': 'es-ES',
  '🇬🇧 English': 'en-UK',
};

// A reverse map to get the flag from the language code
const languageFlags: { [key: string]: string } = {
  'es-ES': '🇪🇸',
  'es': '🇪🇸', // Add fallback for base language code
  'en-UK': '🇬🇧',
  'en': '🇬🇧', // Add fallback for base language code
};

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleLanguageChange = async (value: string) => {
    i18n.changeLanguage(value);
    await AsyncStorage.setItem(LANGUAGE_KEY, value);
    closeMenu();
  };

  // --- Step 2: Determine the current flag dynamically ---
  // Get the current language code from i18n. It might be 'en-UK' or just 'en'.
  const currentLangCode = i18n.language; 
  // Find the flag using our map, with a fallback to the globe icon.
  const currentFlag = languageFlags[currentLangCode] || '🌐';

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={
        // --- Step 3: Use the dynamic flag in the anchor ---
        // We wrap the emoji in a Text component to control its size.
        <Text onPress={openMenu} style={{ fontSize: 28, marginRight: 15 }}>
          {currentFlag}
        </Text>
      }
    >
      {Object.entries(languageOptions).map(([label, value]) => (
        <Menu.Item
          key={value}
          onPress={() => handleLanguageChange(value)}
          title={label}
        />
      ))}
    </Menu>
  );
}
