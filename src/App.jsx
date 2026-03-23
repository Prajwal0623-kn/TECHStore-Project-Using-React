import ProductCard from "./components/ProductCard";
import "./App.css";
import products from "./data.js";
import { useState, useEffect } from "react";

function App() {
  //BRANDS
  const allBrands = [...new Set(products.map((p) => p.brand))];

  // State
  //Cart- array of products in cart
  const [cartItems, setCartItems] = useState([]);

  //Wishlist - array of product IDs that are wishlisted
  const [wishlist, setWishlist] = useState([]);

  //Search - what user types in search box
  const [searchTerm, setSearchTerm] = useState("");

  // Brand Filter - Which brand is selected ('All' means show all)
  const [selectedBrand, setSelectedBrand] = useState("All");

  // Sort - how to sort products
  const [sortBy, setSortBy] = useState("default");

  // Show/Hide Wishlist Panel
  const [showWishlist, setShowWishlist] = useState(false);

  // Show/Hide Cart Panel
  const [showCart, setShowCart] = useState(false);

  // Dark/Light Mode (true = dark)
  const [darkMode, setDarkMode] = useState(true);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light",
    );
  }, [darkMode]);

  function toggleTheme() {
    setDarkMode(!darkMode);
  }

  function addToCart(product) {
    //Check if cart Item Exists
    const existingItem = cartItems.find((item) => item.id === product.id);

    if (existingItem) {
      //PRODUCT IS THERE IN THE CART
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      //PRODUCT NOT THERE
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  }

  // Increase quantity
  function increaseQty(id) {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  }

  // Decrease quantity
  function decreaseQty(id) {
    setCartItems(
      cartItems
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  // Remove from cart
  function removeFromCart(id) {
    setCartItems(cartItems.filter((item) => item.id !== id));
  }

  //Calculate Total Number of Cart ITEMS
  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  //Calculate Total Price
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  // Wishlist Function
  function toggleWishlist(productId) {
    if (wishlist.includes(productId)) {
      //Already Existing - Remove It
      setWishlist(wishlist.filter((id) => id !== productId));
    } else {
      //NOT IN THE WISHLIST
      setWishlist([...wishlist, productId]);
    }
  }

  //STEP 1 : FILTER BASED ON SEARCH AND BRAND
  let filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesBrand =
      selectedBrand === "All" || product.brand === selectedBrand;

    return matchesSearch && matchesBrand;
  });

  //STEP 2 : SORT
  if (sortBy === "priceLow") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === "priceHigh") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === "rating") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => b.rating - a.rating,
    );
  }

  return (
    <div className="app">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <a href="/" className="logo">
            <span className="logo-icon">◆</span>
            TechStore
          </a>

          <ul className="nav-links">
            <li>
              <a href="#products" className="nav-link">
                Products
              </a>
            </li>
            <li>
              <a href="#" className="nav-link">
                Deals
              </a>
            </li>
            <li>
              <a href="#" className="nav-link">
                Support
              </a>
            </li>
            <li>
              <a href="#" className="nav-link">
                About
              </a>
            </li>
          </ul>

          <div className="nav-actions">
            {/* Theme Toggle */}
            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              <div className={`toggle-track ${darkMode ? "dark" : "light"}`}>
                <div className="toggle-thumb">
                  {darkMode ? (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                  ) : (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="5" />
                      <line x1="12" y1="1" x2="12" y2="3" />
                      <line x1="12" y1="21" x2="12" y2="23" />
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                      <line x1="1" y1="12" x2="3" y2="12" />
                      <line x1="21" y1="12" x2="23" y2="12" />
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                    </svg>
                  )}
                </div>
              </div>
            </button>

            {/* Wishlist Button */}
            <button
              className="wishlist-nav-btn"
              onClick={() => setShowWishlist(true)}
            >
              ❤️
              {wishlist.length > 0 && (
                <span className="wishlist-badge">{wishlist.length}</span>
              )}
            </button>

            {/* Cart Button - SVG Icon */}
            <button className="cart-btn" onClick={() => setShowCart(true)}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </button>
            {cartTotal > 0 && (
              <span className="cart-total">₹{cartTotal.toLocaleString()}</span>
            )}
            <button className="nav-btn">Sign In</button>
            <button className="nav-btn primary">Shop Now</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-tag">New Arrivals 2026</p>
          <h1 className="hero-title">
            The Future of Tech
            <br />
            <span className="hero-highlight">Is Here.</span>
          </h1>
          <p className="hero-description">
            Discover the latest in premium technology. From powerful computers
            to cutting-edge smartphones, find everything you need in one place.
          </p>
          <div className="hero-cta">
            <button className="btn-primary">Explore Products</button>
            <button className="btn-secondary">Learn More</button>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-number">50K+</span>
            <span className="stat-label">Happy Customers</span>
          </div>
          <div className="stat">
            <span className="stat-number">200+</span>
            <span className="stat-label">Premium Products</span>
          </div>
          <div className="stat">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Customer Support</span>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section" id="products">
        <div className="section-header">
          <h2 className="section-title">Best Sellers</h2>
          <p className="section-subtitle">
            Our most popular products loved by customers
          </p>
        </div>

        {/* Filters Toolbar */}
        <div className="filters-toolbar">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="filter-select"
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
          >
            <option value="All">All Brands</option>
            {allBrands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default">Sort: Default</option>
            <option value="priceLow">Price: Low → High</option>
            <option value="priceHigh">Price: High → Low</option>
            <option value="rating">Rating: High → Low</option>
          </select>
        </div>

        <div className="product-grid">
          {filteredProducts.map((data) => (
            <ProductCard
              key={data.id}
              id={data.id}
              image={data.image}
              name={data.name}
              price={data.price}
              originalPrice={data.originalPrice}
              discount={data.discount}
              rating={data.rating}
              isBestSeller={data.isBestSeller}
              isWishlisted={wishlist.includes(data.id)}
              onAddToCart={() => addToCart(data)}
              onToggleWishlist={() => toggleWishlist(data.id)}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <p className="no-results">
            No products found. Try a different search or filter.
          </p>
        )}
      </section>

      {/* Wishlist Overlay */}
      {showWishlist && (
        <div
          className="wishlist-overlay"
          onClick={() => setShowWishlist(false)}
        ></div>
      )}

      {/* Wishlist Sidebar */}
      <div className={`wishlist-sidebar ${showWishlist ? "open" : ""}`}>
        <div className="wishlist-header">
          <h2>My Wishlist ({wishlist.length})</h2>
          <button
            className="wishlist-close"
            onClick={() => setShowWishlist(false)}
          >
            ✕
          </button>
        </div>

        <div className="wishlist-items">
          {wishlist.length === 0 ? (
            <div className="wishlist-empty">
              <span className="wishlist-empty-icon">💔</span>
              <p>Your wishlist is empty</p>
              <span className="wishlist-empty-sub">
                Tap the ❤️ on products to add them here
              </span>
            </div>
          ) : (
            products
              .filter((p) => wishlist.includes(p.id))
              .map((product) => (
                <div key={product.id} className="wishlist-item">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="wishlist-item-img"
                  />
                  <div className="wishlist-item-info">
                    <h4 className="wishlist-item-name">{product.name}</h4>
                    <span className="wishlist-item-price">
                      ₹{product.price.toLocaleString()}
                    </span>
                    <div className="wishlist-item-actions">
                      <button
                        className="wishlist-add-cart"
                        onClick={() => addToCart(product)}
                      >
                        Add to Cart
                      </button>
                      <button
                        className="wishlist-remove"
                        onClick={() => toggleWishlist(product.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      {/* Cart Overlay */}
      {showCart && (
        <div
          className="cart-overlay"
          onClick={() => setShowCart(false)}
        ></div>
      )}

      {/* Cart Sidebar */}
      <div className={`cart-sidebar ${showCart ? "open" : ""}`}>
        <div className="cart-sidebar-header">
          <h2>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ verticalAlign: "middle", marginRight: "8px" }}
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            Shopping Bag ({cartCount})
          </h2>
          <button
            className="cart-sidebar-close"
            onClick={() => setShowCart(false)}
          >
            ✕
          </button>
        </div>

        <div className="cart-sidebar-items">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <span className="cart-empty-icon">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.4"
                >
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </span>
              <p>Your bag is empty</p>
              <span className="cart-empty-sub">
                Add products to see them here
              </span>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-sidebar-item">
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-sidebar-item-img"
                />
                <div className="cart-sidebar-item-info">
                  <h4 className="cart-sidebar-item-name">{item.name}</h4>
                  <span className="cart-sidebar-item-price">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </span>
                  <div className="cart-qty-controls">
                    <button
                      className="qty-btn"
                      onClick={() => decreaseQty(item.id)}
                    >
                      −
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => increaseQty(item.id)}
                    >
                      +
                    </button>
                    <button
                      className="cart-item-remove"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-sidebar-footer">
            <div className="cart-footer-row">
              <span className="cart-footer-label">Subtotal</span>
              <span className="cart-footer-value">
                ₹{cartTotal.toLocaleString()}
              </span>
            </div>
            <div className="cart-footer-row">
              <span className="cart-footer-label">Shipping</span>
              <span className="cart-footer-free">FREE</span>
            </div>
            <div className="cart-footer-divider"></div>
            <div className="cart-footer-row total">
              <span className="cart-footer-label">Total</span>
              <span className="cart-footer-value">
                ₹{cartTotal.toLocaleString()}
              </span>
            </div>
            <button className="cart-checkout-btn">Proceed to Checkout</button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 TechStore. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
