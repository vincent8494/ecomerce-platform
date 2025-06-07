import { useState, useCallback } from 'react';

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState<string[]>([]);
  
  const addToWishlist = useCallback((product: any) => {
    setWishlist(prev => [...prev, product._id]);
    // Add any wishlist API call here if needed
  }, []);
  
  const removeFromWishlist = useCallback((productId: string) => {
    setWishlist(prev => prev.filter(id => id !== productId));
    // Add any wishlist API call here if needed
  }, []);
  
  const toggleWishlist = useCallback((product: any) => {
    if (wishlist.includes(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  }, [wishlist, addToWishlist, removeFromWishlist]);
  
  const isInWishlist = useCallback((productId: string) => {
    return wishlist.includes(productId);
  }, [wishlist]);
  
  return { 
    wishlist, 
    addToWishlist, 
    removeFromWishlist, 
    toggleWishlist, 
    isInWishlist 
  };
};

export default useWishlist;
