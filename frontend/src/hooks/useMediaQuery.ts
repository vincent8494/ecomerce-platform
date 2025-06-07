import { useState, useEffect } from 'react';

/**
 * A custom React hook that tracks the state of a CSS media query.
 * 
 * @param query - The media query string (e.g., '(min-width: 768px)').
 * @param defaultMatches - The default value to return before the component mounts.
 * @returns A boolean indicating whether the media query matches.
 * 
 * @example
 * const isMobile = useMediaQuery('(max-width: 767px)');
 * const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
 */
export function useMediaQuery(
  query: string, 
  defaultMatches: boolean = false
): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return defaultMatches;
    }
    
    try {
      return window.matchMedia(query).matches;
    } catch (error) {
      console.error('Error in useMediaQuery:', error);
      return defaultMatches;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    
    // Update the state with the current matches value
    const updateMatches = () => {
      setMatches(mediaQuery.matches);
    };
    
    // Set the initial value
    updateMatches();
    
    // Add event listener for changes
    try {
      // Modern browsers support addEventListener on MediaQueryList
      if (typeof mediaQuery.addEventListener === 'function') {
        mediaQuery.addEventListener('change', updateMatches);
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(updateMatches);
      }
    } catch (error) {
      console.error('Error adding media query listener:', error);
    }
    
    // Clean up
    return () => {
      try {
        if (typeof mediaQuery.removeEventListener === 'function') {
          mediaQuery.removeEventListener('change', updateMatches);
        } else {
          mediaQuery.removeListener(updateMatches);
        }
      } catch (error) {
        console.error('Error removing media query listener:', error);
      }
    };
  }, [query]);

  return matches;
}

/**
 * A set of pre-defined media query hooks for common breakpoints.
 */
export const useMediaQueries = () => {
  const isXs = useMediaQuery('(max-width: 575.98px)');
  const isSm = useMediaQuery('(min-width: 576px) and (max-width: 767.98px)');
  const isMd = useMediaQuery('(min-width: 768px) and (max-width: 991.98px)');
  const isLg = useMediaQuery('(min-width: 992px) and (max-width: 1199.98px)');
  const isXl = useMediaQuery('(min-width: 1200px) and (max-width: 1399.98px)');
  const isXxl = useMediaQuery('(min-width: 1400px)');
  
  const isMobile = useMediaQuery('(max-width: 767.98px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023.98px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  
  const isPortrait = useMediaQuery('(orientation: portrait)');
  const isLandscape = useMediaQuery('(orientation: landscape)');
  
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const prefersLightMode = useMediaQuery('(prefers-color-scheme: light)');
  
  const isTouchDevice = useMediaQuery('(hover: none) and (pointer: coarse)');
  const isHoverable = useMediaQuery('(hover: hover) and (pointer: fine)');
  
  // Responsive breakpoints from theme
  const breakpoints = {
    xs: isXs,
    sm: isSm,
    md: isMd,
    lg: isLg,
    xl: isXl,
    xxl: isXxl,
  };
  
  // Current breakpoint
  const currentBreakpoint = (() => {
    if (isXxl) return 'xxl';
    if (isXl) return 'xl';
    if (isLg) return 'lg';
    if (isMd) return 'md';
    if (isSm) return 'sm';
    return 'xs';
  })();
  
  return {
    // Breakpoints
    ...breakpoints,
    currentBreakpoint,
    
    // Device types
    isMobile,
    isTablet,
    isDesktop,
    isTouchDevice,
    isHoverable,
    
    // Orientation
    isPortrait,
    isLandscape,
    
    // User preferences
    prefersReducedMotion,
    prefersDarkMode,
    prefersLightMode,
    
    // Media query functions
    up: (breakpoint: keyof typeof breakpoints) => {
      const breakpointMap = {
        xs: '(min-width: 0px)',
        sm: '(min-width: 576px)',
        md: '(min-width: 768px)',
        lg: '(min-width: 992px)',
        xl: '(min-width: 1200px)',
        xxl: '(min-width: 1400px)',
      };
      return useMediaQuery(breakpointMap[breakpoint] || breakpointMap.xs);
    },
    
    down: (breakpoint: keyof typeof breakpoints) => {
      const breakpointMap = {
        xs: '(max-width: 575.98px)',
        sm: '(max-width: 767.98px)',
        md: '(max-width: 991.98px)',
        lg: '(max-width: 1199.98px)',
        xl: '(max-width: 1399.98px)',
        xxl: '(max-width: 10000px)', // Always true
      };
      return useMediaQuery(breakpointMap[breakpoint] || breakpointMap.xxl);
    },
    
    between: (min: keyof typeof breakpoints, max: keyof typeof breakpoints) => {
      const minMap = {
        xs: '0',
        sm: '576px',
        md: '768px',
        lg: '992px',
        xl: '1200px',
        xxl: '1400px',
      };
      
      const maxMap = {
        xs: '575.98px',
        sm: '767.98px',
        md: '991.98px',
        lg: '1199.98px',
        xl: '1399.98px',
        xxl: '10000px',
      };
      
      const minWidth = minMap[min] || minMap.xs;
      const maxWidth = maxMap[max] || maxMap.xxl;
      
      return useMediaQuery(`(min-width: ${minWidth}) and (max-width: ${maxWidth})`);
    },
  };
};

// Re-export the main hook as default
export default useMediaQuery;
