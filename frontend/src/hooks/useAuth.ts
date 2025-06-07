<<<<<<< HEAD
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { logout as logoutAction } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  
  const logout = useCallback(async () => {
    try {
      // Add any logout API call here if needed
      dispatch(logoutAction());
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }, [dispatch]);

  return { logout };
=======
import { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { User } from '../types';
import { AuthContextType } from '../types/hooks';

export const useAuth = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const history = useHistory();

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data - in a real app, this would come from your backend
      const mockUser: User = {
        _id: '1',
        name: 'Test User',
        email: email,
        role: 'user',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      history.push('/');
    } catch (err) {
      setError('Failed to login. Please check your credentials.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  }, [history]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data - in a real app, this would come from your backend
      const mockUser: User = {
        _id: Date.now().toString(),
        name,
        email,
        role: 'user',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      history.push('/');
    } catch (err) {
      setError('Failed to register. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  }, [history]);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUser(null);
      localStorage.removeItem('user');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
      history.push('/login');
    }
  }, [history]);

  return {
    user,
    login,
    register,
    logout,
    loading,
    error,
  };
>>>>>>> 312d538 (Add React hooks, context providers, and theme for e-commerce platform)
};

export default useAuth;
