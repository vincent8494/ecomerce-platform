import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

// Mock implementations for now
const useAuth = () => ({
  user: null,
  loading: false,
  logout: async () => {}
});

const useCart = () => ({
  cartItems: []
});

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const { cartItems } = useCart();
  // Hide navbar and footer on certain routes if needed
  const hideLayout = false; // Add any routes where you want to hide the layout

  if (hideLayout) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
<Navbar user={user} loading={loading} cartItems={cartItems} />
      
      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
