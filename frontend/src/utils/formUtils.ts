import type { FormikHelpers } from 'formik';
import { toast } from 'react-hot-toast';
import { handleApiError } from './errorHandler';

/**
 * Type for form submission handler
 */
export type FormSubmitHandler<T> = (
  values: T,
  formikHelpers: FormikHelpers<T>
) => Promise<void>;

/**
 * Create a form submission handler with loading state and error handling
 */
export const createFormHandler = <T>(
  submitFn: (values: T) => Promise<void>,
  options?: {
    onSuccess?: (result: void, values: T) => void;
    onError?: (error: unknown) => void;
    successMessage?: string;
  }
): FormSubmitHandler<T> => {
  return async (values: T, { setSubmitting, resetForm }: FormikHelpers<T>) => {
    try {
      await submitFn(values);
      
      // Show success message if provided
      if (options?.successMessage) {
        toast.success(options.successMessage);
      }
      
      // Call onSuccess callback if provided
      if (options?.onSuccess) {
        options.onSuccess(undefined, values);
      }
      
      // Reset form if no custom success handler is provided
      if (!options?.onSuccess) {
        resetForm();
      }
    } catch (error) {
      // Call onError callback if provided
      if (options?.onError) {
        options.onError(error);
      } else {
        // Default error handling
        handleApiError(error);
      }
    } finally {
      setSubmitting(false);
    }
  };
};

/**
 * Format form errors from Yup validation
 */
export const formatFormErrors = <T>(
  error: unknown
): Record<keyof T, string> => {
  const errors: Record<string, string> = {};
  
  if (error && typeof error === 'object' && 'inner' in error) {
    const validationError = error as {
      inner: Array<{ path: string; message: string }>;
    };
    
    validationError.inner.forEach((err) => {
      if (err.path) {
        errors[err.path] = err.message;
      }
    });
  }
  
  return errors as Record<keyof T, string>;
};

/**
 * Handle form field changes with debounce
 */
export const createDebouncedHandler = <T>(
  handler: (field: keyof T, value: string) => void,
  delay = 500
) => {
  let timeoutId: NodeJS.Timeout;
  
  return (field: keyof T) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      
      // Clear any existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      // Set a new timeout
      timeoutId = setTimeout(() => {
        handler(field, value);
      }, delay);
    };
};

/**
 * Handle file uploads in forms
 */
export const handleFileUpload = (
  e: React.ChangeEvent<HTMLInputElement>,
  field: string,
  setFieldValue: (field: string, value: File | null) => void,
  options?: {
    maxSize?: number; // in bytes
    allowedTypes?: string[];
    onError?: (message: string) => void;
  }
): void => {
  const file = e.target.files?.[0];
  
  if (!file) {
    return;
  }
  
  // Check file type
  if (
    options?.allowedTypes &&
    !options.allowedTypes.includes(file.type)
  ) {
    const errorMsg = `Invalid file type. Allowed types: ${options.allowedTypes.join(
      ', '
    )}`;
    
    if (options.onError) {
      options.onError(errorMsg);
    } else {
      toast.error(errorMsg);
    }
    
    return;
  }
  
  // Check file size
  if (options?.maxSize && file.size > options.maxSize) {
    const maxSizeMB = (options.maxSize / (1024 * 1024)).toFixed(2);
    const errorMsg = `File is too large. Maximum size is ${maxSizeMB}MB`;
    
    if (options.onError) {
      options.onError(errorMsg);
    } else {
      toast.error(errorMsg);
    }
    
    return;
  }
  
  // If all validations pass, set the field value
  setFieldValue(field, file);
};

/**
 * Format form data for API submission with file uploads
 */
export const formatFormData = <T extends Record<string, any>>(values: T): FormData => {
  const formData = new FormData();
  
  Object.entries(values).forEach(([key, value]) => {
    // Skip undefined and null values
    if (value === undefined || value === null) {
      return;
    }
    
    // Handle file objects
    if (value instanceof File) {
      formData.append(key, value);
    } 
    // Handle arrays (e.g., multiple files or string arrays)
    else if (Array.isArray(value)) {
      value.forEach((item) => {
        formData.append(key, item);
      });
    }
    // Handle nested objects (convert to JSON string)
    else if (typeof value === 'object' && value !== null) {
      formData.append(key, JSON.stringify(value));
    }
    // Handle all other primitive values
    else {
      formData.append(key, value as string);
    }
  });
  
  return formData;
};

/**
 * Create a form reset handler
 */
export const createResetHandler = <T>(
  initialValues: T,
  resetForm: (values: T) => void,
  callback?: () => void
) => {
  return () => {
    resetForm(initialValues);
    if (callback) {
      callback();
    }
  };
};
