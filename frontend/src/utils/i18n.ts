import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { i18nConfig } from '../config/i18n.config';
import { getLanguage, setLanguage, removeLanguage } from './storage';
import type { Language } from '../types/i18n';

// Function declarations (needed before initialization)
export const isLanguageSupported = (lng: string): boolean => {
  return ['en', 'fr', 'es', 'ar'].includes(lng);
};

// Configure i18n
i18n
  .use(LanguageDetector as any)
  .use(initReactI18next as any)
  .init(i18nConfig);

// Initialize language from storage or browser
const savedLanguage = getLanguage();
if (savedLanguage && isLanguageSupported(savedLanguage)) {
  i18n.changeLanguage(savedLanguage);
  setLanguage(savedLanguage);
} else {
  const defaultLanguage = import.meta.env.VITE_DEFAULT_LANGUAGE || 'en';
  i18n.changeLanguage(defaultLanguage);
  setLanguage(defaultLanguage);
}

// Function declarations
export const changeLanguage = (lng: Language) => {
  i18n.changeLanguage(lng);
  setLanguage(lng);
  // Update document direction for RTL languages
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
};

export const getCurrentLanguage = () => {
  const currentLanguage = i18n.language.split('-')[0] as Language;
  return {
    en: 'English',
    fr: 'Français',
    es: 'Español',
    ar: 'العربية',
  }[currentLanguage] || 'English';
};

export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat(i18n.language.split('-')[0], {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
  return new Intl.DateTimeFormat(i18n.language.split('-')[0], options).format(new Date(date));
};

export const formatNumber = (number: number, options?: Intl.NumberFormatOptions): string => {
  return new Intl.NumberFormat(i18n.language.split('-')[0], options).format(number);
};

export const t = (key: string | string[], defaultValue: string, options?: { [key: string]: any }): string => {
  return i18n.t(key, defaultValue, options);
};

export const translate = (key: string, defaultValue: string, options?: { [key: string]: any }): string => {
  return i18n.t(key, defaultValue, options);
};

/**
 * Clear language preference from storage and reset to default
 */
export const clearLanguagePreference = (): void => {
  removeLanguage();
  i18n.changeLanguage(import.meta.env.VITE_DEFAULT_LANGUAGE || 'en');
  setLanguage(import.meta.env.VITE_DEFAULT_LANGUAGE || 'en');
};

export default i18n;
