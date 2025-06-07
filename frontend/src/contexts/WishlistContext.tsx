import React, { createContext, useContext, useReducer, useMemo, ReactNode, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Product } from '../types/hooks';

interface WishlistState {
  items: Product[];
  isOpen: boolean;
}

type WishlistAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'TOGGLE_WISHLIST' }
  | { type: 'SET_WISHLIST'; payload: WishlistState };

interface WishlistContextType extends WishlistState {
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const wishlistReducer = (state: WishlistState, action: WishlistAction): WishlistState => {
  switch (action.type) {
    case 'ADD_ITEM':
      if (state.items.some(item => item._id === action.payload._id)) {
        return state; // Item already in wishlist
      }
      return {
        ...state,
        items: [...state.items, action.payload],
      };
      
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item._id !== action.payload),
      };
      
    case 'TOGGLE_WISHLIST':
      return {
        ...state,
        isOpen: !state.isOpen,
      };
      
    case 'SET_WISHLIST':
      return action.payload;
      
    default:
      return state;
  }
};

const WISHLIST_STORAGE_KEY = 'wishlist';

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [savedWishlist, saveWishlist] = useLocalStorage<WishlistState>(WISHLIST_STORAGE_KEY, {
    items: [],
    isOpen: false,
  });

  const [state, dispatch] = useReducer(wishlistReducer, savedWishlist);

  // Save wishlist to localStorage whenever it changes
  React.useEffect(() => {
    saveWishlist(state);
  }, [state, saveWishlist]);

  const addToWishlist = useCallback((product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  }, []);

  const toggleWishlist = useCallback(() => {
    dispatch({ type: 'TOGGLE_WISHLIST' });
  }, []);

  const isInWishlist = useCallback((productId: string): boolean => {
    return state.items.some(item => item._id === productId);
  }, [state.items]);

  const clearWishlist = useCallback(() => {
    dispatch({ type: 'SET_WISHLIST', payload: { items: [], isOpen: false } });
  }, []);

  const value = useMemo(() => ({
    ...state,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
  }), [
    state,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
  ]);

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
