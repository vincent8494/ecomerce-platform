import { useState, useCallback } from 'react';
import { WishlistItem, Product } from '../types/hooks';

interface UseWishlistReturn {
  wishlist: WishlistItem[];
  isWishlistOpen: boolean;
  addToWishlist: (product: Product) => boolean;
  removeFromWishlist: (productId: string) => boolean;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: () => void;
  closeWishlist: () => void;
}

export const useWishlist = (): UseWishlistReturn => {

  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const saveWishlist = useCallback((items: WishlistItem[]) => {
    localStorage.setItem('wishlist', JSON.stringify(items));
  }, []);

  const addToWishlist = useCallback((product: Product) => {
    try {
      const existingItem = wishlist.find(item => item.product._id === product._id);
      
      if (!existingItem) {
        const newWishlist = [
          ...wishlist,
          { product, addedAt: new Date() }
        ];
        setWishlist(newWishlist);
        saveWishlist(newWishlist);
        return true;
      }
      return false;
    } catch (error) {
      throw new Error('Failed to add item to wishlist');
    }
  }, [wishlist, saveWishlist]);

  const removeFromWishlist = useCallback((productId: string) => {
    try {
      const newWishlist = wishlist.filter(item => item.product._id !== productId);
      setWishlist(newWishlist);
      saveWishlist(newWishlist);
      return true;
    } catch (error) {
      throw new Error('Failed to remove item from wishlist');
    }
  }, [wishlist, saveWishlist]);

  const isInWishlist = useCallback((productId: string) => {
    return wishlist.some(item => item.product._id === productId);
  }, [wishlist]);

  const toggleWishlist = useCallback(() => {
    setIsWishlistOpen(prev => !prev);
  }, []);

  const closeWishlist = useCallback(() => {
    setIsWishlistOpen(false);
  }, []);

  return {
    wishlist,
    isWishlistOpen,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    closeWishlist,
  };
};

export default useWishlist;
