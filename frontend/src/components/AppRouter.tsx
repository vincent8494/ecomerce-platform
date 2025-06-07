import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

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
import NotFound from '../pages/NotFound';

// Components
import Navbar from './Navbar';
import Footer from './Footer';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';

const AppRouter = () => {
  return (
    <Router>
      <Navbar />
      <Switch>
        {/* Public Routes */}
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/shipping" component={ShippingPolicy} />
        <Route path="/returns" component={ReturnsExchanges} />
        <Route path="/faq" component={FAQ} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/new-arrivals" component={NewArrivals} />
        <Route path="/sale" component={SaleItems} />
        <Route exact path="/products" component={ProductList} />
        <Route path="/blog" component={Blog} />
        <Route path="/gallery" component={ProductGalleryPage} />
        <Route path="/product/:id" component={ProductDetails} />
        <Route path="/cart" component={Cart} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />

        {/* Protected Routes */}
        <PrivateRoute path="/profile" component={Profile} />
        <PrivateRoute path="/orders" component={Orders} />

        {/* Admin Routes */}
        <AdminRoute path="/admin/dashboard" component={AdminDashboard} />

        {/* 404 - Keep this at the bottom */}
        <Route path="*" component={NotFound} />
      </Switch>
      <Footer />
    </Router>
  );
};

export default AppRouter;
