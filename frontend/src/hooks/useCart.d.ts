import { CartItem } from './useCart';

declare const useCart: () => {
  cartItems: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  // Add other cart methods as needed
};

export default useCart;
