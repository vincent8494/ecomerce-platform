import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * A custom React hook that delays invoking a function until after a specified wait time
 * has elapsed since the last time it was invoked.
 * 
 * @template T - The type of the value being debounced
 * @param {T} value - The value to be debounced
 * @param {number} delay - The number of milliseconds to delay
 * @returns {T} The debounced value
 * 
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 * 
 * useEffect(() => {
 *   if (debouncedSearchTerm) {
 *     // Perform search API call
 *     searchProducts(debouncedSearchTerm);
 *   }
 * }, [debouncedSearchTerm]);
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Set up the timeout
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timeout on unmount or when value/delay changes
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * A custom React hook that returns a debounced version of the provided callback function.
 * The debounced function will only be called after the specified delay has passed
 * since the last time it was invoked.
 * 
 * @template T - The type of the function being debounced
 * @param {T} callback - The function to debounce
 * @param {number} delay - The number of milliseconds to delay
 * @param {any[]} [deps=[]] - Dependencies array to recreate the debounced function when they change
 * @returns {T} The debounced function
 * 
 * @example
 * const handleSearch = useDebouncedCallback((searchTerm: string) => {
 *   // Perform search with searchTerm
 *   searchProducts(searchTerm);
 * }, 500);
 * 
 * // In your component
 * <input
 *   type="text"
 *   onChange={(e) => handleSearch(e.target.value)}
 * />
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: any[] = []
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Store the latest callback in a ref to avoid unnecessary re-renders
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  // Clean up the timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Create the debounced function
  const debouncedCallback = useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callbackRef.current(...args);
    }, delay);
  }, [delay, ...deps]);

  return debouncedCallback;
}

/**
 * A custom React hook that combines both debounced value and callback functionality.
 * It provides both the debounced value and a setter function that's debounced.
 * 
 * @template T - The type of the value being debounced
 * @param {T} initialValue - The initial value
 * @param {number} delay - The number of milliseconds to delay
 * @returns {[T, (value: T) => void]} A tuple with the debounced value and a setter function
 * 
 * @example
 * const [searchTerm, setSearchTerm] = useDebouncedState('', 500);
 * 
 * useEffect(() => {
 *   if (searchTerm) {
 *     // Perform search with searchTerm
 *     searchProducts(searchTerm);
 *   }
 * }, [searchTerm]);
 * 
 * // In your component
 * <input
 *   type="text"
 *   onChange={(e) => setSearchTerm(e.target.value)}
 *   value={searchTerm}
 * />
 */
export function useDebouncedState<T>(
  initialValue: T,
  delay: number
): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(initialValue);
  const debouncedValue = useDebounce(value, delay);
  
  return [debouncedValue, setValue];
}

// Re-export the main hook as default
export default useDebounce;
