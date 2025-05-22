import 'i18next';
import 'react-i18next';

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
  }
}

// Declare module augmentation for react-i18next
declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: {
        common: {
          [key: string]: string;
        };
      };
    };
  }
}
