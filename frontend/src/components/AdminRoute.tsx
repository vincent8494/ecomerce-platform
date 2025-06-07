import { Route, Redirect } from 'react-router-dom';
import type { RouteProps } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuth } from '../store/slices/authSlice';

interface AdminRouteProps extends RouteProps {
  component: React.ComponentType<any>;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ component: Component, ...rest }) => {
  const { isAuthenticated, user } = useSelector(selectAuth);

  return (
    <Route
      {...rest}
      render={(props) =>
        !isAuthenticated ? (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location },
            }}
          />
) : isAuthenticated && (user as any)?.isAdmin ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
};

export default AdminRoute;
