import { readdirSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set path to locale dir with translations
const LOCALE_DIR = join(__dirname, 'locales');
// The "source" translation, i.e. the reference with the keys to implement is en
const SOURCE_LANG = 'en.json';

// Helper: Flatten nested keys into paths (e.g., 'intro.welcome')
const getNestedKeys = (obj, parent = '') => {
  return Object.keys(obj).reduce((keys, key) => {
    const fullPath = parent ? `${parent}.${key}` : key;
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      return [...keys, ...getNestedKeys(obj[key], fullPath)];
    }
    return [...keys, fullPath];
  }, []);
};

// Load all locale files
const sourceData = JSON.parse(readFileSync(resolve(LOCALE_DIR, SOURCE_LANG), 'utf-8'))
const sourceKeys = getNestedKeys(sourceData);
const otherLangs = readdirSync(LOCALE_DIR)
  .filter(file => file !== SOURCE_LANG && file.endsWith('.json'));

let hasErrors = false;

otherLangs.forEach(file => {
  const lang = file.split('.')[0];
  const langData = JSON.parse(readFileSync(resolve(LOCALE_DIR, file), 'utf-8'))
  const langKeys = getNestedKeys(langData);

  // Check 1: Missing keys in this language (compared to the source language)
  const missingKeys = sourceKeys.filter(key => !langKeys.includes(key));
  if (missingKeys.length > 0) {
    console.error(`❌ [${lang}] Missing keys (vs. English):`, missingKeys);
    hasErrors = true;
  }

  // Check 2: Extra keys present in this language but not in the source language
  const extraKeys = langKeys.filter(key => !sourceKeys.includes(key));
  if (extraKeys.length > 0) {
    console.error(`⚠️ [${lang}] Extra keys (not in English):`, extraKeys);
    hasErrors = true;
  }
});

if (!hasErrors) {
  console.log('✅ All translation files are in sync!');
} else {
  process.exit(1);      // Fail CI/pre-commit hook
}
