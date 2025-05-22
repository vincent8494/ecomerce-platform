import { LanguageDetectorAsyncModule } from 'i18next';
import 'react-i18next';
import { LanguageDetector } from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

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
    keySeparator: '.';
    nsSeparator: ':';
  }

  // Declare type for t function
  function t(
    key: string | string[],
    defaultValue: string,
    options?: {
      [key: string]: any;
    }
  ): string;

  // Declare type for translation keys
  type Key = string | string[];
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

// Declare types for i18next-browser-languagedetector
declare module 'i18next-browser-languagedetector' {
  export default class LanguageDetector {
    type: 'languageDetector';
    constructor();
  }
}

// Declare types for initReactI18next
declare module 'react-i18next' {
  export const initReactI18next: any;
}

export type Language = 'en' | 'fr' | 'es' | 'ar';
export type LanguageCode = Language;

export interface LanguageDetector extends LanguageDetectorAsyncModule {
  type: 'languageDetector';
  constructor();
}

export interface I18nConfig {
  lng: string;
  fallbackLng: string;
  interpolation: {
    escapeValue: boolean;
  };
  resources: {
    [key: string]: Translation;
  };
  detection: {
    order: string[];
    caches: string[];
  };
}

// Add type for language detection result
export type DetectedLanguage = Language | null;
