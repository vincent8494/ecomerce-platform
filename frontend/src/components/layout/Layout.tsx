import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';

const Layout: React.FC = () => {
  const { user, loading } = useAuth();
  const { cartItems } = useCart();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar user={user} loading={loading} cartItems={cartItems} />
      
      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
