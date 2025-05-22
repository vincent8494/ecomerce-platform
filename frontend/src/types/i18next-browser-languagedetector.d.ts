declare module 'i18next-browser-languagedetector' {
  export default class LanguageDetector {
    constructor(options?: any);
    init(): Promise<void>;
    detect(): Promise<string>;
    cacheUserLanguage(lang: string): void;
  }
}
