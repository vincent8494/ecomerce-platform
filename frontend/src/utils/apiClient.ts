import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { getToken } from './storage';
import { handleApiError } from './errorHandler';

// Create axios instance with base URL
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response) {
      // Handle specific status codes
      const { status } = error.response;
      
      if (status === 401) {
        // Unauthorized - token expired or invalid
        // You can add logic to refresh token if needed
        console.error('Unauthorized access - please login again');
      } else if (status === 403) {
        // Forbidden - user doesn't have permission
        console.error('You do not have permission to perform this action');
      } else if (status === 404) {
        // Not found
        console.error('The requested resource was not found');
      } else if (status >= 500) {
        // Server error
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

/**
 * Generic GET request
 */
export const get = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await apiClient.get<T>(url, config);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Generic POST request
 */
export const post = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await apiClient.post<T>(url, data, config);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Generic PUT request
 */
export const put = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await apiClient.put<T>(url, data, config);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Generic PATCH request
 */
export const patch = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await apiClient.patch<T>(url, data, config);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Generic DELETE request
 */
export const del = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await apiClient.delete<T>(url, config);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Upload file with progress tracking
 */
import type { ProgressEvent } from '../types/progressEvent';

export const uploadFile = <T>(
  url: string,
  file: File,
  onUploadProgress?: (event: ProgressEvent) => void
): Promise<AxiosResponse<T>> => {
  const formData = new FormData();
  formData.append('file', file);

  return apiClient.post<T>(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
};

export default apiClient;
