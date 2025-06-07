import { useState, useEffect, useCallback } from 'react';
import apiClient from '../utils/apiClient';
import { Product as BaseProduct, Category } from '../types/hooks';

export interface Product extends Omit<BaseProduct, 'discount'> {
  _id: string;
  name: string;
  description: string;
  price: number;
  discount: number | null;
  rating: number;
  reviews: Array<{ _id: string; rating: number; comment: string }>;
  images: string[];
  category: Category | string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

interface UseProductsProps {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
}

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  totalProducts: number;
  refreshProducts: () => Promise<void>;
}

export const useProducts = ({
  page = 1,
  limit = 12,
  category,
  search,
  sort,
  minPrice,
  maxPrice,
  rating,
}: UseProductsProps = {}): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
        
      if (category) params.append('category', category);
      if (search) params.append('search', search);
      if (sort) params.append('sort', sort);
      if (minPrice) params.append('minPrice', minPrice.toString());
      if (maxPrice) params.append('maxPrice', maxPrice.toString());
      if (rating) params.append('rating', rating.toString());

      const response = await apiClient.get<{
        products: Product[];
        totalPages: number;
        totalProducts: number;
      }>(`/products?${params.toString()}`);
      
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
      setTotalProducts(response.data.totalProducts);
    } catch (err) {
      setError('Failed to load products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, category, search, sort, minPrice, maxPrice, rating]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { 
    products, 
    loading, 
    error, 
    totalPages, 
    totalProducts, 
    refreshProducts: fetchProducts 
  };
};
