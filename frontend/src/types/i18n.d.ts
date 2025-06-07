import 'i18next';
import 'react-i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: {
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
          error_loading_categories: string;
          [key: string]: string;
        };
      };
    };
  }
}

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: {
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
          error_loading_categories: string;
          [key: string]: string;
        };
      };
    };
  }
}
