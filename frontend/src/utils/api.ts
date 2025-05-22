import axios, { type AxiosError, type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { store } from '../store/store';
import { logout } from '../store/slices/authSlice';

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = store.getState().auth.token;
    
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      const { status } = error.response;
      
      // Handle 401 Unauthorized
      if (status === 401) {
        store.dispatch(logout());
        window.location.href = '/login';
      }
      
      // Handle 403 Forbidden
      if (status === 403) {
        // Redirect to unauthorized page or show a message
        console.error('You are not authorized to perform this action');
      }
      
      // Handle 404 Not Found
      if (status === 404) {
        // Redirect to 404 page or show a message
        console.error('The requested resource was not found');
      }
      
      // Handle 500 Internal Server Error
      if (status >= 500) {
        // Show server error message
        console.error('A server error occurred. Please try again later.');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response from server. Please check your connection.');
    } else {
      // Something happened in setting up the request
      console.error('Request error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
