import 'i18next';
import 'react-i18next';
import 'i18next-browser-languagedetector';

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

declare module 'i18next-browser-languagedetector' {
  export default class LanguageDetector {
    type: 'languageDetector';
    constructor();
  }
}

declare module 'react-i18next' {
  export { initReactI18next };
}
