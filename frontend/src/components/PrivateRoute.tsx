import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuth } from '../store/slices/authSlice';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useSelector(selectAuth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
