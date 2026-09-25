import React, { useState } from 'react';
import { Search, ShoppingCart, Sun, Moon, Menu, X, Bell } from './Icons';

export default function Header({
  activeView,
  setActiveView,
  searchQuery,
  setSearchQuery,
  cartCount,
  setCartOpen,
  isDarkMode,
  setIsDarkMode,
  hasComboOffers,
  comboOffersCount
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleNavClick = (view) => {
    setActiveView(view);
    setMobileMenuOpen(false);
    // If clicking Home, clear search
    if (view === 'home') {
      setSearchQuery('');
    }
  };

  return (
    <header className="glass sticky-nav">
      <div className="nav-container">
        {/* Logo */}
        <div className="logo-group" onClick={() => handleNavClick('home')}>
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22V12" />
              <path d="M12 12C12 7 17 2 22 2C22 7 17 12 12 12Z" fill="currentColor" fillOpacity="0.25" />
              <path d="M12 16C12 12 8 8 3 8C3 12 8 16 12 16Z" fill="currentColor" fillOpacity="0.25" />
              <path d="M12 22C12 18 15 15 19 15C19 18 15 22 12 22Z" fill="currentColor" fillOpacity="0.15" />
            </svg>
          </div>
          <span className="logo-text">VALAM FOODS</span>
        </div>

        {/* Desktop Search Bar */}
        <div className="search-wrapper">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search healthy food powders..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (activeView !== 'shop') {
                setActiveView('shop');
              }
            }}
            className="search-input"
          />
          {searchQuery && (
            <button className="search-clear-btn" onClick={() => setSearchQuery('')}>
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav">
          <button
            className={`nav-link ${activeView === 'home' ? 'active' : ''}`}
            onClick={() => handleNavClick('home')}
          >
            Home
          </button>
          <button
            className={`nav-link ${activeView === 'shop' ? 'active' : ''}`}
            onClick={() => handleNavClick('shop')}
          >
            Store
          </button>
        </nav>

        {/* Action Controls */}
        <div className="actions-group">
          {/* Notifications Toggle */}
          <button
            className="btn-icon"
            aria-label="Notifications"
            onClick={() => {
              if (comboOffersCount > 0) {
                if (activeView !== 'home') {
                  handleNavClick('home');
                  setTimeout(() => {
                    document.getElementById('combo-offers-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 300);
                } else {
                  document.getElementById('combo-offers-section')?.scrollIntoView({ behavior: 'smooth' });
                }
              }
            }}
            style={{ position: 'relative' }}
          >
            <Bell className="w-5 h-5" />
            {comboOffersCount > 0 && (
              <span className="cart-badge">{comboOffersCount}</span>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            className="btn-icon"
            onClick={toggleTheme}
            aria-label="Toggle Light/Dark Theme"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Cart Icon Drawer Trigger */}
          <button
            className="btn-icon cart-trigger"
            onClick={() => setCartOpen(true)}
            aria-label="Open Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            className="btn-icon mobile-menu-trigger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer animate-fade-in">
          <div className="mobile-search">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search food powders..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeView !== 'shop') {
                  setActiveView('shop');
                }
              }}
              className="search-input"
            />
          </div>
          <div className="mobile-nav-links">
            <button
              className={`mobile-nav-link ${activeView === 'home' ? 'active' : ''}`}
              onClick={() => handleNavClick('home')}
            >
              Home
            </button>
            <button
              className={`mobile-nav-link ${activeView === 'shop' ? 'active' : ''}`}
              onClick={() => handleNavClick('shop')}
            >
              Store
            </button>
          </div>
        </div>
      )}

      <style>{`
        .sticky-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          border-radius: 0 0 var(--radius-md) var(--radius-md);
          margin-bottom: 24px;
        }
        .nav-container {
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
        }
        .logo-group {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          user-select: none;
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
          color: white;
          flex-shrink: 0;
        }
        .logo-icon svg {
          width: 24px;
          height: 24px;
          transform: translateX(-1px) translateY(-1px);
        }
        .logo-text {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: 0px;
          background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .text-accent {
          color: var(--accent-primary);
        }
        .search-wrapper {
          position: relative;
          width: 320px;
          display: flex;
          align-items: center;
        }
        @media (max-width: 768px) {
          .search-wrapper {
            display: none;
          }
        }
        .search-icon {
          position: absolute;
          left: 14px;
          color: var(--text-muted);
          pointer-events: none;
          width: 18px;
          height: 18px;
        }
        .search-input {
          width: 100%;
          padding: 10px 16px 10px 42px;
          font-size: 14px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-color);
          background-color: var(--input-bg);
          color: var(--text-primary);
          outline: none;
          transition: all 0.2s ease;
        }
        .search-input:focus {
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px var(--accent-light);
        }
        .search-clear-btn {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
        }
        .search-clear-btn:hover {
          color: var(--text-primary);
        }
        .desktop-nav {
          display: flex;
          gap: 28px;
        }
        @media (max-width: 768px) {
          .desktop-nav {
            display: none;
          }
        }
        .nav-link {
          background: none;
          border: none;
          font-size: 15px;
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
          position: relative;
          padding: 6px 0;
          transition: color 0.2s ease;
        }
        .nav-link:hover {
          color: var(--text-primary);
        }
        .nav-link.active {
          color: var(--accent-primary);
        }
        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: var(--accent-primary);
          border-radius: var(--radius-full);
        }
        .actions-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .cart-trigger {
          background-color: var(--bg-tertiary);
        }
        .cart-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          font-size: 10px;
          font-weight: 700;
          min-width: 18px;
          height: 18px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--bg-secondary);
        }
        .mobile-menu-trigger {
          display: none;
        }
        @media (max-width: 768px) {
          .mobile-menu-trigger {
            display: inline-flex;
          }
        }
        
        /* Mobile menu */
        .mobile-drawer {
          position: absolute;
          top: 72px;
          left: 0;
          width: 100%;
          background-color: var(--bg-secondary);
          border-top: 1px solid var(--border-color);
          border-bottom: 1px solid var(--border-color);
          padding: 16px;
          box-shadow: var(--shadow-lg);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .mobile-search {
          position: relative;
          display: flex;
          align-items: center;
        }
        .mobile-nav-links {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .mobile-nav-link {
          background: none;
          border: none;
          text-align: left;
          font-size: 16px;
          font-weight: 600;
          padding: 10px 12px;
          color: var(--text-secondary);
          border-radius: var(--radius-sm);
          cursor: pointer;
        }
        .mobile-nav-link:hover, .mobile-nav-link.active {
          background-color: var(--bg-tertiary);
          color: var(--accent-primary);
        }
      `}</style>
    </header>
  );
}
