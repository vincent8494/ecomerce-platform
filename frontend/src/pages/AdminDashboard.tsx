import { useState, useEffect } from 'react';
import {  } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuth } from '../store/slices/authSlice';

const AdminDashboard = () => {
  const history = useHistory();
  const { user } = useSelector(selectAuth);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
    recentOrders: [],
    recentProducts: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        const data = await response.json();
        setStats(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch admin statistics');
        setLoading(false);
      }
    };

    if (user && user.role === 'admin') {
      fetchAdminStats();
    }
  }, [user]);

  const handleManageProducts = () => {
    history.push('/admin/products');
  };

  const handleManageOrders = () => {
    history.push('/admin/orders');
  };

  const handleManageUsers = () => {
    history.push('/admin/users');
  };

  const handleManageCategories = () => {
    history.push('/admin/categories');
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-actions">
          <button onClick={handleManageProducts}>
            Manage Products
          </button>
          <button onClick={handleManageOrders}>
            Manage Orders
          </button>
          <button onClick={handleManageUsers}>
            Manage Users
          </button>
          <button onClick={handleManageCategories}>
            Manage Categories
          </button>
        </div>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p>{stats.totalOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p>${stats.totalRevenue}</p>
        </div>
        <div className="stat-card">
          <h3>Total Products</h3>
          <p>{stats.totalProducts}</p>
        </div>
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="recent-orders">
          <h2>Recent Orders</h2>
          <div className="orders-grid">
            {stats.recentOrders.map((order: any) => (
              <div key={order._id} className="order-card">
                <div className="order-info">
                  <span>Order #</span>
                  <span>{order._id}</span>
                </div>
                <div className="order-details">
                  <p>Customer: {order.customer.name}</p>
                  <p>Total: ${order.total}</p>
                  <p>Status: {order.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="recent-products">
          <h2>Recent Products</h2>
          <div className="products-grid">
            {stats.recentProducts.map((product: any) => (
              <div key={product._id} className="product-card">
                <img src={product.image} alt={product.name} />
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p>Price: ${product.price}</p>
                  <p>Stock: {product.stock}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-charts">
        <div className="sales-chart">
          <h2>Sales Overview</h2>
          {/* Sales chart component will be added here */}
        </div>
        <div className="inventory-chart">
          <h2>Inventory Levels</h2>
          {/* Inventory chart component will be added here */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
