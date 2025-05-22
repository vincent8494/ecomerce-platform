// Storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  CART_ITEMS: 'cartItems',
  SHIPPING_ADDRESS: 'shippingAddress',
  PAYMENT_METHOD: 'paymentMethod',
  USER: 'user',
  THEME: 'theme',
  REDIRECT_PATH: 'redirectPath',
  LANGUAGE: 'language',
} as const;

// Type for storage keys
type StorageKey = keyof typeof STORAGE_KEYS;
type StorageValue = typeof STORAGE_KEYS[StorageKey];

/**
 * Get item from localStorage
 */
export const getItem = <T>(key: StorageValue): T | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error getting item ${key} from localStorage:`, error);
    return null;
  }
};

/**
 * Set item in localStorage
 */
export const setItem = <T>(key: StorageValue, value: T): void => {
  if (typeof window === 'undefined') return;
  
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting item ${key} in localStorage:`, error);
  }
};

/**
 * Remove item from localStorage
 */
export const removeItem = (key: StorageValue): void => {
  if (typeof window === 'undefined') return;
  
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item ${key} from localStorage:`, error);
  }
};

/**
 * Clear all items from localStorage
 */
export const clear = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    window.localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

/**
 * Get authentication token from localStorage
 */
export const getToken = (): string | null => {
  return getItem<string>(STORAGE_KEYS.TOKEN);
};

/**
 * Set authentication token in localStorage
 */
export const setToken = (token: string): void => {
  setItem(STORAGE_KEYS.TOKEN, token);
};

/**
 * Remove authentication token from localStorage
 */
export const removeToken = (): void => {
  removeItem(STORAGE_KEYS.TOKEN);
};

/**
 * Get user data from localStorage
 */
export const getUser = <T>(): T | null => {
  return getItem<T>(STORAGE_KEYS.USER);
};

/**
 * Set user data in localStorage
 */
export const setUser = <T>(user: T): void => {
  setItem(STORAGE_KEYS.USER, user);
};

/**
 * Remove user data from localStorage
 */
export const removeUser = (): void => {
  removeItem(STORAGE_KEYS.USER);
};

/**
 * Get cart items from localStorage
 */
export const getCartItems = <T>(): T | null => {
  return getItem<T>(STORAGE_KEYS.CART_ITEMS);
};

/**
 * Set cart items in localStorage
 */
export const setCartItems = <T>(items: T): void => {
  setItem(STORAGE_KEYS.CART_ITEMS, items);
};

/**
 * Remove cart items from localStorage
 */
export const removeCartItems = (): void => {
  removeItem(STORAGE_KEYS.CART_ITEMS);
};

/**
 * Get shipping address from localStorage
 */
export const getShippingAddress = <T>(): T | null => {
  return getItem<T>(STORAGE_KEYS.SHIPPING_ADDRESS);
};

/**
 * Set shipping address in localStorage
 */
export const setShippingAddress = <T>(address: T): void => {
  setItem(STORAGE_KEYS.SHIPPING_ADDRESS, address);
};

/**
 * Remove shipping address from localStorage
 */
export const removeShippingAddress = (): void => {
  removeItem(STORAGE_KEYS.SHIPPING_ADDRESS);
};

/**
 * Get payment method from localStorage
 */
export const getPaymentMethod = (): string | null => {
  return getItem<string>(STORAGE_KEYS.PAYMENT_METHOD);
};

/**
 * Set payment method in localStorage
 */
export const setPaymentMethod = (method: string): void => {
  setItem(STORAGE_KEYS.PAYMENT_METHOD, method);
};

/**
 * Remove payment method from localStorage
 */
export const removePaymentMethod = (): void => {
  removeItem(STORAGE_KEYS.PAYMENT_METHOD);
};

/**
 * Get theme preference from localStorage
 */
export const getTheme = (): 'light' | 'dark' => {
  return getItem<'light' | 'dark'>(STORAGE_KEYS.THEME) || 'light';
};

/**
 * Set theme preference in localStorage
 */
export const setTheme = (theme: 'light' | 'dark'): void => {
  setItem(STORAGE_KEYS.THEME, theme);
};

/**
 * Get redirect path from localStorage
 */
export const getRedirectPath = (): string | null => {
  return getItem<string>(STORAGE_KEYS.REDIRECT_PATH);
};

/**
 * Set redirect path in localStorage
 */
export const setRedirectPath = (path: string): void => {
  setItem(STORAGE_KEYS.REDIRECT_PATH, path);
};

/**
 * Remove redirect path from localStorage
 */
export const removeRedirectPath = (): void => {
  removeItem(STORAGE_KEYS.REDIRECT_PATH);
};

/**
 * Clear all authentication related data from localStorage
 */
export const clearAuthData = (): void => {
  removeToken();
  removeUser();
  removeRedirectPath();
};

/**
 * Clear all cart related data from localStorage
 */
export const clearCartData = (): void => {
  removeCartItems();
  removeShippingAddress();
  removePaymentMethod();
};

/**
 * Get language preference from localStorage
 */
export const getLanguage = (): string => {
  const language = getItem<string>(STORAGE_KEYS.LANGUAGE);
  return language || 'en';
};

/**
 * Set language preference in localStorage
 */
export const setLanguage = (language: string): void => {
  if (language) {
    setItem(STORAGE_KEYS.LANGUAGE, language);
  }
};

/**
 * Remove language preference from localStorage
 */
export const removeLanguage = (): void => {
  removeItem(STORAGE_KEYS.LANGUAGE);
};
