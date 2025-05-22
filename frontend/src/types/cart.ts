export interface CartItem {
  _id: string;
  name: string;
  image: string;
  price: number;
  countInStock: number;
  qty: number;
  product: string;
}

export interface CartState {
  items: CartItem[];
  shippingAddress: any;
  paymentMethod: string;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
}
