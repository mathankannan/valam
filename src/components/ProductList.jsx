import React, { useState, useMemo, useEffect } from 'react';
import ProductCard from './ProductCard';
import { X, Search } from './Icons';

export default function ProductList({ 
  products, 
  onAddToCart, 
  onSelectProduct,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  displayCategories
}) {
  const [priceRange, setPriceRange] = useState(1000); // max price 1000
  const [sortBy, setSortBy] = useState('featured');



  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Only show products if their category exists in the active menus from DB
        if (!categories.includes(product.category) && categories.length > 1) {
          return false;
        }

        const matchesCategory = selectedCategory === 'All' || 
                                product.category === selectedCategory || 
                                (selectedCategory === 'Moringa' && product.category.toLowerCase().startsWith('moringa')) ||
                                (selectedCategory === 'Pirandai' && product.category.toLowerCase().startsWith('pirandai')) ||
                                (selectedCategory === 'Karuveppilai' && product.category.toLowerCase().startsWith('karuveppilai')) ||
                                (selectedCategory === 'Ellu' && product.category.toLowerCase().startsWith('ellu')) ||
                                (selectedCategory === 'Vadagam' && product.category.toLowerCase().includes('vadagam')) ||
                                (selectedCategory === 'Others' && 
                                  !product.category.toLowerCase().startsWith('moringa') && 
                                  !product.category.toLowerCase().startsWith('pirandai') && 
                                  !product.category.toLowerCase().startsWith('karuveppilai') && 
                                  !product.category.toLowerCase().startsWith('ellu') && 
                                  !product.category.toLowerCase().includes('vadagam'));
                                
        const matchesPrice = product.price <= priceRange;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        return matchesCategory && matchesPrice && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return b.featured - a.featured; // Default featured first
      });
  }, [products, selectedCategory, priceRange, searchQuery, sortBy, categories]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setPriceRange(1000);
    setSearchQuery('');
    setSortBy('featured');
  };

  return (
    <div className="store-container animate-fade-in">
      <div className="store-layout">
        {/* Left Column: Filter Sidebar */}
        <aside className="filter-sidebar glass">
          <div className="filter-header">
            <h3>Filters</h3>
            <button className="reset-link" onClick={handleResetFilters}>Clear All</button>
          </div>

          <div className="filter-section">
            <h4>Categories</h4>
            <div className="category-buttons">
              {displayCategories.map((cat) => (
                <button
                  key={cat}
                  className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setSearchQuery('');
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h4>Max Price</h4>
            <div className="price-slider-group">
              <input
                type="range"
                min="100"
                max="1000"
                step="10"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="price-slider"
              />
              <div className="price-display">
                <span>₹100.00</span>
                <span className="current-price">₹{priceRange.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Column: Catalog Grid */}
        <main className="catalog-panel">
          <div className="catalog-header">
            <div className="results-count text-secondary">
              Showing <strong>{filteredProducts.length}</strong> products
            </div>
            
            <div className="sorting-selector-group">
              <label htmlFor="sort-select">Sort by:</label>
              <select 
                id="sort-select" 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Active filters badges */}
          {(selectedCategory !== 'All' || priceRange < 500 || searchQuery) && (
            <div className="active-filters-row">
              {selectedCategory !== 'All' && (
                <span className="filter-badge">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('All')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {priceRange < 500 && (
                <span className="filter-badge">
                  Max: ₹{priceRange}
                  <button onClick={() => setPriceRange(500)}><X className="w-3 h-3" /></button>
                </span>
              )}
              {searchQuery && (
                <span className="filter-badge">
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')}><X className="w-3 h-3" /></button>
                </span>
              )}
            </div>
          )}

          {/* Grid or Empty view */}
          {filteredProducts.length === 0 ? (
            <div className="empty-catalog glass">
              <div className="empty-catalog-icon">
                <Search className="w-8 h-8 text-muted" />
              </div>
              <h3>No products found</h3>
              <p>Try modifying your search keywords or adjusting the filter parameters.</p>
              <button className="btn btn-secondary" onClick={handleResetFilters}>
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                  onSelect={onSelectProduct}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <style>{`
        .store-container {
          padding: 12px 0 60px 0;
        }
        .store-layout {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 32px;
          align-items: start;
        }
        @media (max-width: 768px) {
          .store-layout {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }

        .filter-sidebar {
          padding: 24px;
          border-radius: var(--radius-lg);
          background-color: var(--bg-secondary);
          text-align: left;
        }
        .filter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border-color);
        }
        .filter-header h3 {
          font-size: 18px;
          font-weight: 800;
        }
        .reset-link {
          background: none;
          border: none;
          color: var(--accent-primary);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }
        .reset-link:hover {
          text-decoration: underline;
        }

        .filter-section {
          margin-bottom: 24px;
        }
        .filter-section h4 {
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 14px;
          color: var(--text-primary);
        }
        .category-buttons {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        @media (max-width: 768px) {
          .category-buttons {
            flex-direction: row;
            flex-wrap: wrap;
          }
        }
        .category-btn {
          text-align: left;
          background: none;
          border: 1px solid transparent;
          padding: 8px 12px;
          font-family: var(--font-sans);
          font-size: 13.5px;
          font-weight: 600;
          color: var(--text-secondary);
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .category-btn:hover {
          background-color: var(--bg-tertiary);
          color: var(--text-primary);
        }
        .category-btn.active {
          background-color: var(--accent-light);
          color: var(--accent-secondary);
          font-weight: 700;
        }

        .price-slider-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .price-slider {
          -webkit-appearance: none;
          width: 100%;
          height: 6px;
          border-radius: var(--radius-full);
          background: var(--border-color);
          outline: none;
        }
        .price-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: var(--radius-full);
          background: var(--accent-primary);
          cursor: pointer;
          transition: transform 0.1s ease;
        }
        .price-slider::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }
        .price-display {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: var(--text-muted);
        }
        .current-price {
          font-weight: 700;
          color: var(--accent-primary);
          font-size: 14px;
        }

        .catalog-panel {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .catalog-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14.5px;
        }
        @media (max-width: 480px) {
          .catalog-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
        }
        .sorting-selector-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .sort-select {
          padding: 8px 12px;
          font-family: var(--font-sans);
          font-size: 13.5px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          background-color: var(--bg-secondary);
          color: var(--text-primary);
          outline: none;
          cursor: pointer;
        }
        .sort-select:focus {
          border-color: var(--accent-primary);
        }

        .active-filters-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 8px;
        }
        .filter-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 600;
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-full);
          color: var(--text-primary);
        }
        .filter-badge button {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          padding: 2px;
          border-radius: var(--radius-full);
        }
        .filter-badge button:hover {
          background-color: var(--border-color);
          color: var(--text-primary);
        }

        .empty-catalog {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 40px;
          border-radius: var(--radius-lg);
          background-color: var(--bg-secondary);
          text-align: center;
        }
        .empty-catalog-icon {
          width: 60px;
          height: 60px;
          border-radius: var(--radius-full);
          background-color: var(--bg-tertiary);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }
        .empty-catalog h3 {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .empty-catalog p {
          font-size: 14.5px;
          max-width: 320px;
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
}
