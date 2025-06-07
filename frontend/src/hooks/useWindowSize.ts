import { useState, useEffect } from 'react';

interface WindowSize {
  width: number | undefined;
  height: number | undefined;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
}

const MOBILE_BREAKPOINT = 768; // px
const TABLET_BREAKPOINT = 1024; // px

const DESKTOP_BREAKPOINT = 1280; // px

/**
 * A custom React hook that tracks the size of the browser window.
 * 
 * @returns {WindowSize} An object containing the current window dimensions and breakpoint information
 * 
 * @example
 * const { width, height, isMobile, breakpoint } = useWindowSize();
 * 
 * return (
 *   <div>
 *     Window size: {width} x {height}
 *     {isMobile ? 'Mobile view' : 'Desktop view'}
 *     Current breakpoint: {breakpoint}
 *   </div>
 * );
 */
export function useWindowSize(): WindowSize {
  // Initialize state with undefined width/height so server and client renders match
  const [windowSize, setWindowSize] = useState<Omit<WindowSize, 'breakpoint'>>({
    width: undefined,
    height: undefined,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  });

  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') {
      return;
    }


    // Handler to call on window resize
    const handleResize = () => {
      // Set window width/height to state
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Determine device type based on width
      const isMobile = width < MOBILE_BREAKPOINT;
      const isTablet = width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT;
      const isDesktop = width >= TABLET_BREAKPOINT;

      setWindowSize({
        width,
        height,
        isMobile,
        isTablet,
        isDesktop,
      });
    };

    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Call handler right away so state gets updated with initial window size
    handleResize();
    
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount and unmount

  // Determine the current breakpoint
  const breakpoint = (() => {
    if (typeof windowSize.width === 'undefined') return 'md' as const; // Default to medium
    
    if (windowSize.width < 576) return 'xs' as const;
    if (windowSize.width < 768) return 'sm' as const;
    if (windowSize.width < 992) return 'md' as const;
    if (windowSize.width < 1200) return 'lg' as const;
    if (windowSize.width < 1400) return 'xl' as const;
    return 'xxl' as const;
  })();

  return {
    ...windowSize,
    breakpoint,
  };
}

export default useWindowSize;
