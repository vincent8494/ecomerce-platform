import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCart, CartState } from '../store/slices/cartSlice';

type FormData = {
  shipping: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  billing: {
    sameAsShipping: boolean;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  payment: {
    method: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  };
};

const Checkout = () => {
  const navigate = useNavigate();
  const cart: CartState = useSelector(selectCart);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    shipping: {
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      phone: '',
    },
    billing: {
      sameAsShipping: true,
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      phone: '',
    },
    payment: {
      method: 'creditCard',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const steps = [
    'Shipping Address',
    'Billing Address',
    'Payment Method',
    'Review Order',
  ];

  const handleInputChange = (
    section: keyof FormData,
    field: string
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: e.target.value,
      },
    }));
  };

  const handleSameAsShipping = () => {
    setFormData(prev => ({
      ...prev,
      billing: {
        sameAsShipping: !prev.billing.sameAsShipping,
        ...prev.shipping,
      },
    }));
  };

  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      payment: {
        ...prev.payment,
        method: e.target.value,
      },
    }));
  };

  const handleNext = () => {
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shipping: formData.shipping,
          billing: formData.billing,
          payment: formData.payment,
          items: cart.items,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      const data = await response.json();
      navigate(`/order/${data.orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    let subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = cart.shipping || 0;
    const tax = (subtotal * 0.13).toFixed(2);
    const total = (subtotal + shipping + Number(tax)).toFixed(2);

    return { subtotal, shipping, tax, total };
  };

  const totals = calculateTotal();

  return (
    <div className="checkout-container">
      <div className="checkout-steps">
        {steps.map((step, index) => (
          <div
            key={step}
            className={`step ${index <= activeStep ? 'completed' : ''}`}
          >
            {step}
          </div>
        ))}
      </div>

      <div className="checkout-content">
        <div className="checkout-form">
          {activeStep === 0 && (
            <div className="shipping-form">
              <h2>Shipping Address</h2>
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  value={formData.shipping.firstName}
                  onChange={handleInputChange('shipping', 'firstName')}
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  value={formData.shipping.lastName}
                  onChange={handleInputChange('shipping', 'lastName')}
                  required
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  value={formData.shipping.address}
                  onChange={handleInputChange('shipping', 'address')}
                  required
                />
              </div>
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  value={formData.shipping.city}
                  onChange={handleInputChange('shipping', 'city')}
                  required
                />
              </div>
              <div className="form-group">
                <label>State/Province</label>
                <input
                  type="text"
                  value={formData.shipping.state}
                  onChange={handleInputChange('shipping', 'state')}
                  required
                />
              </div>
              <div className="form-group">
                <label>Postal Code</label>
                <input
                  type="text"
                  value={formData.shipping.postalCode}
                  onChange={handleInputChange('shipping', 'postalCode')}
                  required
                />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input
                  type="text"
                  value={formData.shipping.country}
                  onChange={handleInputChange('shipping', 'country')}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={formData.shipping.phone}
                  onChange={handleInputChange('shipping', 'phone')}
                  required
                />
              </div>
            </div>
          )}

          {activeStep === 1 && (
            <div className="billing-form">
              <h2>Billing Address</h2>
              <div className="form-group">
                <label>Same as Shipping Address</label>
                <input
                  type="checkbox"
                  checked={formData.billing.sameAsShipping}
                  onChange={handleSameAsShipping}
                />
              </div>
              {!formData.billing.sameAsShipping && (
                <>
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      value={formData.billing.firstName}
                      onChange={handleInputChange('billing', 'firstName')}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      value={formData.billing.lastName}
                      onChange={handleInputChange('billing', 'lastName')}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <input
                      type="text"
                      value={formData.billing.address}
                      onChange={handleInputChange('billing', 'address')}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      value={formData.billing.city}
                      onChange={handleInputChange('billing', 'city')}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>State/Province</label>
                    <input
                      type="text"
                      value={formData.billing.state}
                      onChange={handleInputChange('billing', 'state')}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Postal Code</label>
                    <input
                      type="text"
                      value={formData.billing.postalCode}
                      onChange={handleInputChange('billing', 'postalCode')}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Country</label>
                    <input
                      type="text"
                      value={formData.billing.country}
                      onChange={handleInputChange('billing', 'country')}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={formData.billing.phone}
                      onChange={handleInputChange('billing', 'phone')}
                      required
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {activeStep === 2 && (
            <div className="payment-form">
              <h2>Payment Method</h2>
              <div className="payment-methods">
                <div className="form-group">
                  <label>Payment Method</label>
                  <select
                    value={formData.payment.method}
                    onChange={handlePaymentMethodChange}
                  >
                    <option value="creditCard">Credit Card</option>
                    <option value="paypal">PayPal</option>
                    <option value="applePay">Apple Pay</option>
                    <option value="googlePay">Google Pay</option>
                  </select>
                </div>
                {formData.payment.method === 'creditCard' && (
                  <>
                    <div className="form-group">
                      <label>Card Number</label>
                      <input
                        type="text"
                        value={formData.payment.cardNumber}
                        onChange={handleInputChange('payment', 'cardNumber')}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input
                        type="text"
                        value={formData.payment.expiryDate}
                        onChange={handleInputChange('payment', 'expiryDate')}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input
                        type="text"
                        value={formData.payment.cvv}
                        onChange={handleInputChange('payment', 'cvv')}
                        required
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="order-review">
              <h2>Order Review</h2>
              <div className="order-summary">
                <div className="order-items">
                  {cart.items.map((item: any) => (
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
                <div className="order-totals">
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
                  <div className="total-row grand-total">
                    <span>Total:</span>
                    <span>${totals.total}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="checkout-actions">
            {activeStep > 0 && (
              <button onClick={handleBack}>Back</button>
            )}
            {activeStep < steps.length - 1 ? (
              <button onClick={handleNext}>Next</button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            )}
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default Checkout;
