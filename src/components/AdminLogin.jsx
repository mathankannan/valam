import React, { useState } from 'react';

export default function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError('Please fill out both Username and Password fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        onLoginSuccess(data.user);
      } else {
        setError(data.error || 'Invalid username or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Server connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      {/* Background Graphics */}
      <div className="bg-graphics">
        <div className="bg-wave bg-wave-1"></div>
        <div className="bg-wave bg-wave-2"></div>
        <div className="bg-dots bg-dots-1"></div>
        <div className="bg-dots bg-dots-2"></div>
      </div>

      {/* Login Card */}
      <div className="login-card-container">
        <div className="login-card">
          <div className="admin-logo-section">
            <div className="admin-brand-logo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22V12" />
                <path d="M12 12C12 7 17 2 22 2C22 7 17 12 12 12Z" fill="currentColor" fillOpacity="0.25" />
                <path d="M12 16C12 12 8 8 3 8C3 12 8 16 12 16Z" fill="currentColor" fillOpacity="0.25" />
                <path d="M12 22C12 18 15 15 19 15C19 18 15 22 12 22Z" fill="currentColor" fillOpacity="0.15" />
              </svg>
            </div>
            <div className="admin-logo-text">
              <span className="brand-name">VALAM FOODS</span>
            </div>
          </div>

          <h2 className="card-title">Sign in</h2>
          <p className="card-subtitle">Sign in with your admin credentials</p>

          <form onSubmit={handleSubmit} className="login-form" noValidate>
            <div className="form-group">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>
            {/* Modal is rendered outside the form flow */}
            <div className="submit-container">
              <button type="submit" className="login-submit-icon-btn" title="Login" disabled={loading}>
                {loading ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="spinner">
                    <line x1="12" y1="2" x2="12" y2="6"></line>
                    <line x1="12" y1="18" x2="12" y2="22"></line>
                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                    <line x1="2" y1="12" x2="6" y2="12"></line>
                    <line x1="18" y1="12" x2="22" y2="12"></line>
                    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                    <polyline points="10 17 15 12 10 7"></polyline>
                    <line x1="15" y1="12" x2="3" y2="12"></line>
                  </svg>
                )}
              </button>
            </div>
          </form>

          <div className="login-footer">
            <p className="copyright">&copy; 2026 Valam Foods. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Error Modal */}
      {error && (
        <div className="error-modal-overlay">
          <div className="error-modal-card">
            <div className="error-modal-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h3 className="error-modal-title">Authentication Failed</h3>
            <p className="error-modal-message">{error}</p>
            <button className="error-modal-btn" onClick={() => setError('')}>
              OK
            </button>
          </div>
        </div>
      )}

      <style>{`
        .admin-login-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 100vw;
          z-index: 1000;
          background: linear-gradient(135deg, #00d2ff 0%, #0056ff 100%);
          display: flex;
          align-items: center;
          justify-content: flex-end;
          overflow: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }

        /* Background Graphics Layer */
        .bg-graphics {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          pointer-events: none;
        }

        .bg-wave {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
        }

        .bg-wave-1 {
          width: 800px;
          height: 800px;
          bottom: -200px;
          left: -200px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .bg-wave-2 {
          width: 1000px;
          height: 1000px;
          top: -300px;
          left: 10%;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .bg-dots {
          position: absolute;
          width: 120px;
          height: 120px;
          background-image: radial-gradient(rgba(255, 255, 255, 0.4) 2px, transparent 2px);
          background-size: 20px 20px;
        }

        .bg-dots-1 {
          top: 10%;
          left: 30%;
        }

        .bg-dots-2 {
          bottom: 20%;
          right: 40%;
          opacity: 0.5;
        }

        /* Login Card Container */
        .login-card-container {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 440px;
          margin-right: 8%;
        }

        .login-card {
          background-color: #ffffff;
          padding: 40px 30px;
          border-radius: 3px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          height: fit-content;
         }

        .admin-logo-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 24px;
        }

        .admin-brand-logo {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #020617 0%, #1e3a8a 50%, #3b82f6 100%);
          box-shadow: 0 8px 24px rgba(30, 58, 138, 0.4), inset 0 2px 6px rgba(255, 255, 255, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .admin-brand-logo svg {
          width: 26px;
          height: 26px;
          transform: translateX(-1px) translateY(-1px);
        }

        .admin-logo-text {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .brand-name {
          font-size: 24px;
          font-weight: 800;
          background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: 0.5px;
          line-height: 1.2;
        }

        .brand-reg {
          font-size: 10px;
          vertical-align: super;
          margin-left: 2px;
        }

        .brand-tagline {
          font-size: 13px;
          color: #64748b;
          font-weight: 500;
          letter-spacing: 0.2px;
        }

        .card-title {
          font-size: 24px;
          color: #333;
          margin-bottom: 12px;
          font-weight: 400;
        }

        .card-subtitle {
          font-size: 13px;
          color: #666;
          margin-bottom: 16px;
        }

        .login-form {
          width: 100%;
          margin-bottom: 10px;
        }

        .form-group {
          margin-bottom: 12px;
        }

        .form-group input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 4px;
          border: 1px solid #e0e0e0;
          background-color: #ffffff;
          color: #333;
          font-size: 13px;
          outline: none;
          transition: all 0.2s;
        }

        .form-group input:focus {
          border-color: #0056ff;
          box-shadow: 0 0 0 2px rgba(0, 86, 255, 0.1);
        }

        .submit-container {
          display: flex;
          justify-content: center;
          margin-top: 16px;
        }

        .login-submit-icon-btn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00d2ff 0%, #0056ff 100%);
          color: #ffffff;
          border: none;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 86, 255, 0.3);
        }

        .login-submit-icon-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 86, 255, 0.4);
        }

        .login-submit-icon-btn:active {
          transform: translateY(0);
        }

        .login-footer {
          margin-top: 20px;
          width: 100%;
          text-align: center;
        }

        .copyright {
          font-size: 12px;
          color: #999;
          margin-bottom: 12px;
        }

        @media (max-width: 800px) {
          .admin-login-wrapper {
            justify-content: center;
            padding: 20px;
          }
          
          .login-card-container {
            margin-right: 0;
            max-width: 100%;
          }

          .login-card {
            padding: 40px 30px;
            min-height: auto;
          }
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          100% {
            transform: rotate(360deg);
          }
        }
        
        /* Error Modal Styles */
        .error-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          z-index: 2000;
          display: flex;
          justify-content: center;
          align-items: center;
          animation: fadeIn 0.2s ease-out;
        }

        .error-modal-card {
          background-color: #ffffff;
          border-radius: 12px;
          padding: 30px;
          width: 90%;
          max-width: 360px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .error-modal-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: #fee2e2;
          color: #ef4444;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 16px;
        }

        .error-modal-icon svg {
          width: 24px;
          height: 24px;
        }

        .error-modal-title {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .error-modal-message {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 24px;
          line-height: 1.5;
        }

        .error-modal-btn {
          width: 100%;
          padding: 12px;
          background-color: #ef4444;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .error-modal-btn:hover {
          background-color: #dc2626;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes popIn {
          from { 
            opacity: 0;
            transform: scale(0.9);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
