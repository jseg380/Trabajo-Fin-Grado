import en from './locales/en.json';
import es from './locales/es.json';

const translations = {
  en,
  es
};

let currentLanguage = 'en';

export const setLanguage = (lang) => {
  currentLanguage = translations[lang] ? lang : 'en';
};

// Helper to traverse nested keys (e.g., 'intro.welcome.first')
const getNestedTranslation = (obj, keyPath) => {
  return keyPath.split('.').reduce((acc, key) => acc?.[key], obj);
};

export const t = (keyPath) => {
  const translation = getNestedTranslation(translations[currentLanguage], keyPath);
  const fallback = getNestedTranslation(translations['en'], keyPath);
  if (!translation && __DEV__) {
    console.warn(`Missing translation for key: ${keyPath}`);
  }
  return translation || fallback || keyPath;  // Fallback chain
};
