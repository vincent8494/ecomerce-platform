import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { User } from '../types/hooks';
import apiClient from '../utils/apiClient';
import { useHistory } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Omit<User, '_id' | 'createdAt' | 'updatedAt'> & { password: string }) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'auth';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useLocalStorage<{
    user: User | null;
    token: string | null;
  }>(AUTH_STORAGE_KEY, {
    user: null,
    token: null,
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();

  // Set the auth token in the API client
  useEffect(() => {
    if (authState.token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${authState.token}`;
    } else {
      delete apiClient.defaults.headers.common['Authorization'];
    }
  }, [authState.token]);

  // Check if user is already logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authState.token) {
          // Optionally validate the token with the server
          const response = await apiClient.get('/auth/me');
          setAuthState(prev => ({
            ...prev,
            user: response.data.user,
          }));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Clear invalid auth state
        setAuthState({ user: null, token: null });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [authState.token, setAuthState]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await apiClient.post('/auth/login', { email, password });
      
      setAuthState({
        user: response.data.user,
        token: response.data.token,
      });
      
      // Redirect to home or previous page
      history.push('/');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [history, setAuthState]);

  const register = useCallback(async (userData) => {
    try {
      setIsLoading(true);
      const response = await apiClient.post('/auth/register', userData);
      
      setAuthState({
        user: response.data.user,
        token: response.data.token,
      });
      
      // Redirect to home after registration
      history.push('/');
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [history, setAuthState]);

  const logout = useCallback(() => {
    setAuthState({ user: null, token: null });
    // Redirect to home after logout
    history.push('/');
  }, [history, setAuthState]);

  const updateUser = useCallback((userData: Partial<User>) => {
    setAuthState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...userData } : null,
    }));
  }, [setAuthState]);

  const value = useMemo(() => ({
    user: authState.user,
    token: authState.token,
    isAuthenticated: !!authState.user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  }), [
    authState.user, 
    authState.token, 
    isLoading, 
    login, 
    register, 
    logout, 
    updateUser
  ]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
