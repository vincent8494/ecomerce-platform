import * as React from 'react';
import { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCart } from '../store/slices/cartSlice';
import type { CartState } from '../store/slices/cartSlice';
import type { RootState } from '../store/store';

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

const Checkout: React.FC = () => {
  const history = useHistory();
  const cart = useSelector<RootState, CartState>(selectCart);
  
  const [activeStep, setActiveStep] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [formData, setFormData] = React.useState<FormData>({
    shipping: {
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      phone: ''
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
      phone: ''
    },
    payment: {
      method: 'offline',
      cardNumber: '',
      expiryDate: '',
      cvv: ''
    }
  });
  
  const { subtotal, shipping, tax, total } = useMemo(() => {
    const calculatedSubtotal = cart.items.reduce((sum: number, item: any) => sum + (item.price * item.qty), 0);
    const calculatedShipping = cart.shippingPrice || 0;
    const calculatedTax = (calculatedSubtotal * 0.13).toFixed(2);
    const calculatedTotal = (calculatedSubtotal + calculatedShipping + Number(calculatedTax)).toFixed(2);
    
    return {
      subtotal: calculatedSubtotal.toFixed(2),
      shipping: calculatedShipping.toFixed(2),
      tax: calculatedTax,
      total: calculatedTotal
    };
  }, [cart]);

  const steps = ['Shipping Address', 'Billing Address', 'Review Order'];
  
  const handleNext = () => {
    setActiveStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shipping: formData.shipping,
          billing: formData.billing,
          items: cart.items,
          status: 'pending_payment',
          paymentMethod: 'offline',
          total: total,
          subtotal: subtotal,
          tax: tax,
          shippingCost: shipping
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      const data = await response.json();
      history.push(`/order/${data.orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

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

  const handleSameAsShipping = (e: React.ChangeEvent<HTMLInputElement>) => {    
    const isChecked = e.target.checked;
    setFormData(prev => ({
      ...prev,
      billing: isChecked 
        ? {
            ...prev.billing,
            sameAsShipping: true,
            firstName: prev.shipping.firstName,
            lastName: prev.shipping.lastName,
            address: prev.shipping.address,
            city: prev.shipping.city,
            state: prev.shipping.state,
            postalCode: prev.shipping.postalCode,
            country: prev.shipping.country,
            phone: prev.shipping.phone
          }
        : {
            ...prev.billing,
            sameAsShipping: false
          }
    }));
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1>Checkout</h1>
        <div className="checkout-progress">
          {steps.map((step, index) => (
            <div 
              key={step} 
              className={`step ${index === activeStep ? 'active' : ''} ${index < activeStep ? 'completed' : ''}`}
            >
              <div className="step-number">{index + 1}</div>
              <div className="step-label">{step}</div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="checkout-content">
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
                <div className="form-row">
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
                </div>
                <div className="form-row">
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
                    <select
                      value={formData.shipping.country}
                      onChange={handleInputChange('shipping', 'country')}
                      required
                    >
                      <option value="">Select Country</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="AU">Australia</option>
                    </select>
                  </div>
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
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.billing.sameAsShipping}
                      onChange={handleSameAsShipping}
                    />
                    Same as shipping address
                  </label>
                </div>

                {!formData.billing.sameAsShipping && (
                  <>
                    <div className="form-group">
                      <label>First Name</label>
                      <input
                        type="text"
                        value={formData.billing.firstName}
                        onChange={handleInputChange('billing', 'firstName')}
                        required={!formData.billing.sameAsShipping}
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input
                        type="text"
                        value={formData.billing.lastName}
                        onChange={handleInputChange('billing', 'lastName')}
                        required={!formData.billing.sameAsShipping}
                      />
                    </div>
                    <div className="form-group">
                      <label>Address</label>
                      <input
                        type="text"
                        value={formData.billing.address}
                        onChange={handleInputChange('billing', 'address')}
                        required={!formData.billing.sameAsShipping}
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>City</label>
                        <input
                          type="text"
                          value={formData.billing.city}
                          onChange={handleInputChange('billing', 'city')}
                          required={!formData.billing.sameAsShipping}
                        />
                      </div>
                      <div className="form-group">
                        <label>State/Province</label>
                        <input
                          type="text"
                          value={formData.billing.state}
                          onChange={handleInputChange('billing', 'state')}
                          required={!formData.billing.sameAsShipping}
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Postal Code</label>
                        <input
                          type="text"
                          value={formData.billing.postalCode}
                          onChange={handleInputChange('billing', 'postalCode')}
                          required={!formData.billing.sameAsShipping}
                        />
                      </div>
                      <div className="form-group">
                        <label>Country</label>
                        <select
                          value={formData.billing.country}
                          onChange={handleInputChange('billing', 'country')}
                          required={!formData.billing.sameAsShipping}
                        >
                          <option value="">Select Country</option>
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="UK">United Kingdom</option>
                          <option value="AU">Australia</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        type="tel"
                        value={formData.billing.phone}
                        onChange={handleInputChange('billing', 'phone')}
                        required={!formData.billing.sameAsShipping}
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {activeStep === 2 && (
              <div className="order-review">
                <h2>Order Review</h2>
                <div className="order-summary">
                  <h3>Order Summary</h3>
                  {cart.items.map((item) => (
                    <div key={item._id} className="order-item">
                      <div className="item-image">
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className="item-details">
                        <h4>{item.name}</h4>
                        <p>Quantity: {item.qty}</p>
                        <p>Price: ${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                  <div className="order-totals">
                    <div className="total-row">
                      <span>Subtotal:</span>
                      <span>${subtotal}</span>
                    </div>
                    <div className="total-row">
                      <span>Shipping:</span>
                      <span>${shipping}</span>
                    </div>
                    <div className="total-row">
                      <span>Tax (13%):</span>
                      <span>${tax}</span>
                    </div>
                    <div className="total-row grand-total">
                      <span>Total:</span>
                      <span>${total}</span>
                    </div>
                  </div>
                </div>
                <div className="payment-notice">
                  <h3>Payment Information</h3>
                  <p>Payment will be processed offline. Our team will contact you shortly to complete the payment process.</p>
                </div>
              </div>
            )}
          </div>

          <div className="checkout-actions">
            {activeStep > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="btn-back"
                disabled={loading}
              >
                Back
              </button>
            )}
            {activeStep === steps.length - 1 ? (
              <button
                type="submit"
                className="btn-confirm"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Confirm Order'}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="btn-next"
                disabled={loading}
              >
                Next
              </button>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default Checkout;
