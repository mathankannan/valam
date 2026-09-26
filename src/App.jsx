import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Footer from './components/Footer';
import ProductImage from './components/ProductImage';
import ProductCard from './components/ProductCard';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import ComboOffers from './components/ComboOffers';

function App() {
  const [activeView, setActiveView] = useState(() => {
    if (window.location.pathname === '/admin') {
      return localStorage.getItem('isAdminLoggedIn') === 'true' ? 'admin-dashboard' : 'admin-login';
    }
    return 'home';
  }); // 'home', 'shop', 'checkout', 'admin-login', 'admin-dashboard'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [displayCategories, setDisplayCategories] = useState(['All']);
  const [hasComboOffers, setHasComboOffers] = useState(false);
  const [comboOffersCount, setComboOffersCount] = useState(0);

  // Fetch combo offers status for notifications
  useEffect(() => {
    const fetchComboStatus = async () => {
      try {
        const response = await fetch('/api/combo-offers');
        if (response.ok) {
          const data = await response.json();
          setHasComboOffers(data && data.length > 0);
          setComboOffersCount(data ? data.length : 0);
        }
      } catch (error) {
        console.error("Error fetching combo offers status:", error);
      }
    };
    fetchComboStatus();
  }, []);

  // Fetch products from the backend database dynamically
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setProducts(data);
          }
        }
      } catch (error) {
        console.error("Error fetching products from DB:", error);
      }
    };

    fetchProducts();
  }, []);

  // Fetch categories from the backend database
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await fetch('/api/menus');
        if (response.ok) {
          const data = await response.json();
          // Filter to only include 'Active' menus and map to their names
          const activeMenus = data
            .filter(menu => !menu.status || menu.status === 'Active')
            .map(menu => menu.menu_name);
            
          setCategories(['All', ...activeMenus]);

          // Group categories for the display
          const grouped = new Set(['All']);
          activeMenus.forEach(menu => {
            if (menu.toLowerCase().startsWith('moringa')) {
              grouped.add('Moringa');
            } else if (menu.toLowerCase().startsWith('pirandai')) {
              grouped.add('Pirandai');
            } else if (menu.toLowerCase().startsWith('karuveppilai')) {
              grouped.add('Karuveppilai');
            } else if (menu.toLowerCase().startsWith('ellu')) {
              grouped.add('Ellu');
            } else if (menu.toLowerCase().includes('vadagam')) {
              grouped.add('Vadagam');
            } else {
              grouped.add('Others');
            }
          });
          const groupedArray = Array.from(grouped);
          // If the DB is empty, default to the requested categories
          if (groupedArray.length <= 1) {
            setDisplayCategories(['All', 'Moringa', 'Pirandai', 'Karuveppilai', 'Ellu', 'Vadagam', 'Others']);
          } else {
            setDisplayCategories(groupedArray);
          }
        } else {
          setDisplayCategories(['All', 'Moringa', 'Pirandai', 'Karuveppilai', 'Ellu', 'Vadagam', 'Others']);
        }
      } catch (error) {
        console.error("Error fetching menus from DB:", error);
        setDisplayCategories(['All', 'Moringa', 'Pirandai', 'Karuveppilai', 'Ellu', 'Vadagam', 'Others']);
      }
    };

    fetchMenus();
  }, []);

  // Initialize theme from browser pref or default to dark
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark') || 
                   window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleAddToCart = (product) => {
    // Determine color choice (default to first color if none selected in payload)
    const colorSelected = product.selectedColor || (product.colors ? product.colors[0] : null);
    const qtyToAdd = product.quantity || 1;

    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === product.id && item.selectedColor === colorSelected
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + qtyToAdd
        };
        return updatedItems;
      } else {
        return [...prevItems, { ...product, selectedColor: colorSelected, quantity: qtyToAdd }];
      }
    });

    // Auto-open cart for feedback removed as per user request
    // setCartOpen(true);
  };

  const handleUpdateQuantity = (id, color, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(id, color);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.selectedColor === color
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const handleRemoveItem = (id, color) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => !(item.id === id && item.selectedColor === color))
    );
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Filter featured products for the Home page spotlight
  const featuredProducts = products.filter(p => p.featured);

  return (
    <>
      {!(activeView === 'admin-login' || activeView === 'admin-dashboard') && (
        <Header
          activeView={activeView}
          setActiveView={setActiveView}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          cartCount={totalCartCount}
          setCartOpen={setCartOpen}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          hasComboOffers={hasComboOffers}
          comboOffersCount={comboOffersCount}
        />
      )}

      <main className="main-content-area">
        {activeView === 'home' && (
          <>
            <Hero setActiveView={setActiveView} />
            
            {/* Featured Section */}
            <section className="featured-section animate-slide-up">
              <div className="section-header-centered">
                <span className="badge badge-accent">Best Sellers</span>
                <h2>Pure & Fresh Spotlights</h2>
                <p>Indulge in our most popular homemade health mixes and spice powders, freshly roasted and prepared with absolute care.</p>
              </div>

              <div className="products-grid">
                {featuredProducts.slice(0, 4).map((product) => (
                  <ProductCard 
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onSelect={setSelectedProduct}
                  />
                ))}
              </div>

              <div className="view-catalog-cta">
                <button 
                  className="btn btn-primary"
                  onClick={() => setActiveView('shop')}
                >
                  View All Products
                </button>
              </div>
            </section>

            {/* Combo Offers Section */}
            <ComboOffers onAddToCart={handleAddToCart} />
          </>
        )}

        {activeView === 'shop' && (
          <ProductList
            products={products}
            onAddToCart={handleAddToCart}
            onSelectProduct={setSelectedProduct}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
            displayCategories={displayCategories}
          />
        )}

        {activeView === 'checkout' && (
          <Checkout
            cartItems={cartItems}
            onClearCart={() => setCartItems([])}
            onNavigateHome={() => setActiveView('home')}
          />
        )}

        {activeView === 'admin-login' && (
          <AdminLogin
            onLoginSuccess={(username) => {
              localStorage.setItem('isAdminLoggedIn', 'true');
              localStorage.setItem('adminUser', username);
              setActiveView('admin-dashboard');
            }}
          />
        )}

        {activeView === 'admin-dashboard' && (
          <AdminDashboard
            adminUser={localStorage.getItem('adminUser')}
            onLogout={() => {
              localStorage.removeItem('isAdminLoggedIn');
              localStorage.removeItem('adminUser');
              setActiveView('admin-login');
            }}
          />
        )}
      </main>

      {!(activeView === 'admin-login' || activeView === 'admin-dashboard') && (
        <>
          <Footer 
            setActiveView={setActiveView} 
            setSearchQuery={setSearchQuery} 
            setSelectedCategory={setSelectedCategory} 
            displayCategories={displayCategories}
          />

          {/* Slide-out Cart Panel */}
          <Cart
            isOpen={cartOpen}
            onClose={() => setCartOpen(false)}
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onCheckout={() => setActiveView('checkout')}
          />
        </>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      <style>{`
        .main-content-area {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          margin-bottom: 40px;
        }

        /* Home Page Featured grid */
        .featured-section {
          padding: 60px 0;
          border-top: 1px solid var(--border-color);
        }
        .section-header-centered {
          text-align: center;
          margin-bottom: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .section-header-centered h2 {
          font-size: 32px;
          font-weight: 800;
        }
        .section-header-centered p {
          max-width: 480px;
        }

        .grid-item-wrapper {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          text-align: left;
        }
        .grid-item-wrapper:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
          border-color: var(--accent-primary);
        }
        .grid-item-img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          cursor: pointer;
          background-color: var(--bg-tertiary);
        }
        .grid-item-details {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex-grow: 1;
        }
        .grid-item-cat {
          font-size: 10px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }
        .grid-item-details h4 {
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          line-height: 1.4;
        }
        .grid-item-details h4:hover {
          color: var(--accent-primary);
        }
        .grid-item-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px dashed var(--border-color);
        }
        .grid-item-price {
          font-weight: 800;
          font-size: 16px;
          color: var(--text-primary);
        }

        .view-catalog-cta {
          margin-top: 40px;
          display: flex;
          justify-content: center;
        }
      `}</style>
    </>
  );
}

export default App;
