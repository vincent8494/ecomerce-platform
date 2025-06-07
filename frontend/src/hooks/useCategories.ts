import { useState, useEffect } from 'react';
import apiClient from '../utils/apiClient';

interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
  slug: string;
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.get('/categories');
        setCategories(response.data.categories);
      } catch (err: any) {
        setError('Failed to load categories. Please try again later.');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};
