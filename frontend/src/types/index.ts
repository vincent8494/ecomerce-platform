// Common types
export interface BaseModel {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
}

// User types
export type UserRole = 'user' | 'admin';

export interface User extends BaseModel {
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  phone?: string;
  isActive?: boolean;
  permissions?: string[];
}

// Product types
export interface ProductImage {
  url: string;
  alt?: string;
}

export interface ProductReview extends BaseModel {
  user: string | User;
  rating: number;
  comment: string;
}

export interface Product extends BaseModel {
  name: string;
  slug: string;
  description: string;
  price: number;
  discount: number;
  finalPrice: number;
  category: string | Category;
  subCategory?: string;
  brand?: string;
  quantity: number;
  sold: number;
  images: ProductImage[];
  colors?: string[];
  sizes?: string[];
  tags?: string[];
  ratings: ProductReview[];
  averageRating: number;
  numOfReviews: number;
  featured: boolean;
  freeShipping: boolean;
  inventory: number;
  isActive: boolean;
}

// Category types
export interface Category extends BaseModel {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: string | Category;
  featured: boolean;
  isActive: boolean;
  productCount?: number;
}

// Cart types
export interface CartItem {
  product: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  countInStock: number;
}

// Order types
export interface OrderItem {
  name: string;
  qty: number;
  image: string;
  price: number;
  product: string | Product;
}

export interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface PaymentResult {
  id: string;
  status: string;
  update_time: string;
  email_address: string;
}

export interface Order extends BaseModel {
  user: string | User;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentResult?: PaymentResult;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

// Form data types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData extends LoginFormData {
  name: string;
  confirmPassword: string;
}

export interface ShippingFormData {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface PaymentFormData {
  paymentMethod: string;
}

// Component props types
export interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export interface MetaProps {
  title?: string;
  description?: string;
  keywords?: string;
}
