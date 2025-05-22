import 'i18next';
import 'react-i18next';
import 'i18next-browser-languagedetector';

// Extend i18next types
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: {
        common: {
          [key: string]: string;
        };
      };
    };
    lng: string;
    fallbackLng: string;
    interpolation: {
      escapeValue: boolean;
    };
    detection: {
      order: string[];
      caches: string[];
    };
    react: {
      useSuspense: boolean;
    };
    direction: 'ltr' | 'rtl';
  }
}
