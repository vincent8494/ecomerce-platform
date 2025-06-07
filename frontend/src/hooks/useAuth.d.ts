import { User } from '../types';

declare const useAuth: () => {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  // Add other auth methods as needed
};

export default useAuth;
