import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCart, removeFromCart, updateCartItem } from '../store/slices/cartSlice';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector(selectCart);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [giftCard, setGiftCard] = useState('');
  const [giftCardDiscount, setGiftCardDiscount] = useState(0);

  useEffect(() => {
    // Fetch cart items from backend
    const fetchCart = async () => {
      try {
        const response = await fetch('/api/cart');
        await response.json(); // Response is not currently used
        // Update cart state with the response data when needed
      } catch (err) {
        console.error('Failed to fetch cart:', err);
      }
    };

    fetchCart();
  }, []);

  const handleQuantityChange = (productId: string, newQty: number) => {
    if (newQty < 1) return;
    dispatch(updateCartItem({
      productId,
      qty: newQty,
    }));
  };

  const handleRemoveItem = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  const handleApplyCoupon = async () => {
    try {
      const response = await fetch('/api/coupons/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: coupon }),
      });
      const data = await response.json();
      setDiscount(data.discount);
    } catch (err) {
      console.error('Failed to apply coupon:', err);
    }
  };

  const handleApplyGiftCard = async () => {
    try {
      const response = await fetch('/api/gift-cards/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: giftCard }),
      });
      const data = await response.json();
      setGiftCardDiscount(data.discount);
    } catch (err) {
      console.error('Failed to apply gift card:', err);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const calculateTotal = () => {
    let subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const shipping = cart.shippingPrice || 0;
    const tax = (subtotal * 0.13).toFixed(2);
    const total = (subtotal + shipping + Number(tax) - discount - giftCardDiscount).toFixed(2);

    return { subtotal, shipping, tax, total };
  };

  const totals = calculateTotal();

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <p>{cart.items.length} items in cart</p>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {cart.items.map((item: any) => (
            <div key={item._id} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item-image" />
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p className="cart-item-price">${item.price}</p>
                <div className="cart-item-quantity">
                  <button
                    onClick={() => handleQuantityChange(item._id, (item.qty || 1) - 1)}
                    disabled={item.qty <= 1}
                  >
                    -
                  </button>
                  <span>{item.qty}</span>
                  <button
                    onClick={() => handleQuantityChange(item._id, (item.qty || 0) + 1)}
                  >
                    +
                  </button>
                </div>
                <p className="cart-item-total">
                  Subtotal: ${(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => handleRemoveItem(item._id)}
                  className="remove-item"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-section">
            <label htmlFor="coupon">Coupon Code:</label>
            <div className="coupon-input">
              <input
                type="text"
                id="coupon"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
              <button onClick={handleApplyCoupon}>Apply</button>
            </div>
          </div>

          <div className="summary-section">
            <label htmlFor="gift-card">Gift Card:</label>
            <div className="gift-card-input">
              <input
                type="text"
                id="gift-card"
                value={giftCard}
                onChange={(e) => setGiftCard(e.target.value)}
              />
              <button onClick={handleApplyGiftCard}>Apply</button>
            </div>
          </div>

          <div className="summary-totals">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>${totals.subtotal}</span>
            </div>
            <div className="total-row">
              <span>Shipping:</span>
              <span>${totals.shipping}</span>
            </div>
            <div className="total-row">
              <span>Tax (13%):</span>
              <span>${totals.tax}</span>
            </div>
            <div className="total-row">
              <span>Discount:</span>
              <span>-${discount}</span>
            </div>
            <div className="total-row">
              <span>Gift Card:</span>
              <span>-${giftCardDiscount}</span>
            </div>
            <div className="total-row grand-total">
              <span>Total:</span>
              <span>${totals.total}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            className="checkout-button"
            disabled={cart.items.length === 0}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>

      <div className="cart-empty-message" style={{ display: cart.items.length === 0 ? 'block' : 'none' }}>
        <p>Your cart is empty</p>
        <button onClick={() => navigate('/')}>Continue Shopping</button>
      </div>
    </div>
  );
};

export default Cart;
