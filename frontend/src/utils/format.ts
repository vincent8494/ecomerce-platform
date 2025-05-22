import { formatDistanceToNow, format } from 'date-fns';

// Format currency (e.g., $1,234.56)
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

// Format date (e.g., Jan 1, 2023)
export const formatDate = (dateString: string): string => {
  return format(new Date(dateString), 'MMM d, yyyy');
};

// Format date and time (e.g., Jan 1, 2023 12:00 PM)
export const formatDateTime = (dateString: string): string => {
  return format(new Date(dateString), 'MMM d, yyyy h:mm a');
};

// Format relative time (e.g., 2 days ago)
export const formatRelativeTime = (dateString: string): string => {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true });
};

// Format file size (e.g., 2.5 MB)
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

// Format phone number (e.g., (123) 456-7890)
export const formatPhoneNumber = (phoneNumber: string): string => {
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  return phoneNumber;
};

// Truncate text with ellipsis
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

// Generate a slug from a string
export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};

// Convert string to title case
export const toTitleCase = (str: string): string => {
  if (!str) return '';
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
  );
};

// Format credit card number (e.g., 4242 4242 4242 4242)
export const formatCreditCardNumber = (number: string): string => {
  return number.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
};

// Format expiration date (e.g., 12/23)
export const formatExpirationDate = (date: string): string => {
  return date
    .replace(/\s?/g, '')
    .replace(/(\d{2})(\d{2})/g, '$1/$2')
    .trim();
};

// Format price with discount
export const formatDiscountedPrice = (price: number, discount: number): string => {
  const discountedPrice = price - (price * discount) / 100;
  return formatCurrency(discountedPrice);
};

// Generate a random ID
export const generateId = (length = 8): string => {
  return Math.random().toString(36).substring(2, length + 2);
};
