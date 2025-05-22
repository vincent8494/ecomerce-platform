import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

/**
 * Error response from the API
 */
interface ApiErrorResponse {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  status: number;
  errors: Record<string, string[]>;

  constructor(message: string, status: number, errors: Record<string, string[]> = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
    
    // Capture stack trace in V8
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}

/**
 * Handle API errors and show appropriate toast messages
 */
export const handleApiError = (error: unknown, defaultMessage = 'Something went wrong'): void => {
  if (error instanceof ApiError) {
    // Handle our custom API errors
    if (error.errors && Object.keys(error.errors).length > 0) {
      // Show the first error message from the errors object
      const firstErrorKey = Object.keys(error.errors)[0];
      const firstErrorMessage = error.errors[firstErrorKey][0];
      toast.error(firstErrorMessage || defaultMessage);
    } else {
      toast.error(error.message || defaultMessage);
    }
  } else if (error instanceof AxiosError) {
    // Handle Axios errors
    const response = error.response?.data as ApiErrorResponse;
    
    if (response?.errors && Object.keys(response.errors).length > 0) {
      // Show the first error message from the errors object
      const firstErrorKey = Object.keys(response.errors)[0];
      const firstErrorMessage = response.errors[firstErrorKey][0];
      toast.error(firstErrorMessage || defaultMessage);
    } else if (response?.message || response?.error) {
      toast.error(response.message || response.error || defaultMessage);
    } else {
      toast.error(error.message || defaultMessage);
    }
  } else if (error instanceof Error) {
    // Handle standard JavaScript errors
    toast.error(error.message || defaultMessage);
  } else {
    // Handle any other type of error
    toast.error(defaultMessage);
  }
  
  // Log the error for debugging
  console.error('API Error:', error);
};

/**
 * Extract error message from an error object
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError || error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  
  return 'An unknown error occurred';
};

/**
 * Handle form validation errors
 */
export const handleFormErrors = (
  error: unknown,
  setFieldError: (field: string, message: string) => void
): void => {
  if (error instanceof AxiosError) {
    const response = error.response?.data as {
      errors?: Record<string, string[]>;
      message?: string;
    };
    
    if (response?.errors) {
      // Set form field errors
      Object.entries(response.errors).forEach(([field, messages]) => {
        if (Array.isArray(messages) && messages.length > 0) {
          setFieldError(field, messages[0]);
        }
      });
    } else if (response?.message) {
      // Show general error message
      toast.error(response.message);
    }
  } else if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error('An error occurred while submitting the form');
  }
};

/**
 * Handle 401 Unauthorized errors
 */
export const handleUnauthorized = (): void => {
  // Clear authentication data
  // Redirect to login page
  window.location.href = '/login';
};

/**
 * Handle 403 Forbidden errors
 */
export const handleForbidden = (): void => {
  toast.error('You do not have permission to perform this action');
  // Optionally redirect to home or previous page
  window.history.back();
};

/**
 * Handle 404 Not Found errors
 */
export const handleNotFound = (): void => {
  toast.error('The requested resource was not found');
  // Optionally redirect to 404 page
  window.location.href = '/404';
};

/**
 * Handle 500 Internal Server Error
 */
export const handleServerError = (): void => {
  toast.error('A server error occurred. Please try again later.');
};

/**
 * Handle network errors
 */
export const handleNetworkError = (): void => {
  toast.error('Network error. Please check your connection and try again.');
};

/**
 * Handle API response and extract data or throw error
 */
export const handleApiResponse = <T>(
  response: { data?: { data?: T; message?: string } },
  defaultMessage = 'Request failed'
): T => {
  if (response?.data?.data) {
    return response.data.data;
  }
  
  throw new Error(response?.data?.message || defaultMessage);
};
