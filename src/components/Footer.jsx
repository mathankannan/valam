import React, { useState } from 'react';

export default function Footer({ setActiveView, setSearchQuery, setSelectedCategory, displayCategories = [] }) {
  const [email, setEmail] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const categories = displayCategories.filter(cat => cat !== 'All');

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const handleSubscribe = async () => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email || !emailRegex.test(email)) {
      showToast("Please enter a valid email address.", "error");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast("Thank you for subscribing!");
        setEmail('');
      } else {
        // Shows error like "This email is already subscribed!"
        showToast(data.error || "Failed to subscribe. Please try again.", "error");
      }
    } catch (error) {
      console.error("Subscription Error:", error);
      showToast("Server error. Please make sure the backend is running.", "error");
    }
  };

  const handleCategoryClick = (e, category) => {
    e.preventDefault();
    if (setActiveView) setActiveView('shop');
    if (setSelectedCategory) setSelectedCategory(category || 'All');
    if (setSearchQuery) setSearchQuery('');
  };

  return (
    <>
      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast-notification ${toast.type}`}>
          {toast.type === 'success' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
          )}
          <span>{toast.message}</span>
        </div>
      )}
      <footer className="footer-container glass">
        <div className="footer-grid">
          <div className="footer-brand-col">
          <div className="logo-group">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '24px', height: '24px', transform: 'translateX(-1px) translateY(-1px)', color: 'white' }}>
                <path d="M12 22V12" />
                <path d="M12 12C12 7 17 2 22 2C22 7 17 12 12 12Z" fill="currentColor" fillOpacity="0.25" />
                <path d="M12 16C12 12 8 8 3 8C3 12 8 16 12 16Z" fill="currentColor" fillOpacity="0.25" />
                <path d="M12 22C12 18 15 15 19 15C19 18 15 22 12 22Z" fill="currentColor" fillOpacity="0.15" />
              </svg>
            </div>
            <span className="logo-text">VALAM FOODS</span>
          </div>
          <p className="footer-desc text-muted">
            Delivering traditional, organic, and preservative-free homemade health mixes and spice powders directly to your kitchen.
          </p>
        </div>



        <div className="footer-links-col">
          <h4>Contact Info</h4>
          <ul>
            <li><a href="#">4/27, Maniyar Street, Unjini POST, Sendurai TK, Ariyaluer Dt, Tamil Nadu - 621714</a></li>
            <li><a href="#">Phone: 9688913856</a></li>
            <li><a href="#">Email: kannanmca16@gmail.com</a></li>
          </ul>
        </div>

        <div className="footer-newsletter-col">
          <h4>Subscribe</h4>
          <p className="newsletter-text text-muted">Subscribe to receive health tips, organic recipes, and exclusive discount drops on fresh batches.</p>
          <div className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email"
              className="newsletter-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="btn btn-primary newsletter-btn" onClick={handleSubscribe}>Join</button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="copyright-text">&copy; {new Date().getFullYear()} VALAM Foods. All rights reserved.</p>

      </div>

      <style>{`
        /* Toast Notification */
        .toast-notification {
          position: fixed;
          top: 24px;
          left: 50%;
          transform: translateX(-50%);
          padding: 14px 24px;
          border-radius: 50px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 15px;
          font-weight: 600;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          z-index: 10000;
          animation: toastSlideDown 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .toast-notification.success {
          background-color: #10b981;
          color: white;
        }
        .toast-notification.error {
          background-color: #ef4444;
          color: white;
        }
        @keyframes toastSlideDown {
          0% {
            top: -50px;
            opacity: 0;
            transform: translateX(-50%) scale(0.9);
          }
          100% {
            top: 24px;
            opacity: 1;
            transform: translateX(-50%) scale(1);
          }
        }

        .footer-container {
          margin-top: auto;
          border-radius: var(--radius-md) var(--radius-md) 0 0;
          padding: 48px 32px 24px 32px;
          border-bottom: none;
        }
        @media (max-width: 640px) {
          .footer-container {
            padding: 32px 16px 20px 16px;
          }
        }
        .footer-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 48px;
          margin-bottom: 40px;
        }
        @media (max-width: 968px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 24px;
          }
        }
        @media (max-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }

        .footer-brand-col {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
          text-align: left;
        }
        .logo-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .logo-icon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, #020617 0%, #1e3a8a 50%, #3b82f6 100%);
          box-shadow: 0 6px 16px rgba(30, 58, 138, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .logo-text {
          font-size: 18px;
          font-weight: 800;
          color: var(--text-primary);
        }
        .text-accent {
          color: var(--accent-primary);
        }
        .footer-desc {
          font-size: 13.5px;
          max-width: 320px;
          line-height: 1.6;
        }

        .footer-links-col {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
          text-align: left;
        }
        .footer-links-col h4 {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-primary);
        }
        .footer-links-col ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .footer-links-col ul a {
          font-size: 13.5px;
          color: var(--text-secondary);
          transition: color 0.2s ease;
        }
        .footer-links-col ul a:hover {
          color: var(--accent-primary);
        }

        .footer-newsletter-col {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
          text-align: left;
        }
        .footer-newsletter-col h4 {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-primary);
        }
        .newsletter-text {
          font-size: 13.5px;
        }
        .newsletter-form {
          display: flex;
          gap: 8px;
          width: 100%;
          max-width: 320px;
        }
        .newsletter-input {
          flex-grow: 1;
          padding: 8px 12px;
          font-size: 13.5px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          background-color: var(--input-bg);
          color: var(--text-primary);
          outline: none;
        }
        .newsletter-input:focus {
          border-color: var(--accent-primary);
        }
        .newsletter-btn {
          padding: 8px 16px;
          font-size: 13.5px;
          border-radius: var(--radius-sm);
        }

        .footer-bottom {
          display: flex;
          justify-content: center;
          align-items: center;
          padding-top: 24px;
          border-top: 1px solid var(--border-color);
          font-size: 12.5px;
          color: var(--text-secondary);
        }
        @media (max-width: 640px) {
          .footer-bottom {
            flex-direction: column;
            gap: 12px;
            text-align: center;
          }
        }
        .footer-bottom-links {
          display: flex;
          gap: 16px;
        }
        .footer-bottom-links a:hover {
          color: var(--accent-primary);
        }
      `}</style>
    </footer>
    </>
  );
}
