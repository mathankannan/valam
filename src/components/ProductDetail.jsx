import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Star, ShoppingCart } from './Icons';
import ProductImage from './ProductImage';

export default function ProductDetail({ product, onClose, onAddToCart }) {
  const { name, category, price, rating, reviews, image, description, specs, colors, ingredientsEn, ingredientsTa, netWeight, shelfLife } = product;
  const [selectedColor, setSelectedColor] = useState(colors ? colors[0] : null);
  const [quantity, setQuantity] = useState(1);
  const [lang, setLang] = useState('en');

  const handleAddToCart = () => {
    onAddToCart({ ...product, selectedColor, quantity });
    onClose();
  };

  return createPortal(
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div className="modal-content glass animate-zoom" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className="modal-close" onClick={onClose} aria-label="Close details">
          <X className="w-6 h-6" />
        </button>

        <div className="modal-grid">
          {/* Left Column: Image */}
          <div className="modal-image-panel">
            <ProductImage category={category} name={name} image={image} className="modal-image" />
          </div>

          {/* Right Column: Info */}
          <div className="modal-info-panel">
            <div className="modal-info-header">
              {product.descriptionTa && (
                <div className="lang-switch-container">
                  <span className={`lang-label ${lang === 'en' ? 'active' : ''}`}>EN</span>
                  <button
                    className={`lang-switch-toggle ${lang === 'ta' ? 'toggled' : ''}`}
                    onClick={() => setLang(lang === 'en' ? 'ta' : 'en')}
                    aria-label="Toggle language"
                  >
                    <span className="lang-switch-handle"></span>
                  </button>
                  <span className={`lang-label ${lang === 'ta' ? 'active' : ''}`}>தமிழ்</span>
                </div>
              )}
            </div>
            <h2 className="modal-title">
              {name.includes(' - ') ? (
                lang === 'en' ? name.split(' - ')[0] : name.split(' - ')[1]
              ) : name}
            </h2>



            <div className="modal-price">₹{price.toFixed(2)}</div>

            <p className="modal-description">{lang === 'ta' && product.descriptionTa ? product.descriptionTa : description}</p>



            {/* Quantity and Actions */}
            <div className="actions-section">
              <div className="quantity-selector">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="qty-btn"
                >
                  -
                </button>
                <span className="qty-value">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="qty-btn"
                >
                  +
                </button>
              </div>

              <button className="btn btn-primary action-btn" onClick={handleAddToCart}>
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
            </div>
          </div>


          <div className="specs-section">
            <div className="specs-header">
              <h4 className="specs-title">
                {lang === 'ta' ? 'தொழில்நுட்ப விவரங்கள்' : 'Technical Specifications'}
              </h4>
            </div>
            <div className="specs-table">

              {(ingredientsEn || ingredientsTa) && (
                <div className="spec-row">
                  <span className="spec-name">
                    {lang === 'ta' ? 'உள்ளடக்கிய பொருட்கள்:' : 'Ingredients Included:'}
                  </span>
                  <span className="spec-value">
                    {lang === 'ta' && ingredientsTa ? ingredientsTa : ingredientsEn}
                  </span>
                </div>
              )}

              {netWeight && (
                <div className="spec-row">
                  <span className="spec-name">
                    {lang === 'ta' ? 'நிகர எடை' : 'Net Weight'}
                  </span>
                  <span className="spec-value">
                    {lang === 'ta' && typeof netWeight === 'string' 
                      ? netWeight.replace(/g/i, ' கிராம்').replace(/kg/i, ' கிலோ') 
                      : netWeight}
                  </span>
                </div>
              )}

              {shelfLife && (
                <div className="spec-row">
                  <span className="spec-name">
                    {lang === 'ta' ? 'பயன்பாட்டு காலம்' : 'Shelf Life'}
                  </span>
                  <span className="spec-value">
                    {lang === 'ta' && typeof shelfLife === 'string'
                      ? shelfLife.replace(/months?/i, ' மாதங்கள்').replace(/years?/i, ' வருடங்கள்')
                      : shelfLife}
                  </span>
                </div>
              )}

              <div className="spec-row">
                <span className="spec-name">
                  {lang === 'ta' ? 'பதப்படுத்திகள்' : 'Preservatives'}
                </span>
                <span className="spec-value">
                  {lang === 'ta' ? 'ரசாயனங்கள் சேர்க்கப்படவில்லை' : 'No Chemicals'}
                </span>
              </div>

            </div>
          </div>





        </div>
      </div>

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
          object-fit: cover;
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
        .modal-category {
          align-self: flex-start;
          margin-bottom: 0;
        }
        .modal-title {
          font-size: 18px;
          font-weight: 800;
          margin-bottom: 8px;
          line-height: 1.2;
        }
        .modal-rating {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }
        .rating-text {
          font-size: 13px;
          color: var(--text-secondary);
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

        .option-section {
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .option-label {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-primary);
        }
        .color-swatches {
          display: flex;
          gap: 10px;
        }
        .color-swatch {
          width: 24px;
          height: 24px;
          border-radius: var(--radius-full);
          border: 2px solid transparent;
          cursor: pointer;
          position: relative;
          box-shadow: var(--shadow-sm);
        }
        .color-swatch.active {
          border-color: var(--accent-primary);
          transform: scale(1.1);
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

        .specs-section {
          grid-column: 1 / -1;
          border-top: 1px solid var(--border-color);
          padding-top: 24px;
          margin-top: 12px;
        }
        .specs-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .specs-title {
          font-size: 15px;
          font-weight: 700;
          margin-bottom: 0;
        }
        
        /* Language Toggle Switch Styling */
        .lang-switch-container {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--bg-tertiary);
          padding: 4px 8px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-color);
        }
        .lang-label {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
          transition: color 0.3s ease;
        }
        .lang-label.active {
          color: var(--accent-primary);
        }
        .lang-switch-toggle {
          position: relative;
          width: 36px;
          height: 20px;
          border-radius: var(--radius-full);
          background-color: var(--border-color);
          border: none;
          cursor: pointer;
          transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 0;
          display: inline-flex;
          align-items: center;
        }
        .lang-switch-toggle.toggled {
          background-color: var(--accent-primary);
        }
        .lang-switch-handle {
          position: absolute;
          left: 2px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: #ffffff;
          box-shadow: var(--shadow-sm);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .lang-switch-toggle.toggled .lang-switch-handle {
          transform: translateX(16px);
        }
        .specs-table {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .spec-row {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          padding: 10px 14px;
          background-color: var(--bg-tertiary);
          border-radius: var(--radius-sm);
          font-size: 13px;
          align-items: flex-start;
        }
        .spec-name {
          color: var(--text-secondary);
          font-weight: 600;
          flex-shrink: 0;
          min-width: 140px;
        }
        .spec-value {
          color: var(--text-primary);
          font-weight: 500;
          text-align: left;
          white-space: pre-line;
          line-height: 1.7;
        }

        .animate-zoom {
          animation: modalZoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </div>,
    document.body
  );
}
