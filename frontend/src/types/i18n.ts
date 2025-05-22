export type Language = 'en' | 'fr' | 'es' | 'ar';

export interface I18nConfig {
  resources: {
    [key: string]: {
      translation: Record<string, any>;
    };
  };
  lng: Language;
  fallbackLng: Language;
  interpolation: {
    escapeValue: boolean;
  };
  detection: {
    order: string[];
    caches: string[];
  };
}

export interface I18nState {
  language: Language;
  changeLanguage: (lng: Language) => void;
  getLanguageName: (lng: Language) => string;
  getLanguageDirection: (lng: Language) => 'ltr' | 'rtl';
  isLanguageSupported: (lng: string) => lng is Language;
  getSupportedLanguages: () => Language[];
}

export interface I18nModule {
  init: (config: I18nConfig) => Promise<void>;
  changeLanguage: (lng: Language) => Promise<void>;
  language: Language;
  t: (key: string, options?: any) => string;
  use: (detector: any) => this;
}
