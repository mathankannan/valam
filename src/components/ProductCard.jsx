import React from 'react';
import { Star, ShoppingCart } from './Icons';
import ProductImage from './ProductImage';

export default function ProductCard({ product, onAddToCart, onSelect }) {
  const { id, name, category, price, rating, reviews, image, featured, netWeight } = product;

  return (
    <div className="product-card glass animate-slide-up">
      {featured && (
        <span className="featured-tag badge badge-accent">Featured</span>
      )}

      <div className="card-image-wrapper" onClick={() => onSelect(product)}>
        <ProductImage category={category} name={name} image={image} className="card-image" />
        <div className="card-overlay">
          <span className="overlay-text">Quick View</span>
        </div>
      </div>

      <div className="card-info">
        <div className="card-header-row">
          <span className="card-category">{category}</span>
          {netWeight && <span className="card-weight">{netWeight}</span>}
        </div>

        <div className="card-footer">
          <span className="card-price">₹{price.toFixed(2)}</span>
          <button
            className="btn btn-primary card-btn"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            aria-label={`Add ${name} to cart`}
          >
            <ShoppingCart className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      <style>{`
        .product-card {
          position: relative;
          display: flex;
          flex-direction: column;
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          height: 100%;
        }
        .product-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-xl);
          border-color: var(--accent-primary);
        }
        
        .featured-tag {
          position: absolute;
          top: 12px;
          left: 12px;
          z-index: 10;
          backdrop-filter: blur(8px);
          background-color: rgba(99, 102, 241, 0.9);
          color: white;
          font-weight: 600;
          font-size: 10px;
        }

        .card-image-wrapper {
          position: relative;
          width: 100%;
          height: 220px;
          overflow: hidden;
          cursor: pointer;
          background-color: var(--bg-tertiary);
        }
        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .product-card:hover .card-image {
          transform: scale(1.08);
        }
        .card-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(15, 23, 42, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .card-image-wrapper:hover .card-overlay {
          opacity: 1;
        }
        .overlay-text {
          color: white;
          font-size: 13px;
          font-weight: 600;
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.25);
          border-radius: var(--radius-full);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .card-info {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          text-align: left;
        }
        .card-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .card-category {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 0;
        }
        .card-weight {
          font-size: 11px;
          font-weight: 700;
          color: var(--accent-primary);
          background: rgba(99, 102, 241, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
        }
        .card-title {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 8px;
          color: var(--text-primary);
          line-height: 1.4;
          cursor: pointer;
          flex-grow: 1;
        }
        .card-title:hover {
          color: var(--accent-primary);
        }

        .card-rating {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 16px;
        }
        .stars {
          display: flex;
          gap: 2px;
        }
        .text-amber {
          color: #fbbf24;
        }
        .text-gray {
          color: var(--border-color);
        }
        .rating-count {
          font-size: 12px;
          color: var(--text-secondary);
        }

        .card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
        }
        .card-price {
          font-size: 18px;
          font-weight: 800;
          color: var(--text-primary);
        }
        .card-btn {
          padding: 8px 14px;
          font-size: 12px;
          gap: 6px;
        }
      `}</style>
    </div>
  );
}
