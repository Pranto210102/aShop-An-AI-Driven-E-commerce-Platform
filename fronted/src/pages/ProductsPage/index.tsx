import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import styles from "./index.module.css";
import { TRENDING_PRODUCTS, GRID_PRODUCTS, CATEGORIES } from "../../data/mockdata/products";
import { useCart } from "../../context/CartContext";

const ProductsPage: React.FC = () => {
  const { wishlist, addToCart, toggleWishlist } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState("featured");

  // Read search & category query parameters
  const searchQuery = searchParams.get("search") || "";
  const selectedCategory = searchParams.get("category") || null;

  // Merge trending and grid products and eliminate duplicates
  const allProducts = useMemo(() => {
    const combined = [...TRENDING_PRODUCTS, ...GRID_PRODUCTS];
    const uniqueIds = new Set<string>();
    return combined.filter((prod) => {
      if (uniqueIds.has(prod.id)) return false;
      uniqueIds.add(prod.id);
      return true;
    });
  }, []);

  // Filter and sort items
  const processedProducts = useMemo(() => {
    let result = [...allProducts];

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Sorting logic
    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "name-desc") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }

    return result;
  }, [allProducts, searchQuery, selectedCategory, sortBy]);

  const handleSearch = (query: string) => {
    setSearchParams((prev) => {
      if (query) {
        prev.set("search", query);
      } else {
        prev.delete("search");
      }
      return prev;
    });
  };

  const handleSelectCategory = (category: string | null) => {
    setSearchParams((prev) => {
      if (category) {
        prev.set("category", category);
      } else {
        prev.delete("category");
      }
      return prev;
    });
  };

  const getShapeClass = (shapeType?: string) => {
    switch (shapeType) {
      case "top-right-round":
        return styles.shapeTopRightRound;
      case "oval-right":
        return styles.shapeOvalRight;
      case "wavy":
        return styles.shapeWavy;
      case "diagonal-round":
        return styles.shapeDiagonalRound;
      default:
        return "";
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <Header
        onSearch={handleSearch}
        onSelectCategory={handleSelectCategory}
        selectedCategory={selectedCategory}
      />

      <main className={styles.container}>
        {/* Page title and sorting controls */}
        <div className={styles.pageHeader}>
          <div className={styles.titleArea}>
            <h1 className={styles.title}>
              {selectedCategory ? `${selectedCategory}` : "Catalog"}
            </h1>
            <p className={styles.subtitle}>
              Showing {processedProducts.length} items of artisanal quality.
            </p>
          </div>

          <div className={styles.filterControls}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.sortSelect}
              aria-label="Sort products"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Alphabetical: A-Z</option>
              <option value="name-desc">Alphabetical: Z-A</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className={styles.categoryPills}>
          <button
            type="button"
            className={`${styles.pill} ${!selectedCategory ? styles.activePill : ""}`}
            onClick={() => handleSelectCategory(null)}
          >
            All Products
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`${styles.pill} ${selectedCategory === cat ? styles.activePill : ""}`}
              onClick={() => handleSelectCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Catalog Grid */}
        {processedProducts.length === 0 ? (
          <div className={styles.emptyState}>
            <svg className="w-12 h-12 mx-auto text-[var(--text)] opacity-40 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-[var(--text)]">No items found matching your filters.</p>
            <button
              onClick={() => {
                setSearchParams({});
                setSortBy("featured");
              }}
              className="mt-4 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider bg-[var(--text-h)] text-[var(--bg)] rounded-full hover:opacity-90 transition-opacity"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className={styles.grid}>
            {processedProducts.map((product) => {
              const isWishlisted = wishlist.includes(product.id);
              const shapeClass = getShapeClass(product.shapeType);

              return (
                <div key={product.id} className={`${styles.card} group`}>
                  {/* Padded Container */}
                  <div className={`${styles.imageWrapper} ${shapeClass}`}>
                    {product.badge && <span className={styles.badge}>{product.badge}</span>}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        toggleWishlist(product);
                      }}
                      className={`${styles.wishlistBtn} ${isWishlisted ? styles.wishlistActive : ""}`}
                      aria-label="Add to wishlist"
                    >
                      <svg className="w-4.5 h-4.5" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>

                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className={styles.image}
                      loading="lazy"
                    />
                  </div>

                  {/* Info details */}
                  <div className={styles.info}>
                    <span className={styles.category}>{product.category}</span>
                    <h3 className={styles.name}>{product.name}</h3>
                    <div className={styles.details}>
                      <span className={styles.price}>{product.price} Tk</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          addToCart(product);
                        }}
                        className="p-1.5 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 text-[var(--text)] hover:text-[var(--accent)] transition-colors cursor-pointer"
                        aria-label="Add to cart"
                      >
                        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductsPage;
