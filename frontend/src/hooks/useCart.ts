import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { setCartItems, getCartItems } from '../utils/storage';
import { CartItem, Product } from '../types/hooks';

interface UseCartReturn {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

export const useCart = (): UseCartReturn => {
  const [cartItems, setCartItemsState] = useState<CartItem[]>(getCartItems() || []);

  const addToCart = useCallback((product: Product) => {
    try {
      const existingItem = cartItems.find(item => item.product._id === product._id);
      
      if (existingItem) {
        const updatedItems = cartItems.map(item => 
          item.product._id === product._id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
        setCartItemsState(updatedItems);
        setCartItems(updatedItems);
      } else {
        const newItem: CartItem = {
          product,
          quantity: 1,
        };
        const updatedItems = [...cartItems, newItem];
        setCartItemsState(updatedItems);
        setCartItems(updatedItems);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw new Error('Failed to add item to cart');
    }
  }, [cartItems]);

  const removeFromCart = useCallback((productId: string) => {
    try {
      const updatedItems = cartItems.filter(item => item.product._id !== productId);
      setCartItemsState(updatedItems);
      setCartItems(updatedItems);
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw new Error('Failed to remove item from cart');
    }
  }, [cartItems]);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    try {
      const updatedItems = cartItems.map(item => 
        item.product._id === productId ? { ...item, quantity } : item
      );
      setCartItemsState(updatedItems);
      setCartItems(updatedItems);
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
      throw new Error('Failed to update cart');
    }
  }, [cartItems, removeFromCart]);

  const clearCart = useCallback(() => {
    try {
      setCartItemsState([]);
      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw new Error('Failed to clear cart');
    }
  }, []);

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal: () => cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0),
    getCartCount: () => cartItems.reduce((count, item) => count + item.quantity, 0),
  } as const;
};
