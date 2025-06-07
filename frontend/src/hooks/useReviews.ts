import { useState, useCallback, useEffect } from 'react';
import apiClient from '../utils/apiClient';
import { useAuth } from './useAuth';

export interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

interface UseReviewsProps {
  productId?: string;
}

interface UseReviewsReturn {
  reviews: Review[];
  loading: boolean;
  error: string | null;
  submitting: boolean;
  submitError: string | null;
  submitReview: (rating: number, comment: string) => Promise<Review>;
  deleteReview: (reviewId: string) => Promise<void>;
  refreshReviews: () => Promise<void>;
}

export const useReviews = ({ productId }: UseReviewsProps = {}): UseReviewsReturn => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchReviews = useCallback(async () => {
    if (!productId) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.get<Review[]>(`/products/${productId}/reviews`);
      setReviews(response.data);
    } catch (err) {
      setError('Failed to load reviews');
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const submitReview = useCallback(async (rating: number, comment: string) => {
    if (!user) {
      throw new Error('You must be logged in to submit a review');
    }

    if (!productId) {
      throw new Error('Product ID is required');
    }

    try {
      setSubmitting(true);
      setSubmitError(null);

      const response = await apiClient.post<Review>(`/products/${productId}/reviews`, {
        rating,
        comment
      });

      // Update local reviews state
      setReviews(prev => [response.data, ...prev]);
      
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to submit review';
      setSubmitError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  }, [productId, user]);

  const deleteReview = useCallback(async (reviewId: string) => {
    try {
      await apiClient.delete(`/reviews/${reviewId}`);
      
      // Update local reviews state
      setReviews(prev => prev.filter(review => review._id !== reviewId));
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete review';
      throw new Error(errorMessage);
    }
  }, []);

  return {
    reviews,
    loading,
    error,
    submitting,
    submitError,
    submitReview,
    deleteReview,
    refreshReviews: fetchReviews
  };
};

export default useReviews;
