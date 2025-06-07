import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { logout as logoutAction } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  
  const logout = useCallback(async () => {
    try {
      // Add any logout API call here if needed
      dispatch(logoutAction());
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }, [dispatch]);

  return { logout };
};

export default useAuth;
