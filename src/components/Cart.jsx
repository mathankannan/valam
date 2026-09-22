import React from 'react';
import { X, Trash, Plus, Minus, ArrowRight, ShoppingCart } from './Icons';
import ProductImage from './ProductImage';

export default function Cart({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}) {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal;

  const handleCheckoutClick = () => {
    onClose();
    onCheckout();
  };

  return (
    <div className="cart-backdrop animate-fade-in" onClick={onClose}>
      <div className="cart-panel glass animate-slide-right" onClick={(e) => e.stopPropagation()}>
        {/* Cart Header */}
        <div className="cart-header">
          <div className="header-title-group">
            <ShoppingCart className="w-5 h-5 text-accent" />
            <h3>Your Cart</h3>
            <span className="badge badge-accent">{cartItems.length}</span>
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Close cart">
            <X className="w-5 h-5" />
          </button>
        </div>



        {/* Cart Items List */}
        <div className="cart-items-container">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-icon-wrapper">
                <ShoppingCart className="w-10 h-10 text-muted" />
              </div>
              <p className="empty-title">Your cart is empty</p>
              <p className="empty-desc">Add some high-performance gadgets to get started.</p>
              <button className="btn btn-primary" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div key={`${item.id}-${item.selectedColor || index}`} className="cart-item glass">
                <ProductImage category={item.category} name={item.name} image={item.image} className="cart-item-img" />
                <div className="cart-item-details">
                  <h4 className="cart-item-name">
                    {item.name.includes(' - ') ? item.name.split(' - ')[0] : item.name}
                  </h4>



                  <div className="cart-item-footer">
                    <span className="cart-item-price">₹{(item.price * item.quantity).toFixed(2)}</span>

                    <div className="item-qty-selector">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.selectedColor, item.quantity - 1)}
                        className="item-qty-btn"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="item-qty-val">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.selectedColor, item.quantity + 1)}
                        className="item-qty-btn"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  className="cart-item-remove"
                  onClick={() => onRemoveItem(item.id, item.selectedColor)}
                  aria-label={`Remove ${item.name} from cart`}
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Cart Summary */}
        {cartItems.length > 0 && (
          <div className="cart-summary glass">
            <div className="summary-row total-row">
              <span>Total</span>
              <span className="total-amount">₹{total.toFixed(2)}</span>
            </div>

            <button className="btn btn-primary checkout-btn" onClick={handleCheckoutClick}>
              Proceed to Order
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <style>{`
        .cart-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(8px);
          z-index: 110;
        }
        .cart-panel {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          max-width: 440px;
          height: 100vh;
          background-color: var(--bg-secondary);
          box-shadow: var(--shadow-xl);
          display: flex;
          flex-direction: column;
          padding: 24px;
          z-index: 111;
        }
        @media (max-width: 768px) {
          .cart-panel {
            max-width: 100%;
            width: 100%;
            padding: 16px;
          }
        }

        .cart-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .header-title-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .header-title-group h3 {
          font-size: 20px;
          font-weight: 800;
        }

        .shipping-progress-container {
          margin-bottom: 24px;
          background-color: var(--bg-tertiary);
          padding: 12px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
        }
        .shipping-progress-text {
          font-size: 13px;
          color: var(--text-secondary);
          margin-bottom: 8px;
          text-align: left;
        }
        .progress-bar-bg {
          width: 100%;
          height: 6px;
          background-color: var(--border-color);
          border-radius: var(--radius-full);
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
          border-radius: var(--radius-full);
          transition: width 0.3s ease;
        }

        .cart-items-container {
          flex-grow: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
          padding-right: 4px;
        }
        .empty-cart {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          height: 60%;
          padding: 20px;
        }
        .empty-icon-wrapper {
          width: 80px;
          height: 80px;
          border-radius: var(--radius-full);
          background-color: var(--bg-tertiary);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }
        .empty-title {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 8px;
          color: var(--text-primary);
        }
        .empty-desc {
          font-size: 14px;
          color: var(--text-secondary);
          margin-bottom: 24px;
          max-width: 260px;
        }

        .cart-item {
          display: flex;
          gap: 16px;
          padding: 12px;
          border-radius: var(--radius-md);
          position: relative;
          align-items: center;
          background-color: var(--bg-secondary);
        }
        .cart-item-img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: var(--radius-sm);
          background-color: var(--bg-tertiary);
        }
        .cart-item-details {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          text-align: left;
          gap: 6px;
        }
        .cart-item-name {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-primary);
          padding-right: 20px;
        }
        .cart-item-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: var(--text-secondary);
        }
        .meta-color-dot {
          width: 12px;
          height: 12px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-color);
        }
        .cart-item-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .cart-item-price {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .item-qty-selector {
          display: flex;
          align-items: center;
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
        }
        .item-qty-btn {
          background: none;
          border: none;
          width: 24px;
          height: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
        }
        .item-qty-btn:hover {
          background-color: var(--border-color);
          color: var(--text-primary);
        }
        .item-qty-val {
          width: 24px;
          text-align: center;
          font-size: 12px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .cart-item-remove {
          position: absolute;
          top: 12px;
          right: 12px;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
        }
        .cart-item-remove:hover {
          color: #ef4444;
        }

        .cart-summary {
          margin-top: auto;
          padding: 20px;
          border-radius: var(--radius-md);
          background-color: var(--bg-tertiary);
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: var(--text-secondary);
          margin-bottom: 10px;
        }
        .summary-divider {
          height: 1px;
          background-color: var(--border-color);
          margin: 12px 0;
        }
        .total-row {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
        }
        .total-amount {
          font-size: 20px;
          font-weight: 800;
          color: var(--accent-primary);
        }
        .checkout-btn {
          width: 100%;
          margin-top: 16px;
          gap: 8px;
          height: 48px;
        }

        .animate-slide-right {
          animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
