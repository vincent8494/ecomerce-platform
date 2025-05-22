import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuth } from '../store/slices/authSlice';

const Orders = () => {
  const navigate = useNavigate();
  const { user } = useSelector(selectAuth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        const data = await response.json();
        setOrders(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch orders');
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const handleOrderDetails = (orderId: string) => {
    navigate(`/order/${orderId}`);
  };

  const handleOrderCancel = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel order');
      }

      // Refresh orders list
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError('Failed to cancel order');
    }
  };

  const handleOrderReturn = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/return`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to request return');
      }

      // Refresh orders list
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError('Failed to request return');
    }
  };

  const getOrderStatusColor = (status: string) => {
    const statusColors = {
      pending: 'yellow',
      processing: 'blue',
      shipped: 'orange',
      delivered: 'green',
      cancelled: 'red',
      returned: 'purple',
    };

    return statusColors[status] || 'gray';
  };

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1>My Orders</h1>
        <div className="orders-filters">
          <select>
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="returned">Returned</option>
          </select>
        </div>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="orders-list">
        {orders.map((order: any) => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <div className="order-id">
                <span>Order #</span>
                <span>{order._id}</span>
              </div>
              <div className="order-date">
                <span>Date:</span>
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="order-items">
              {order.items.map((item: any) => (
                <div key={item._id} className="order-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ${item.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-summary">
              <div className="order-total">
                <span>Total:</span>
                <span>${order.total}</span>
              </div>
              <div className="order-status">
                <span
                  style={{
                    color: getOrderStatusColor(order.status),
                    fontWeight: 'bold',
                  }}
                >
                  {order.status}
                </span>
              </div>
            </div>

            <div className="order-actions">
              <button onClick={() => handleOrderDetails(order._id)}>
                View Details
              </button>
              {order.status === 'pending' && (
                <button
                  onClick={() => handleOrderCancel(order._id)}
                  className="cancel-order"
                >
                  Cancel Order
                </button>
              )}
              {order.status === 'delivered' && (
                <button
                  onClick={() => handleOrderReturn(order._id)}
                  className="return-order"
                >
                  Request Return
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        {/* Pagination controls will be added here */}
      </div>
    </div>
  );
};

export default Orders;
