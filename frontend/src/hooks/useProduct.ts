import { useState, useEffect, useCallback } from 'react';
import apiClient from '../utils/apiClient';
import { Product as BaseProduct } from '../types/hooks';

export interface Product extends BaseProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  discount: number | null;
  rating: number;
  reviews: Array<{
    _id: string;
    user: {
      _id: string;
      name: string;
      avatar?: string;
    };
    rating: number;
    comment: string;
    createdAt: string;
  }>;
  images: string[];
  category: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

interface UseProductReturn {
  product: Product | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useProduct = (productId: string): UseProductReturn => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!productId) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.get<Product>(`/products/${productId}`);
      setProduct(response.data);
    } catch (err) {
      setError('Failed to load product');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return { 
    product, 
    loading, 
    error, 
    refresh: fetchProduct 
  };
};

export default useProduct;
