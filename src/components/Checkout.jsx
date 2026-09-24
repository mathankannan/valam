import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, ShoppingCart } from './Icons';
import ProductImage from './ProductImage';
import './Checkout.css';

export default function Checkout({ cartItems, onClearCart, onNavigateHome }) {
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    address: '',
    city: '',
    pincode: '',
    landmark: '',
    email: ''
  });

  //console.log(formData);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [orderedItems, setOrderedItems] = useState([]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newOrderNum = 'VALAM-' + Math.floor(100000 + Math.random() * 900000);
    const orderData = {
      OrderNumber: newOrderNum,
      EstimatedDelivery: '3 - 5 Business Days',
      ItemsOrdered: cartItems.map(item => ({ Name: item.name.split(' - ')[0], Quantity: item.quantity })),
      ShipTo: formData.name,
      MobileNumber: formData.mobileNumber,
      Address: formData.address,
      City: formData.city,
      Pincode: formData.pincode
    };

    try {
      // Sending data to the API
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        console.log('✅ Order Saved to MySQL Database Successfully!');
        setLoading(false);
        setIsSubmitted(true);
        setOrderNumber(newOrderNum);
        setOrderedItems([...cartItems]);
        onClearCart();
      } else {
        console.error("Failed to save order");
        setLoading(false);
        alert("Failed to place order. Database error.");
      }
    } catch (error) {
      console.error("Error connecting to API:", error);
      setLoading(false);
      alert("Server Connection Error! Is the Node API running?");
    }
  };

  if (isSubmitted) {
    return (
      <div className="checkout-success-container animate-fade-in glass">
        <div className="success-icon-wrapper">
          <div className="success-checkmark animate-scale">
            <Check className="w-10 h-10 text-white" strokeWidth={3} />
          </div>
        </div>

        <h2 className="success-heading">Order Placed Successfully!</h2>
        <p className="success-subheading">Thank you for your purchase. We have received your order.</p>

        <div className="receipt-card glass">
          <div className="receipt-row">
            <span className="receipt-label">Order Number</span>
            <span className="receipt-value font-mono">{orderNumber}</span>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">Estimated Delivery</span>
            <span className="receipt-value">3 - 5 Business Days</span>
          </div>
          <div className="receipt-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '12px', marginTop: '4px' }}>
            <span className="receipt-label">Items Ordered</span>
            <div className="receipt-items-container" style={{ width: '100%', maxWidth: '100%', alignItems: 'stretch' }}>
              {orderedItems.map((item, index) => (
                <div key={index} className="receipt-ordered-item" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="item-name" style={{ textAlign: 'left' }}>{item.name.split(' - ')[0]}</span>
                  <span className="item-qty">{item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="receipt-divider"></div>
          <div className="receipt-row">
            <span className="receipt-label">Ship To</span>
            <span className="receipt-value">{formData.name}</span>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">Mobile Number</span>
            <span className="receipt-value">{formData.mobileNumber}</span>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">Address</span>
            <span className="receipt-value">{formData.address}</span>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">City</span>
            <span className="receipt-value">{formData.city}</span>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">Pincode</span>
            <span className="receipt-value">{formData.pincode}</span>
          </div>
        </div>

        <button className="btn btn-primary continue-btn" onClick={onNavigateHome}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-container animate-fade-in">
      <div className="checkout-back-nav">
        <button className="btn btn-secondary btn-sm" onClick={onNavigateHome}>
          <ArrowLeft className="w-4 h-4" />
          Back to Store
        </button>
      </div>

      {/* <h2 className="checkout-title">Secure Order</h2> */}

      <div className="checkout-grid">
        {/* Top/Right Column: Order Summary */}
        <div className="checkout-summary-panel">
          <div className="summary-card glass">
            <h3 className="section-title">Order Summary</h3>

            <div className="checkout-items-list">
              {cartItems.map((item, index) => (
                <div key={`${item.id}-${item.selectedColor || index}`} className="summary-item">
                  <ProductImage category={item.category} name={item.name} image={item.image} className="summary-item-img" />
                  <div className="summary-item-info">
                    <h4>
                      {item.name.includes(' - ') ? item.name.split(' - ')[0] : item.name}
                    </h4>

                    <span className="summary-item-qty">Qty: {item.quantity}</span>
                  </div>
                  <span className="summary-item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="summary-pricing">
              <div className="summary-row total-row">
                <span>Total Due</span>
                <span className="pricing-total">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom/Left Column: Forms */}
        <form onSubmit={handleFormSubmit} className="checkout-forms-panel">

          {/* Shipping Section */}
          <div className="form-section glass">
            <h3 className="section-title">Shipping Details</h3>
            <div className="form-grid">
              <div className="input-group">
                <label>Name <span className="required-asterisk">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your name"
                />
              </div>
              <div className="input-group">
                <label>Mobile Number <span className="required-asterisk">*</span></label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your mobile number"
                />
              </div>
              <div className="input-group full-width">
                <label>Address <span className="required-asterisk">*</span></label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  placeholder="Enter your full address"
                ></textarea>
              </div>
              <div className="input-group">
                <label>City / Town <span className="required-asterisk">*</span></label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  placeholder="City or Town"
                />
              </div>
              <div className="input-group">
                <label>Pincode <span className="required-asterisk">*</span></label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  required
                  placeholder="6-digit Pincode"
                />
              </div>
              <div className="input-group">
                <label>Landmark (Optional)</label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleInputChange}
                  placeholder="e.g. Near Bus Stand"
                />
              </div>
              <div className="input-group">
                <label>Email (Optional)</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="For order updates"
                />
              </div>
            </div>
          </div>

          {/* Payment Section */}

          <button
            type="submit"
            className="btn btn-primary place-order-btn"
            disabled={loading || cartItems.length === 0}
          >
            {loading ? (
              <span className="loader-spinner">Processing Order...</span>
            ) : (
              <>Send Order (₹{total.toFixed(2)})</>
            )}
          </button>
        </form>
      </div>


    </div>
  );
}
