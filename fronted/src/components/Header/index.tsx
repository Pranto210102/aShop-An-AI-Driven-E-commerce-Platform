import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./index.module.css";
import { CATEGORIES } from "../../data/mockdata/products";
import { useCart } from "../../context/CartContext";
import { useTheme } from "../../context/ThemeContext";

interface HeaderProps {
  onSearch?: (query: string) => void;
  onSelectCategory?: (category: string | null) => void;
  selectedCategory?: string | null;
}

const Header: React.FC<HeaderProps> = ({
  onSearch,
  onSelectCategory,
  selectedCategory = null,
}) => {
  const { cart, wishlist } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle scroll shadows
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle click outside category dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleCategorySelect = (category: string | null) => {
    if (onSelectCategory) {
      onSelectCategory(category);
    } else {
      navigate(category ? `/products?category=${encodeURIComponent(category)}` : "/products");
    }
    setIsCategoryOpen(false);
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        {/* Logo & Navigation */}
        <div className="flex items-center gap-6">
          <Link to="/" className={styles.logoArea}>
            <span className={styles.logoText}>
              aShop<span className={styles.accentDot}></span>
            </span>
          </Link>
          <Link to="/products" className={styles.shopLink}>
            Shop Catalog
          </Link>
        </div>

        {/* Search Bar / Categories (Large Screens) */}
        <form onSubmit={handleSearchSubmit} className={styles.searchWrapper}>
          <input
            type="text"
            placeholder="Search our catalog, apparel, home decor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <div className={styles.searchActions}>
            {/* Category Dropdown */}
            <div className={styles.categoryDropdown} ref={dropdownRef}>
              <button
                type="button"
                className={styles.categoryBtn}
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              >
                <span>{selectedCategory || "Categories"}</span>
                <svg
                  className={`w-3 h-3 transition-transform ${isCategoryOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isCategoryOpen && (
                <div className={styles.categoryMenu}>
                  <button
                    type="button"
                    className={styles.categoryItem}
                    onClick={() => handleCategorySelect(null)}
                  >
                    All Items
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={styles.categoryItem}
                      onClick={() => handleCategorySelect(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" className={styles.searchButton}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </form>

        {/* Nav Actions */}
        <div className={styles.navActions}>
          {/* Search trigger for mobile */}
          <button
            className="md:hidden p-2.5 rounded-full hover:bg-[var(--code-bg)] text-[var(--text)] transition-colors cursor-pointer"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Search"
          >
            <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            className={styles.iconButton}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? (
              <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            ) : (
              <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z"
                />
              </svg>
            )}
          </button>

          {/* Login / Profile */}
          <Link to="/profile" className={styles.iconButton} aria-label="Account">
            <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </Link>

          {/* Favorites / Heart Icon */}
          <Link to="/favorites" className={styles.iconButton} aria-label="Favorites">
            <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            {wishlistCount > 0 && <span className={styles.badge}>{wishlistCount}</span>}
          </Link>

          {/* Cart Icon */}
          <Link to="/cart" className={styles.iconButton} aria-label="Cart">
            <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
          </Link>

          {/* Burger Menu for Mobile */}
          <button
            className={styles.mobileMenuBtn}
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className={styles.mobileDrawer}>
          <div className={styles.drawerOverlay} onClick={() => setIsMobileMenuOpen(false)} />
          <div className={styles.drawerContent}>
            <div className={styles.drawerHeader}>
              <span className={styles.logoText}>
                aShop<span className={styles.accentDot}></span>
              </span>
              <button className={styles.closeButton} onClick={() => setIsMobileMenuOpen(false)}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className={styles.mobileSearchWrapper}>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.mobileSearchInput}
              />
              <button type="submit" className={styles.mobileSearchIcon}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </form>

            {/* Categories list in Mobile */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text)] mb-3">
                Categories
              </h3>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  className={`text-left py-1.5 text-sm font-medium transition-colors ${
                    selectedCategory === null ? "text-[var(--accent)] font-semibold" : "text-[var(--text)]"
                  }`}
                  onClick={() => {
                    handleCategorySelect(null);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  All Items
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`text-left py-1.5 text-sm font-medium transition-colors ${
                      selectedCategory === cat ? "text-[var(--accent)] font-semibold" : "text-[var(--text)]"
                    }`}
                    onClick={() => {
                      handleCategorySelect(cat);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
