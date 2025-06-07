import { useState, useCallback } from 'react';
import apiClient from '../utils/apiClient';
import { useCart } from './useCart';
import { useAuth } from './useAuth';

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface PaymentMethod {
  type: 'credit_card' | 'paypal' | 'stripe';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  saveCard?: boolean;
}

export interface OrderItem {
  product: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  _id: string;
  user: string;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod['type'];
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface UseCheckoutReturn {
  loading: boolean;
  error: string | null;
  order: Order | null;
  createOrder: (shippingAddress: ShippingAddress, paymentMethod: PaymentMethod) => Promise<Order>;
  clearError: () => void;
}

export const useCheckout = (): UseCheckoutReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();

  const createOrder = useCallback(async (shippingAddress: ShippingAddress, paymentMethod: PaymentMethod) => {
    if (!user) {
      throw new Error('You must be logged in to create an order');
    }

    if (!cartItems.length) {
      throw new Error('Your cart is empty');
    }

    try {
      setLoading(true);
      setError(null);

      const orderItems = cartItems.map(item => ({
        product: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        image: item.product.images[0] || ''
      }));

      const { data } = await apiClient.post<Order>('/orders', {
        orderItems,
        shippingAddress,
        paymentMethod: paymentMethod.type,
        itemsPrice: cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0),
        shippingPrice: 0, // TODO: Calculate shipping
        taxPrice: 0, // TODO: Calculate tax
        totalPrice: cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0)
      });

      // Clear cart after successful order
      await clearCart();
      
      setOrder(data);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create order';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [cartItems, user, clearCart]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    order,
    createOrder,
    clearError
  };
};

export default useCheckout;
