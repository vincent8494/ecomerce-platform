import React, { createContext, useContext, useReducer, useMemo, ReactNode, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Product } from '../types/hooks';

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  itemCount: number;
  total: number;
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'SET_CART'; payload: CartState };

interface CartContextType extends CartState {
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  getItemQuantity: (productId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item._id === action.payload._id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item._id === action.payload._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        
        return {
          ...state,
          items: updatedItems,
          itemCount: state.itemCount + 1,
          total: state.total + action.payload.price,
        };
      }
      
      const newItem = { ...action.payload, quantity: 1 };
      return {
        ...state,
        items: [...state.items, newItem],
        itemCount: state.itemCount + 1,
        total: state.total + action.payload.price,
      };
    }
    
    case 'REMOVE_ITEM': {
      const itemToRemove = state.items.find(item => item._id === action.payload);
      if (!itemToRemove) return state;
      
      const updatedItems = state.items.filter(item => item._id !== action.payload);
      
      return {
        ...state,
        items: updatedItems,
        itemCount: Math.max(0, state.itemCount - itemToRemove.quantity),
        total: Math.max(0, state.total - (itemToRemove.price * itemToRemove.quantity)),
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      if (quantity < 1) {
        return state;
      }
      
      const itemToUpdate = state.items.find(item => item._id === id);
      if (!itemToUpdate) return state;
      
      const quantityDiff = quantity - itemToUpdate.quantity;
      
      const updatedItems = state.items.map(item =>
        item._id === id ? { ...item, quantity } : item
      );
      
      return {
        ...state,
        items: updatedItems,
        itemCount: Math.max(0, state.itemCount + quantityDiff),
        total: Math.max(0, state.total + (itemToUpdate.price * quantityDiff)),
      };
    }
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        itemCount: 0,
        total: 0,
      };
      
    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen,
      };
      
    case 'SET_CART':
      return action.payload;
      
    default:
      return state;
  }
};

const CART_STORAGE_KEY = 'cart';

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [savedCart, saveCart] = useLocalStorage<CartState>(CART_STORAGE_KEY, {
    items: [],
    itemCount: 0,
    total: 0,
    isOpen: false,
  });

  const [state, dispatch] = useReducer(cartReducer, savedCart);

  // Save cart to localStorage whenever it changes
  React.useEffect(() => {
    saveCart(state);
  }, [state, saveCart]);

  const addToCart = useCallback((product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const toggleCart = useCallback(() => {
    dispatch({ type: 'TOGGLE_CART' });
  }, []);

  const getItemQuantity = useCallback((productId: string): number => {
    const item = state.items.find(item => item._id === productId);
    return item ? item.quantity : 0;
  }, [state.items]);

  const value = useMemo(() => ({
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    getItemQuantity,
  }), [
    state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    getItemQuantity,
  ]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
