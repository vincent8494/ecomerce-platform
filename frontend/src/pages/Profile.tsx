import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import '../styles/profile.css'; // Import the CSS file

// User profile interface
interface UserProfile {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  region?: string;
  postalCode?: string;
}

// Auth state interface
interface AuthState {
  user: UserProfile;
}

const selectAuth = (state: { auth: AuthState }) => state.auth;
const logout = () => ({ type: 'auth/logout' });

// Icons from Material-UI
import { 
  Person as PersonIcon,
  ShoppingCart as ShoppingCartIcon,
  Favorite as FavoriteIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

// Import the FettyStore logo - Vite handles this import and returns the resolved URL
const storeLogo = new URL('../../public/fetty-logo.png', import.meta.url).href;

// Remove theme configuration as we're using CSS for styling now

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(selectAuth) as { user: UserProfile };
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+255 712 345 678',
    address: '123 Kilimall Street',
    city: 'Dar es Salaam',
    region: 'Dar es Salaam',
    postalCode: '12345',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        address: user.address || prev.address,
        city: user.city || prev.city,
        region: user.region || prev.region,
        postalCode: user.postalCode || prev.postalCode,
      }));
    }
  }, [user]);

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleProfileUpdate = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError('');
      setSuccess('');

      // Here you would typically make an API call to update the profile
      // For now, we'll just show a success message
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="profile-section">
            <div className="section-header">
              <h3 className="section-title">Personal Information</h3>
              <button className="btn btn-outline">
                <EditIcon /> Edit Profile
              </button>
            </div>
            
            {error && (
              <div className="alert alert-error">
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="alert alert-success">
                <span>{success}</span>
              </div>
            )}
            
            <form className="profile-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  placeholder="Enter your email"
                  disabled
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange('phone')}
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="address">Street Address</label>
                <input
                  type="text"
                  id="address"
                  value={formData.address}
                  onChange={handleInputChange('address')}
                  placeholder="Enter your street address"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  value={formData.city}
                  onChange={handleInputChange('city')}
                  placeholder="Enter your city"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="region">State/Region</label>
                <input
                  type="text"
                  id="region"
                  value={formData.region}
                  onChange={handleInputChange('region')}
                  placeholder="Enter your region"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="postalCode">Postal Code</label>
                <input
                  type="text"
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange('postalCode')}
                  placeholder="Enter postal code"
                />
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-outline"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    name: user?.name || '',
                    email: user?.email || '',
                    phone: user?.phone || '',
                    address: user?.address || '',
                    city: user?.city || '',
                    region: user?.region || '',
                    postalCode: user?.postalCode || ''
                  }))}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={handleProfileUpdate}
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        );
      case 'orders':
        return (
          <div className="profile-section">
            <h3 className="section-title">My Orders</h3>
            <p>You haven't placed any orders yet.</p>
            <div className="form-actions">
              <Link to="/products" className="btn btn-primary">
                Start Shopping
              </Link>
            </div>
          </div>
        );
      case 'wishlist':
        return (
          <div className="profile-section">
            <h3 className="section-title">My Wishlist</h3>
            <p>Your wishlist is empty.</p>
            <div className="form-actions">
              <Link to="/products" className="btn btn-primary">
                Browse Products
              </Link>
            </div>
          </div>
        );
      case 'addresses':
        return (
          <div className="profile-section">
            <div className="section-header">
              <h3 className="section-title">My Addresses</h3>
              <button className="btn btn-primary">
                <EditIcon /> Add New Address
              </button>
            </div>
            <p>No saved addresses found.</p>
          </div>
        );
      default:
        return (
          <div className="profile-section">
            <h3 className="section-title">My Profile</h3>
            <p>Welcome to your account dashboard.</p>
          </div>
        );
    }
  };

  return (
    <div className="profile-container">
      {/* Header Section */}
      <header className="profile-header">
        <div className="logo-container">
          <img 
            src={storeLogo} 
            alt="FettyStore" 
            className="store-logo"
            onError={(e) => {
              console.error('Error loading image:', e);
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              console.log('Image path:', storeLogo);
            }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', width: '100%' }}>
          <div className="profile-avatar">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h2 style={{ margin: 0 }}>{user?.name || 'User'}</h2>
            <p style={{ margin: '5px 0 0 0', color: '#666' }}>{user?.email || 'user@example.com'}</p>
          </div>
        </div>
      </header>

      <div className="profile-content">
        {/* Sidebar */}
        <aside className="profile-sidebar">
          <ul className="sidebar-menu">
            <li 
              className={activeTab === 'profile' ? 'active' : ''}
              onClick={() => setActiveTab('profile')}
            >
              <PersonIcon />
              <span>My Profile</span>
            </li>
            <li 
              className={activeTab === 'orders' ? 'active' : ''}
              onClick={() => setActiveTab('orders')}
            >
              <ShoppingCartIcon />
              <span>My Orders</span>
            </li>
            <li 
              className={activeTab === 'wishlist' ? 'active' : ''}
              onClick={() => setActiveTab('wishlist')}
            >
              <FavoriteIcon />
              <span>Wishlist</span>
            </li>
            <li 
              className={activeTab === 'addresses' ? 'active' : ''}
              onClick={() => setActiveTab('addresses')}
            >
              <SettingsIcon />
              <span>My Addresses</span>
            </li>
            <li onClick={handleLogout}>
              <LogoutIcon />
              <span>Logout</span>
            </li>
          </ul>
        </aside>

        
        {/* Main Content */}
        <main className="profile-main">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Profile;
