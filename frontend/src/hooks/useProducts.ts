import { useState, useEffect } from 'react';
import apiClient from '../utils/apiClient';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discount?: number;
  rating: number;
  reviews: Array<{ _id: string; rating: number; comment: string }>;
  images: string[];
  category: string;
  stock: number;
  createdAt: string;
}

interface UseProductsProps {
  page: number;
  category?: string;
  search?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
}

export const useProducts = ({
  page,
  category,
  search,
  sort,
  minPrice,
  maxPrice,
  rating,
}: UseProductsProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = new URLSearchParams();
        params.append('page', page.toString());
        
        if (category) params.append('category', category);
        if (search) params.append('search', search);
        if (sort) params.append('sort', sort);
        if (minPrice) params.append('minPrice', minPrice.toString());
        if (maxPrice) params.append('maxPrice', maxPrice.toString());
        if (rating) params.append('rating', rating.toString());

        const response = await apiClient.get(`/products?${params.toString()}`);
        
        setProducts(response.data.products);
        setTotalPages(response.data.totalPages);
      } catch (err: any) {
        setError('Failed to load products. Please try again later.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, category, search, sort, minPrice, maxPrice, rating]);

  return { products, loading, error, totalPages };
};
