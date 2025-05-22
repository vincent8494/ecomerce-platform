import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CartItem } from '../../types/cart';

interface CartState {
  items: CartItem[];
  shippingAddress: any;
  paymentMethod: string;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
}

// Load cart from localStorage if available
const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems') || '[]')
  : [];

const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
  ? JSON.parse(localStorage.getItem('shippingAddress') || '{}')
  : {};

const paymentMethodFromStorage = localStorage.getItem('paymentMethod') || '';

const initialState: CartState = {
  items: cartItemsFromStorage,
  shippingAddress: shippingAddressFromStorage,
  paymentMethod: paymentMethodFromStorage,
  itemsPrice: 0,
  shippingPrice: 0,
  taxPrice: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const item = action.payload;
      const existItem = state.items.find((x: CartItem) => x.product === item.product);

      if (existItem) {
        state.items = state.items.map((x: CartItem) =>
          x.product === existItem.product ? item : x
        );
      } else {
        state.items = [...state.items, item];
      }
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item: CartItem) => item.product !== action.payload);
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    saveShippingAddress: (state, action: PayloadAction<any>) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
    },
    savePaymentMethod: (state, action: PayloadAction<string>) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('paymentMethod', action.payload);
    },
    clearCartItems: (state) => {
      state.items = [];
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    updateCartItem: (state, action: PayloadAction<{ productId: string; qty: number }>) => {
      const { productId, qty } = action.payload;
      const item = state.items.find((item: CartItem) => item.product === productId);
      
      if (item) {
        item.qty = qty;
        localStorage.setItem('cartItems', JSON.stringify(state.items));
      }
    },
    calculatePrices: (state) => {
      const itemsPrice = state.items.reduce(
        (acc, item) => acc + item.price * item.qty,
        0
      );
      state.itemsPrice = itemsPrice;
      state.shippingPrice = itemsPrice > 100 ? 0 : 10;
      state.taxPrice = Number((0.15 * itemsPrice).toFixed(2));
      state.totalPrice = Number(
        (itemsPrice + state.shippingPrice + state.taxPrice).toFixed(2)
      );
    },
    resetCart: () => {
      localStorage.removeItem('cartItems');
      localStorage.removeItem('shippingAddress');
      localStorage.removeItem('paymentMethod');
      return {
        items: [],
        shippingAddress: {},
        paymentMethod: '',
        itemsPrice: 0,
        shippingPrice: 0,
        taxPrice: 0,
        totalPrice: 0,
      };
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
  calculatePrices,
  resetCart,
  updateCartItem,
} = cartSlice.actions;

export const selectCart = (state: { cart: CartState }) => state.cart;

export default cartSlice.reducer;
