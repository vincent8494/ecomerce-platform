import type { User } from '../types';
import { getToken, getUser, setToken, setUser, clearAuthData } from './storage';
import api from './api';

// Add UserWithPermissions interface
type UserWithPermissions = User & {
  permissions?: string[];
};

// Update getCurrentUser to use UserWithPermissions
type CurrentUser = UserWithPermissions | null;

/**
 * Get current user from storage
 */
export const getCurrentUser = (): CurrentUser => {
  return getUser<UserWithPermissions>();
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

/**
 * Check if current user has admin role
 */
export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user ? user.role === 'admin' : false;
};

/**
 * Login user and save token and user data to storage
 */
export const login = async (email: string, password: string): Promise<void> => {
  try {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data;
    
    // Save token and user data to storage
    setToken(token);
    setUser(user);
    
    // Set default authorization header
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

/**
 * Logout user and clear auth data
 */
export const logout = (): void => {
  // Clear auth data from storage
  clearAuthData();
  
  // Remove authorization header
  delete api.defaults.headers.common['Authorization'];
  
  // Redirect to login page
  window.location.href = '/login';
};

/**
 * Register a new user
 */
export const register = async (userData: {
  name: string;
  email: string;
  password: string;
}): Promise<void> => {
  try {
    const response = await api.post('/auth/register', userData);
    const { token, user } = response.data;
    
    // Save token and user data to storage
    setToken(token);
    setUser(user);
    
    // Set default authorization header
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (userData: Partial<User>): Promise<User | null> => {
  try {
    const response = await api.put('/auth/me', userData);
    const updatedUser = response.data;
    
    // Update user data in storage
    setUser(updatedUser);
    
    return updatedUser as User;
  } catch (error) {
    console.error('Profile update failed:', error);
    throw error;
  }
};

/**
 * Update user password
 */
export const updatePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> => {
  try {
    await api.put('/auth/update-password', data);
  } catch (error) {
    console.error('Password update failed:', error);
    throw error;
  }
};

/**
 * Request password reset
 */
export const forgotPassword = async (email: string): Promise<void> => {
  try {
    await api.post('/auth/forgot-password', { email });
  } catch (error) {
    console.error('Password reset request failed:', error);
    throw error;
  }
};

/**
 * Reset password with token
 */
export const resetPassword = async (data: {
  token: string;
  password: string;
}): Promise<void> => {
  try {
    await api.post('/auth/reset-password', data);
  } catch (error) {
    console.error('Password reset failed:', error);
    throw error;
  }
};

/**
 * Check if user has required roles
 */
export const hasRole = (requiredRoles: string[]): boolean => {
  const user = getCurrentUser();
  if (!user) return false;
  
  return requiredRoles.includes(user.role);
};

/**
 * Check if user has any of the required roles
 */
export const hasAnyRole = (requiredRoles: string[]): boolean => {
  const user = getCurrentUser();
  if (!user) return false;
  
  return requiredRoles.some(role => user.role === role);
};

/**
 * Check if user has all required permissions
 */
export const hasPermission = (requiredPermissions: string[]): boolean => {
  const user = getCurrentUser();
  if (!user || !user.permissions) return false;
  
  return requiredPermissions.every(permission => 
    user.permissions?.includes(permission)
  );
};

/**
 * Check if user has any of the required permissions
 */
export const hasAnyPermission = (requiredPermissions: string[]): boolean => {
  const user = getCurrentUser();
  if (!user || !user.permissions) return false;
  
  return requiredPermissions.some(permission => 
    user.permissions?.includes(permission)
  );
};

/**
 * Initialize authentication
 */
export const initAuth = (): void => {
  const token = getToken();
  
  if (token) {
    // Set default authorization header
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // Optionally validate token with the server
    validateToken().catch(() => {
      // If token is invalid, clear auth data
      clearAuthData();
      delete api.defaults.headers.common['Authorization'];
    });
  }
};

/**
 * Validate token with the server
 */
const validateToken = async (): Promise<boolean> => {
  try {
    await api.get('/auth/validate-token');
    return true;
  } catch (error) {
    return false;
  }
};
