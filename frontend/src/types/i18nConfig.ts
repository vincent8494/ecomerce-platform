import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Declare custom type for translation keys
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: {
        // Common translations
        common: {
          search: string;
          search_products: string;
          categories: string;
          price_range: string;
          min_price: string;
          max_price: string;
          rating: string;
          sort_by: string;
          newest_first: string;
          price_low_to_high: string;
          price_high_to_low: string;
          highest_rating: string;
          error_loading_products: string;
        };
      };
    };
  }
}

// i18n configuration
i18n
  .use(LanguageDetector as any) // Type assertion to fix type issues
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          common: {
            search: 'Search',
            search_products: 'Search products...',
            categories: 'Categories',
            price_range: 'Price Range',
            min_price: 'Min Price',
            max_price: 'Max Price',
            rating: 'Rating',
            sort_by: 'Sort By',
            newest_first: 'Newest First',
            price_low_to_high: 'Price: Low to High',
            price_high_to_low: 'Price: High to Low',
            highest_rating: 'Highest Rating',
            error_loading_products: 'Error loading products',
          },
        },
      },
    },
    lng: 'en',
    fallbackLng: 'en',
    defaultNS: 'translation',
    ns: ['translation'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
