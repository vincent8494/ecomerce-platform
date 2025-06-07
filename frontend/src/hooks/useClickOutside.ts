import { RefObject, useEffect, useRef } from 'react';

type Event = MouseEvent | TouchEvent;

/**
 * A custom React hook that triggers a callback when a click occurs outside of the specified element(s).
 * 
 * @param {RefObject<HTMLElement> | RefObject<HTMLElement>[]} ref - A single ref or an array of refs to check for outside clicks
 * @param {(event: Event) => void} callback - The callback function to execute when a click outside is detected
 * @param {boolean} [enabled=true] - Whether the event listener should be active
 * @param {string} [ignoreClass] - A class name to ignore clicks on elements with this class
 * 
 * @example
 * const ref = useRef<HTMLDivElement>(null);
 * 
 * useClickOutside(ref, () => {
 *   // Handle click outside
 *   console.log('Clicked outside!');
 * });
 * 
 * return (
 *   <div ref={ref}>
 *     Click outside this element
 *   </div>
 * );
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T> | RefObject<T>[],
  callback: (event: Event) => void,
  enabled: boolean = true,
  ignoreClass?: string
): void {
  const callbackRef = useRef(callback);
  
  // Update the callback ref if the callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: Event) => {
      // If ignoreClass is provided and the clicked element or any of its parents have that class, ignore the click
      if (ignoreClass && event.target instanceof Element) {
        const target = event.target as Element;
        if (target.closest(`.${ignoreClass}`)) {
          return;
        }
      }

      // Handle single ref
      if (!Array.isArray(ref)) {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          callbackRef.current(event);
        }
        return;
      }

      // Handle array of refs
      const isOutsideAll = ref.every(
        r => !r.current || !r.current.contains(event.target as Node)
      );

      if (isOutsideAll) {
        callbackRef.current(event);
      }
    };

    // Use capture phase to catch events before they reach the target
    const options = { capture: true };
    
    // Add event listeners
    document.addEventListener('mousedown', handleClickOutside, options);
    document.addEventListener('touchstart', handleClickOutside, options);

    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, options);
      document.removeEventListener('touchstart', handleClickOutside, options);
    };
  }, [ref, enabled, ignoreClass]);
}

export default useClickOutside;
