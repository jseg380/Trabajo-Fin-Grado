import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import translationEn from './locales/en-UK/translations.json';
import translationEs from './locales/es-ES/translations.json';

const resources = {
  'en-UK': { translation: translationEn },
  en: { translation: translationEn },
  'es-ES': { translation: translationEs },
  es: { translation: translationEs },
};

export const LANGUAGE_KEY = '@app_language';

const initI18n = async () => {
  // During Expo building process with Metro bundler this module will be
  // imported and thus initialized. At that moment window is undefined, causing
  // i18n call to this function fail, with the error being caught in the catch
  // phase
  if (typeof window === 'undefined') return;

  try {
    // Try to get saved language preference
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);

    // Determine which language to use
    let selectedLanguage = savedLanguage;

    if (!selectedLanguage) {
      // If no saved language, use device locale or fallback
      const deviceLocales = Localization.getLocales();
      const deviceLocale = deviceLocales[0]?.languageTag || 'en-UK';
      const languageCode = deviceLocale.split('-')[0];

      // Try exact locale match first
      if (deviceLocale in resources) {
        selectedLanguage = deviceLocale;
      }

      // Then try language code match
      else if (languageCode in resources) {
        selectedLanguage = languageCode;
      } else {
        selectedLanguage = 'en-UK';
      }
    }

    await i18n.use(initReactI18next).init({
      resources,
      lng: selectedLanguage,
      fallbackLng: {
        'en-*': ['en-UK', 'en'],
        'es-*': ['es-ES', 'es', 'en-UK'],
        default: ['en-UK'],
      },
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });

    // Save the selected language
    if (!savedLanguage) {
      await AsyncStorage.setItem(LANGUAGE_KEY, selectedLanguage);
    }
  } catch (error) {
    console.error('Error initializing i18n:', error);

    // Initialize with defaults if there's an error
    await i18n.use(initReactI18next).init({
      resources,
      lng: 'en-UK',
      fallbackLng: 'en-UK',
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });
  }
};

export const i18nInitPromise = initI18n();

export default i18n;
