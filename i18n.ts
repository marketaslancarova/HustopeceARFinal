import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import cs from './locales/cs';
import en from './locales/en';

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    lng: Localization.locale.startsWith('cs') ? 'cs' : 'en',
    fallbackLng: 'en',
    resources: {
      cs: { translation: cs },
      en: { translation: en },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
