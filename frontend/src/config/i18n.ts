import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { i18nConfig } from './i18n.config';
import type { Module } from 'i18next';

// Configure i18n
i18n
  .use(LanguageDetector as unknown as Module)
  .use(initReactI18next)
  .init(i18nConfig);

export default i18n;
