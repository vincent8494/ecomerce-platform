import { useState, useEffect } from 'react';
import apiClient from '../utils/apiClient';
import { useTranslation } from 'react-i18next';

interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
  slug: string;
}

export const useCategories = () => {
  const { t } = useTranslation();
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
        setError(t('error_loading_categories'));
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [t]);

  return { categories, loading, error };
};
