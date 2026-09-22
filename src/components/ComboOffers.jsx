import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ShoppingCart } from './Icons';

const ComboOffers = ({ onAddToCart }) => {
  const [comboOffers, setComboOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchComboOffers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/combo-offers');
        if (response.ok) {
          const data = await response.json();
          setComboOffers(data);
        }
      } catch (error) {
        console.error("Error fetching combo offers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComboOffers();
  }, []);

  const handleAddToCartClick = (offer, qty) => {
    if (onAddToCart) {
      onAddToCart({
        id: 'combo_' + offer.combo_offer_id,
        name: offer.combo_offer_name,
        price: Number(offer.combo_offer_amount),
        image: `http://localhost:5000/combo_images/${offer.combo_offer_image}`,
        category: 'Combo Offer',
        quantity: qty
      });
    }
  };

  if (loading || comboOffers.length === 0) {
    return null; // Don't show the section if loading or empty
  }

  return (
    <section id="combo-offers-section" className="featured-section animate-slide-up" style={{ background: 'var(--bg-secondary)', padding: '4rem 5%' }}>
      <div className="section-header-centered">
        <span className="badge badge-primary" style={{ background: 'var(--primary-color)', color: 'white' }}>Special Deals</span>
        <h2>Exclusive Combo Offers</h2>
        <p>Grab our specially curated combo packs at discounted prices. Perfect for your daily health routine!</p>
      </div>

      <div className="products-grid" style={{ marginTop: '2rem' }}>
        {comboOffers.map((offer) => (
          <div key={offer.combo_offer_id} className="product-card glass animate-slide-up">
            <span className="featured-tag badge badge-accent" style={{ backgroundColor: '#eab308' }}>Combo</span>

            <div className="card-image-wrapper" onClick={() => { setSelectedOffer(offer); setQuantity(1); }}>
              <img
                src={`http://localhost:5000/combo_images/${offer.combo_offer_image}`}
                alt={offer.combo_offer_name}
                className="card-image"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x300?text=Combo+Offer' }}
              />
              <div className="card-overlay">
                <span className="overlay-text">Quick View</span>
              </div>
            </div>

            <div className="card-info">
              <div className="card-header-row">
                <span className="card-category">Special Deal</span>
              </div>
              <h4 
                className="card-title" 
                onClick={() => { setSelectedOffer(offer); setQuantity(1); }}
                style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px', cursor: 'pointer', color: 'var(--text-primary)' }}
              >
                {offer.combo_offer_name}
              </h4>
              <div className="card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '12px', borderTop: '1px dashed var(--border-color)' }}>
                <span className="card-price" style={{ fontWeight: '800', fontSize: '16px', color: 'var(--text-primary)' }}>
                  ₹{Number(offer.combo_offer_amount).toFixed(2)}
                </span>
                <button
                  className="btn btn-primary card-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCartClick(offer, 1);
                  }}
                  aria-label={`Add ${offer.combo_offer_name} to cart`}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', height: '32px', fontSize: '13px', padding: '0 12px' }}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Offer Modal */}
      {selectedOffer && createPortal(
        <div className="modal-backdrop animate-fade-in" onClick={() => setSelectedOffer(null)}>
          <div className="modal-content glass animate-zoom" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedOffer(null)} aria-label="Close details">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <div className="modal-grid">
              {/* Left Column: Image */}
              <div className="modal-image-panel">
                <img 
                  src={`http://localhost:5000/combo_images/${selectedOffer.combo_offer_image}`}
                  alt={selectedOffer.combo_offer_name}
                  className="modal-image"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x300?text=Combo+Offer' }}
                />
              </div>

              {/* Right Column: Info */}
              <div className="modal-info-panel">
                <h2 className="modal-title">
                  {selectedOffer.combo_offer_name}
                </h2>

                <div className="modal-price">
                  ₹{selectedOffer.combo_offer_amount}
                </div>

                <p className="modal-description">
                  Grab our specially curated combo pack at a discounted price. Perfect for your daily health routine!
                </p>

                {/* Quantity and Actions */}
                <div className="actions-section">
                  <div className="quantity-selector">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="qty-btn">-</button>
                    <span className="qty-value">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="qty-btn">+</button>
                  </div>

                  <button className="btn btn-primary action-btn" onClick={() => { handleAddToCartClick(selectedOffer, quantity); setSelectedOffer(null); }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      , document.body)}

      <style>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 99999;
          padding: 16px;
          box-sizing: border-box;
        }
        .modal-content {
          width: 100%;
          max-width: 900px;
          max-height: 90vh;
          border-radius: var(--radius-lg);
          padding: 32px;
          position: relative;
          overflow-y: auto;
          box-shadow: var(--shadow-xl);
          background-color: var(--bg-secondary);
          box-sizing: border-box;
          margin: auto;
        }
        @media (max-width: 640px) {
          .modal-content {
            padding: 20px;
            max-height: 90vh;
            width: 100%;
            max-width: 100%;
            margin: 0;
          }
          .modal-grid {
            grid-template-columns: 1fr;
            gap: 20px;
            width: 100%;
          }
          .modal-image-panel, .modal-info-panel {
            min-width: 0;
          }
        }
        .modal-close {
          position: absolute;
          top: 20px;
          right: 20px;
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 6px;
          border-radius: var(--radius-full);
          transition: all 0.2s ease;
          z-index: 10;
        }
        .modal-close:hover {
          background-color: var(--bg-tertiary);
          color: var(--text-primary);
        }

        .modal-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 36px;
          margin-top: 12px;
        }
        @media (max-width: 768px) {
          .modal-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }

        .modal-image-panel {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--bg-tertiary);
          border-radius: var(--radius-md);
          overflow: hidden;
          height: 380px;
        }
        @media (max-width: 768px) {
          .modal-image-panel {
            height: 280px;
          }
        }
        .modal-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 1.5rem;
        }

        .modal-info-panel {
          display: flex;
          flex-direction: column;
          text-align: left;
        }
        .modal-info-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          width: 100%;
        }
        .modal-title {
          font-size: 18px;
          font-weight: 800;
          margin-bottom: 8px;
          line-height: 1.2;
        }
        .modal-price {
          font-size: 20px;
          font-weight: 800;
          color: var(--accent-primary);
          margin-bottom: 16px;
        }
        .modal-description {
          font-size: 13.5px;
          color: var(--text-secondary);
          margin-bottom: 24px;
        }

        .actions-section {
          display: flex;
          gap: 16px;
          margin-bottom: 32px;
          align-items: center;
        }
        .quantity-selector {
          display: flex;
          align-items: center;
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        .qty-btn {
          border: none;
          background: none;
          width: 38px;
          height: 38px;
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .qty-btn:hover {
          background-color: var(--border-color);
        }
        .qty-value {
          width: 32px;
          text-align: center;
          font-weight: 700;
          font-size: 15px;
          color: var(--text-primary);
        }
        .action-btn {
          flex-grow: 1;
          height: 40px;
        }
        .animate-zoom {
          animation: modalZoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </section>
  );
};

export default ComboOffers;
