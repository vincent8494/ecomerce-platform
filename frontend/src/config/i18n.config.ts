import 'i18next';
import 'react-i18next';
import type { InitOptions } from 'i18next';

// Import translations
import en from '../../locales/en/translation.json';
import fr from '../../locales/fr/translation.json';
import es from '../../locales/es/translation.json';
import ar from '../../locales/ar/translation.json';

export const i18nConfig: InitOptions = {
  resources: {
    en: { translation: en },
    fr: { translation: fr },
    es: { translation: es },
    ar: { translation: ar },
  },
  lng: import.meta.env.VITE_DEFAULT_LANGUAGE || 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  detection: {
    order: ['localStorage', 'navigator'] as string[],
    caches: ['localStorage'] as string[],
  },
  react: {
    useSuspense: false,
  }
};
