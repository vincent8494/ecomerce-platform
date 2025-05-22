import { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectAuth, logout } from "../store/slices/authSlice";
import type { RootState } from "../store/store";
import { ShoppingCart, Search } from '@mui/icons-material';
import PersonIcon from '@mui/icons-material/Person';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => selectAuth(state));
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/products?search=${searchTerm}`);
      setShowMobileMenu(false);
    }
  };

  return (
    <header>
      <div className="logo">
        <Link to="/">VMK Store</Link>
      </div>
      
      <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
        ☰
      </button>

      <nav className={`nav-links ${showMobileMenu ? 'active' : ''}`}>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch}>
            <Search />
          </button>
        </div>

        <ul>
          <li>
            <Link to="/" onClick={() => setShowMobileMenu(false)}>Home</Link>
          </li>
          <li>
            <Link to="/products" onClick={() => setShowMobileMenu(false)}>Products</Link>
          </li>
          <li>
            <Link to="/cart" onClick={() => setShowMobileMenu(false)}>
              <ShoppingCart />
              <span className="cart-count">0</span>
            </Link>
          </li>
          {isAuthenticated ? (
            <li className="user-menu">
              <div className="user-dropdown">
                <button className="user-button">
                  <PersonIcon />
                  <span>{user?.name || 'Account'}</span>
                </button>
                <div className="dropdown-content">
                  <Link to="/profile" onClick={() => setShowMobileMenu(false)}>Profile</Link>
                  <Link to="/orders" onClick={() => setShowMobileMenu(false)}>Orders</Link>
                  <button onClick={handleLogout} className="logout-button">Logout</button>
                </div>
              </div>
            </li>
          ) : (
            <li>
              <Link to="/login" className="login-button" onClick={() => setShowMobileMenu(false)}>
                Login / Register
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
