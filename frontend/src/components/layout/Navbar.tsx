import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { useNotifications } from '../../hooks/useNotifications';

interface NavbarProps {
  // Props are now handled by hooks internally
}

const Navbar: React.FC<NavbarProps> = () => {
  const history = useHistory();
  const { logout } = useAuth();
  const { cartItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  // For demo purposes, we'll use a simple user state
  const [user, setUser] = useState<{ name: string } | null>({ name: 'Demo User' });
  const { toggleWishlist, isWishlistOpen } = useWishlist();
  const { notifications } = useNotifications();
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Update cart items count when cartItems changes
  useEffect(() => {
    if (Array.isArray(cartItems)) {
      setCartItemsCount(cartItems.reduce((total, item) => total + (item.quantity || 0), 0));
    }
  }, [cartItems]);

  const handleLogout = async () => {
    try {
      await logout();
      history.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-slate-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-xl font-bold text-white">
              Fetty
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-slate-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-slate-300 hover:text-white transition-colors">
              Products
            </Link>
            <Link to="/categories" className="text-slate-300 hover:text-white transition-colors">
              Categories
            </Link>
            <Link to="/quicklinks" className="text-slate-300 hover:text-white transition-colors">
              Quick Links
            </Link>
            <Link to="/customer-service" className="text-slate-300 hover:text-white transition-colors">
              Customer Service
            </Link>
            <Link to="/about" className="text-slate-300 hover:text-white transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-slate-300 hover:text-white transition-colors">
              Contact
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative text-slate-300 hover:text-white transition-colors"
              aria-label="Cart"
              aria-expanded={isCartOpen}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Wishlist */}
            <div className="relative">
              <button
                onClick={toggleWishlist}
                className="relative text-slate-300 hover:text-white transition-colors"
                aria-label="Wishlist"
              >
                <svg
                  className="h-6 w-6"
                  fill={isWishlistOpen ? "currentColor" : "none"}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Notifications */}
            <button
              className="relative text-slate-300 hover:text-white transition-colors"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
              >
                {user ? (
                  <>
                    <span className="text-sm">{user.name || 'User'}</span>
                    <svg
                      className={`h-5 w-5 transition-transform ${isUserMenuOpen ? 'transform rotate-180' : ''}`}
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                ) : (
                  <Link to="/login" className="text-sm">Sign In</Link>
                )}
              </button>

              {/* User Menu Dropdown */}
              {user && isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-md shadow-lg z-50">
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Orders
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
