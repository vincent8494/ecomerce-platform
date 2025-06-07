import { RefObject, useEffect, useRef, useState } from 'react';

type IntersectionObserverOptions = {
  root?: Element | Document | null;
  rootMargin?: string;
  threshold?: number | number[];
};

/**
 * A custom React hook that observes changes in the intersection of a target element with an ancestor element or viewport.
 * 
 * @template T - The type of the element to observe
 * @param {RefObject<T>} ref - A ref to the element to observe
 * @param {IntersectionObserverOptions} [options] - Options for the IntersectionObserver
 * @returns {boolean} Whether the target element is intersecting with the root
 * 
 * @example
 * const ref = useRef<HTMLDivElement>(null);
 * const isVisible = useIntersectionObserver(ref, {
 *   threshold: 0.5,
 *   rootMargin: '0px 0px -50px 0px',
 * });
 * 
 * return (
 *   <div ref={ref}>
 *     {isVisible ? 'Visible' : 'Not visible'}
 *   </div>
 * );
 */
export function useIntersectionObserver<T extends Element>(
  ref: RefObject<T>,
  options: IntersectionObserverOptions = {}
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const { root = null, rootMargin = '0px', threshold = 0 } = options;

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined' || !ref.current) {
      return;
    }

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        setIsIntersecting(entry.isIntersecting);
      });
    };

    observerRef.current = new IntersectionObserver(handleIntersect, {
      root,
      rootMargin,
      threshold,
    });

    observerRef.current.observe(ref.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [ref, root, rootMargin, threshold]);

  return isIntersecting;
}

/**
 * A custom React hook that returns a ref and a boolean indicating whether the element is intersecting.
 * This is a more React-friendly version of the useIntersectionObserver hook.
 * 
 * @template T - The type of the element to observe
 * @param {IntersectionObserverOptions} [options] - Options for the IntersectionObserver
 * @returns {[RefObject<T | null>, boolean]} A tuple containing a ref and a boolean indicating intersection
 * 
 * @example
 * const [ref, isVisible] = useInView({
 *   threshold: 0.5,
 *   rootMargin: '0px 0px -50px 0px',
 * });
 * 
 * return (
 *   <div ref={ref}>
 *     {isVisible ? 'Visible' : 'Not visible'}
 *   </div>
 * );
 */
export function useInView<T extends Element>(
  options: IntersectionObserverOptions = {}
): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const isIntersecting = useIntersectionObserver(ref, options);
  return [ref, isIntersecting];
}

type UseLazyLoadOptions = {
  root?: Element | Document | null;
  rootMargin?: string;
  threshold?: number | number[];
  once?: boolean;
};

/**
 * A custom React hook that lazy loads an image when it enters the viewport.
 * 
 * @param {string} src - The image source URL
 * @param {UseLazyLoadOptions} [options] - Options for the IntersectionObserver
 * @returns {[React.RefObject<HTMLImageElement>, boolean, boolean]} A tuple containing a ref, a boolean indicating if the image is loaded, and a boolean indicating if the image is in view
 * 
 * @example
 * const [imgRef, loaded] = useLazyLoadImage('path/to/image.jpg');
 * 
 * return (
 *   <img
 *     ref={imgRef}
 *     src={loaded ? 'path/to/image.jpg' : 'placeholder.jpg'}
 *     alt="Lazy loaded"
 *   />
 * );
 */
export function useLazyLoadImage(
  src: string,
  options: UseLazyLoadOptions = {}
): [React.RefObject<HTMLImageElement>, boolean, boolean] {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const { once = true, ...observerOptions } = options;
  
  const { root = null, rootMargin = '0px', threshold = 0 } = observerOptions;

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined' || !imgRef.current) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) {
            observer.unobserve(entry.target);
          }
        } else {
          setIsInView(false);
        }
      });
    }, { root, rootMargin, threshold });

    observer.observe(imgRef.current);

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
      observer.disconnect();
    };
  }, [once, root, rootMargin, threshold]);

  useEffect(() => {
    if (!isInView) return;

    const img = new Image();
    img.src = src;
    
    const handleLoad = () => {
      setIsLoaded(true);
    };
    
    img.addEventListener('load', handleLoad);
    
    return () => {
      img.removeEventListener('load', handleLoad);
    };
  }, [isInView, src]);

  return [imgRef, isLoaded, isInView];
}

export default useIntersectionObserver;
