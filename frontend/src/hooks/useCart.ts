import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { setCartItems, getCartItems } from '../utils/storage';

export interface CartItem {
  product: {
    _id: string;
    name: string;
    price: number;
    images: string[];
    stock: number;
  };
  quantity: number;
}

export const useCart = () => {
  const { t } = useTranslation();
  const [cartItems, setCartItemsState] = useState<CartItem[]>(getCartItems() || []);

  const addToCart = useCallback((product: any) => {
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
      throw new Error(t('common.error_adding_to_cart' as any));
    }
  }, [cartItems, t]);

  const removeFromCart = useCallback((productId: string) => {
    try {
      const updatedItems = cartItems.filter(item => item.product._id !== productId);
      setCartItemsState(updatedItems);
      setCartItems(updatedItems);
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw new Error(t('common.error_removing_from_cart' as any));
    }
  }, [cartItems, t]);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    try {
      const updatedItems = cartItems.map(item => 
        item.product._id === productId 
          ? { ...item, quantity } 
          : item
      );
      setCartItemsState(updatedItems);
      setCartItems(updatedItems);
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw new Error(t('common.error_updating_quantity' as any));
    }
  }, [cartItems, t]);

  const clearCart = useCallback(() => {
    try {
      setCartItemsState([]);
      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw new Error(t('common.error_clearing_cart' as any));
    }
  }, [t]);

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
};
