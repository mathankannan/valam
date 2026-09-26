import React, { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Heart } from './Icons';

export default function Hero({ setActiveView }) {
  const slideImages = [
    '/home-image1.avif',
    '/home-image2.jpeg',
    '/home-image3.avif',
    '/home-image4.jpeg',
    '/home-image5.jpeg',
    '/home-image6.jpg',
    '/home-image7.jpeg',
    '/home-image8.jpeg',
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero-container animate-fade-in">
      {/* Ambient Floating Glow Blobs */}
      <div className="hero-blob blob-1"></div>
      <div className="hero-blob blob-2"></div>

      <div className="hero-content">
        <div className="badge badge-accent hero-tag">100% Natural & Organic</div>
        <h1 className="hero-title">
          Traditional & Pure <span className="gradient-text">Homemade Food Powders</span>
        </h1>
        <p className="hero-subtitle">
          Handcrafted health mixes, pure spice masalas, and nutritional energy drinks prepared with love, sun-dried ingredients, and zero chemical preservatives.
        </p>

        <div className="hero-actions">
          <button
            className="btn btn-primary"
            onClick={() => setActiveView('shop')}
          >
            Shop Fresh Powders
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => {
              const el = document.getElementById('features-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Learn More
          </button>
        </div>
      </div>

      <div className="hero-showcase">
        <div className="showcase-card glass">
          <div className="showcase-glow"></div>
          <div className="showcase-img-container">
            <div className="showcase-slide-wrapper">
              {slideImages.map((src, index) => (
                <img
                  key={src}
                  src={src}
                  alt={`VALAM Foods Showcase ${index + 1}`}
                  className={`showcase-slide ${index === currentSlide ? 'active' : ''}`}
                />
              ))}
            </div>
            <span className="badge-overlay">100% Homemade</span>
            <div className="slide-dots">
              {slideImages.map((_, index) => (
                <div
                  key={index}
                  className={`slide-dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                ></div>
              ))}
            </div>
          </div>
          <div className="showcase-info">
            <span className="showcase-category">SIGNATURE BRAND</span>
            <h3 className="showcase-title">VALAM Foods</h3>
            <div className="showcase-footer">
              <span className="showcase-price">100% Natural</span>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setActiveView('shop')}
              >
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Guarantee banners */}
      <div className="hero-guarantees" id="features-section">
        <div className="guarantee-item glass">
          <Heart className="w-6 h-6 text-accent" />
          <div>
            <h4>100% Natural & Pure</h4>
            <p>No artificial preservatives</p>
          </div>
        </div>
        <div className="guarantee-item glass">
          <ShieldCheck className="w-6 h-6 text-accent" />
          <div>
            <h4>FSSAI Certified</h4>
            <p>Premium Quality Guaranteed</p>
          </div>
        </div>
        <div className="guarantee-item glass">
          <RefreshCw className="w-6 h-6 text-accent" />
          <div>
            <h4>Freshly Made</h4>
            <p>From Farmer to your home</p>
          </div>
        </div>
        <div className="guarantee-item glass">
          <Truck className="w-6 h-6 text-accent" />
          <div>
            <h4>Cash on Delivery & Fast Delivery</h4>
            <p>Fast and secure delivery across TN</p>
          </div>
        </div>
      </div>

      <style>{`
        .hero-container {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 48px;
          align-items: center;
          padding: 60px 0;
          position: relative;
        }
        @media (max-width: 968px) {
          .hero-container {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 36px;
            padding: 30px 0;
          }
        }
        
        /* Ambient Floating Glow Blobs */
        .hero-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.12;
          z-index: -1;
          pointer-events: none;
          animation: float-blob 15s infinite alternate ease-in-out;
        }
        .blob-1 {
          width: 350px;
          height: 350px;
          background: var(--accent-primary);
          top: -10%;
          left: -10%;
        }
        .blob-2 {
          width: 450px;
          height: 450px;
          background: var(--accent-secondary);
          bottom: -10%;
          right: -10%;
          animation-delay: -5s;
        }
        @keyframes float-blob {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(50px, -70px) scale(1.15); }
          100% { transform: translate(-30px, 30px) scale(0.9); }
        }

        .hero-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          z-index: 1;
        }
        @media (max-width: 968px) {
          .hero-content {
            align-items: center;
          }
        }
        .hero-tag {
          margin-bottom: 20px;
          letter-spacing: 1px;
          animation: soft-pulse 2s infinite alternate ease-in-out;
        }
        @keyframes soft-pulse {
          0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
          100% { box-shadow: 0 0 12px 4px rgba(99, 102, 241, 0.1); }
        }

        .hero-title {
          font-size: 56px;
          font-weight: 800;
          letter-spacing: -1.5px;
          line-height: 1.15;
          margin-bottom: 25px;
        }
        @media (max-width: 640px) {
          .hero-title {
            font-size: 38px;
          }
        }
        .gradient-text {
          background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-subtitle {
          font-size: 17px;
          color: var(--text-secondary);
          margin-bottom: 36px;
          max-width: 580px;
          opacity: 0.9;
        }
        
        .hero-actions {
          display: flex;
          gap: 16px;
          width: 100%;
        }
        @media (max-width: 968px) {
          .hero-actions {
            justify-content: center;
          }
        }
        @media (max-width: 480px) {
          .hero-actions {
            flex-direction: column;
          }
          .hero-actions .btn {
            width: 100%;
          }
        }
        
        /* Primary/Secondary Button Enhancements */
        .btn-primary {
          box-shadow: 0 4px 14px 0 rgba(99, 102, 241, 0.35);
        }
        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px 0 rgba(99, 102, 241, 0.5);
        }
        .btn-secondary {
          border: 1px solid var(--border-color);
        }
        .btn-secondary:hover {
          transform: translateY(-3px);
          background-color: var(--bg-tertiary);
          border-color: var(--text-muted);
        }
        .btn svg {
          width: 18px;
          height: 18px;
          flex-shrink: 0;
        }
        
        .hero-showcase {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          z-index: 1;
        }
        .showcase-card {
          width: 100%;
          max-width: 380px;
          border-radius: var(--radius-lg);
          padding: 24px;
          position: relative;
          overflow: hidden;
          box-shadow: var(--shadow-xl);
          transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
          border: 1px solid var(--glass-border);
        }
        .showcase-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 30px 45px -10px rgba(0, 0, 0, 0.15), var(--shadow-xl);
          border-color: var(--accent-primary);
        }
        .showcase-glow {
          position: absolute;
          top: -20%;
          left: -20%;
          width: 140%;
          height: 140%;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 60%);
          pointer-events: none;
          transition: transform 0.6s ease;
        }
        .showcase-card:hover .showcase-glow {
          transform: scale(1.1) translate(5%, 5%);
        }
        
        /* Showcase Image Container, Slideshow & Zoom */
        .showcase-img-container {
          width: 100%;
          height: 260px;
          position: relative;
          overflow: hidden;
          border-radius: var(--radius-md);
          margin-bottom: 20px;
          box-shadow: var(--shadow-md);
        }
        .showcase-slide-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
        }
        .showcase-slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 1s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
          pointer-events: none;
        }
        .showcase-slide.active {
          opacity: 1;
          pointer-events: auto;
        }
        .showcase-card:hover .showcase-slide {
          transform: scale(1.08);
        }
        .badge-overlay {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          color: #ffffff;
          padding: 6px 14px;
          border-radius: var(--radius-full);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.5px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          z-index: 2;
        }
        
        /* Slideshow Dot Indicators */
        .slide-dots {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 6px;
          z-index: 3;
          background: rgba(15, 23, 42, 0.4);
          padding: 4px 8px;
          border-radius: var(--radius-full);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .slide-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .slide-dot:hover {
          background: rgba(255, 255, 255, 0.8);
        }
        .slide-dot.active {
          width: 16px;
          border-radius: 3px;
          background: var(--accent-primary);
        }
        
        .showcase-category {
          font-size: 11px;
          font-weight: 700;
          color: var(--accent-primary);
          letter-spacing: 1px;
          display: block;
          margin-bottom: 6px;
        }
        .showcase-title {
          font-size: 20px;
          font-weight: 800;
          margin-bottom: 12px;
          color: var(--text-primary);
        }
        .showcase-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .showcase-price {
          font-size: 18px;
          font-weight: 800;
          color: var(--accent-primary);
        }
        .btn-sm {
          padding: 8px 16px;
          font-size: 12px;
        }
        
        .hero-guarantees {
          grid-column: 1 / -1;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
          margin-top: 48px;
          padding-top: 36px;
          border-top: 1px solid var(--border-color);
          z-index: 1;
        }
        @media (max-width: 768px) {
          .hero-guarantees {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
        .guarantee-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px 24px;
          border-radius: var(--radius-md);
          text-align: left;
          border: 1px solid var(--border-color);
          transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .guarantee-item svg {
          width: 32px;
          height: 32px;
          flex-shrink: 0;
        }
        .guarantee-item:hover {
          transform: translateY(-5px);
          border-color: var(--accent-primary);
          box-shadow: var(--shadow-md);
          background-color: var(--bg-secondary);
        }
        .guarantee-item h4 {
          font-size: 15px;
          font-weight: 700;
          margin-bottom: 4px;
        }
        .guarantee-item p {
          font-size: 13px;
        }
        .text-accent {
          color: var(--accent-primary);
        }
      `}</style>
    </section>
  );
}
