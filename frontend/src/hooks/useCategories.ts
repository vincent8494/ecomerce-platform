import { useState, useEffect, useCallback } from 'react';
import apiClient from '../utils/apiClient';
import { Category } from '../types/hooks';

interface UseCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refreshCategories: () => Promise<void>;
}

export const useCategories = (): UseCategoriesReturn => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/categories');
      setCategories(response.data.categories);
    } catch (err) {
      setError('Failed to load categories. Please try again later.');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { 
    categories, 
    loading, 
    error, 
    refreshCategories: fetchCategories 
  };
};
