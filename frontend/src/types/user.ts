export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}
