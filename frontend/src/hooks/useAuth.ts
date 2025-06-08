import { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout as logoutAction } from '../store/slices/authSlice';
import type { User } from '../types';
import type { AuthContextType } from '../types/hooks';

export const useAuth = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const history = useHistory();
  const dispatch = useDispatch();
  
  // Initialize Redux state if user is already logged in
  useEffect(() => {
    if (user) {
      // Initialize Redux auth state here if needed
      // dispatch(loginSuccess(user));
    }
  }, [user, dispatch]);

  const login = useCallback(async (email: string, _password: string) => {
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

  const register = useCallback(async (name: string, email: string, _password: string) => {
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
      
      // Clear local state
      setUser(null);
      localStorage.removeItem('user');
      
      // Update Redux state
      dispatch(logoutAction());
      
      // Redirect to login
      history.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
      setError('Failed to logout. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [history, dispatch]);

  return {
    user,
    login,
    register,
    logout,
    loading,
    error,
  };

};

export default useAuth;
