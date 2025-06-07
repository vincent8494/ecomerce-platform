import { useState, useEffect, useCallback } from 'react';
import apiClient from '../utils/apiClient';
import { useAuth } from './useAuth';

export interface OrderItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    image: string;
    price: number;
  };
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface Order {
  _id: string;
  user: string;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
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

interface UseOrdersReturn {
  orders: Order[];
  loading: boolean;
  error: string | null;
  order: Order | null;
  loadingOrder: boolean;
  orderError: string | null;
  fetchOrders: () => Promise<void>;
  fetchOrder: (id: string) => Promise<void>;
  createOrder: (orderData: Omit<Order, '_id' | 'user' | 'isPaid' | 'isDelivered' | 'createdAt' | 'updatedAt'>) => Promise<Order>;
  payOrder: (orderId: string, paymentResult: any) => Promise<Order>;
  deliverOrder: (orderId: string) => Promise<Order>;
  clearOrder: () => void;
  clearError: () => void;
}

export const useOrders = (): UseOrdersReturn => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchOrders = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.get<Order[]>('/orders/my-orders');
      setOrders(response.data);
    } catch (err) {
      setError('Failed to load orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchOrder = useCallback(async (id: string) => {
    try {
      setLoadingOrder(true);
      setOrderError(null);
      
      const response = await apiClient.get<Order>(`/orders/${id}`);
      setOrder(response.data);
    } catch (err) {
      setOrderError('Failed to load order');
      console.error('Error fetching order:', err);
      throw err;
    } finally {
      setLoadingOrder(false);
    }
  }, []);

  const createOrder = useCallback(async (orderData: Omit<Order, '_id' | 'user' | 'isPaid' | 'isDelivered' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data } = await apiClient.post<Order>('/orders', orderData);
      
      // Update orders list with the new order
      setOrders(prev => [data, ...prev]);
      
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create order';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const payOrder = useCallback(async (orderId: string, paymentResult: any) => {
    try {
      setLoadingOrder(true);
      setOrderError(null);
      
      const { data } = await apiClient.put<Order>(`/orders/${orderId}/pay`, paymentResult);
      
      // Update the order in the orders list
      setOrders(prev => prev.map(order => 
        order._id === orderId ? data : order
      ));
      
      // Update current order if it's the one being paid
      if (order && order._id === orderId) {
        setOrder(data);
      }
      
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update payment status';
      setOrderError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoadingOrder(false);
    }
  }, [order]);

  const deliverOrder = useCallback(async (orderId: string) => {
    try {
      setLoadingOrder(true);
      setOrderError(null);
      
      const { data } = await apiClient.put<Order>(`/orders/${orderId}/deliver`, {});
      
      // Update the order in the orders list
      setOrders(prev => prev.map(order => 
        order._id === orderId ? data : order
      ));
      
      // Update current order if it's the one being delivered
      if (order && order._id === orderId) {
        setOrder(data);
      }
      
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update delivery status';
      setOrderError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoadingOrder(false);
    }
  }, [order]);

  const clearOrder = useCallback(() => {
    setOrder(null);
    setOrderError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setOrderError(null);
  }, []);

  return {
    orders,
    loading,
    error,
    order,
    loadingOrder,
    orderError,
    fetchOrders,
    fetchOrder,
    createOrder,
    payOrder,
    deliverOrder,
    clearOrder,
    clearError,
  };
};

export default useOrders;
