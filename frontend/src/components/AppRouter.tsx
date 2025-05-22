import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Home from '../pages/Home';
import About from '../pages/About';
import Contact from '../pages/Contact';
import ShippingPolicy from '../pages/ShippingPolicy';
import ReturnsExchanges from '../pages/ReturnsExchanges';
import FAQ from '../pages/FAQ';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import NewArrivals from '../pages/NewArrivals';
import SaleItems from '../pages/SaleItems';
import ProductList from '../pages/ProductList';
import Blog from '../pages/Blog';
import ProductDetails from '../pages/ProductDetails';
import ProductGalleryPage from '../pages/ProductGalleryPage';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import Orders from '../pages/Orders';
import AdminDashboard from '../pages/AdminDashboard';

// Components
import Navbar from './Navbar';
import Footer from './Footer';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';

const AppRouter = () => {
  // Authentication state is available via PrivateRoute components
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/shipping" element={<ShippingPolicy />} />
        <Route path="/returns" element={<ReturnsExchanges />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/new-arrivals" element={<NewArrivals />} />
        <Route path="/sale" element={<SaleItems />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/gallery" element={<ProductGalleryPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <Orders />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
};

export default AppRouter;
