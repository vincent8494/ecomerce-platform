import { User, Product as BaseProduct, Category as BaseCategory } from './index';

export interface Product extends Omit<BaseProduct, 'images'> {
  images: string[];
  stock: number;
}

export interface Category extends BaseCategory {
  _id: string;
  name: string;
  description: string;
  image: string;
  slug: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface WishlistItem {
  product: Product;
  addedAt: Date;
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  timestamp: Date;
  read: boolean;
}
