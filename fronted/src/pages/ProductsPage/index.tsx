import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import FilterSidebar from "../../components/FilterSidebar";
import ProductCard from "../../components/ProductCard";
import styles from "./index.module.css";
import { CATEGORIES, type Product } from "../../data/mockdata/products";
import { useCart } from "../../context/CartContext";

const ProductsPage: React.FC = () => {
  const { wishlist, addToCart, toggleWishlist } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState("featured");

  // Read search & category query parameters
  const searchQuery = searchParams.get("search") || "";
  const urlCategory = searchParams.get("category");

  // Filter States
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    urlCategory ? [urlCategory] : []
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedShapes, setSelectedShapes] = useState<string[]>([]);
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Sync state if category changes in URL (e.g. clicking category in header)
  useEffect(() => {
    if (urlCategory) {
      setSelectedCategories((prev) => {
        if (prev.includes(urlCategory) && prev.length === 1) return prev;
        return [urlCategory];
      });
    } else {
      setSelectedCategories((prev) => (prev.length === 1 && CATEGORIES.includes(prev[0]) ? [] : prev));
    }
  }, [urlCategory]);

  const [processedProducts, setProcessedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const params = new URLSearchParams();
        
        if (searchQuery) params.append("search", searchQuery);
        if (selectedCategories.length > 0) params.append("category", selectedCategories.join(","));
        params.append("minPrice", priceRange[0].toString());
        params.append("maxPrice", priceRange[1].toString());
        if (minRating > 0) params.append("minRating", minRating.toString());
        if (selectedShapes.length > 0) params.append("shapes", selectedShapes.join(","));
        if (selectedBadges.length > 0) params.append("badges", selectedBadges.join(","));
        params.append("sortBy", sortBy);

        const res = await fetch(`${API_URL}/api/products?${params.toString()}`);
        const data = await res.json();
        
        if (data.success) {
          // Adapt MongoDB _id key to client id parameter
          const mapped = data.data.map((p: any) => ({
            ...p,
            id: p._id,
          }));
          setProcessedProducts(mapped);
        }
      } catch (err) {
        console.error("Products Fetch Error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [
    searchQuery,
    selectedCategories,
    priceRange,
    minRating,
    selectedShapes,
    selectedBadges,
    sortBy,
  ]);

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

  const handleToggleCategory = (category: string) => {
    const next = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];

    setSelectedCategories(next);

    setSearchParams((search) => {
      if (next.length === 1) {
        search.set("category", next[0]);
      } else {
        search.delete("category");
      }
      return search;
    });
  };

  const handleSelectCategory = (category: string | null) => {
    if (category === null) {
      setSelectedCategories([]);
      setSearchParams((prev) => {
        prev.delete("category");
        return prev;
      });
    } else {
      handleToggleCategory(category);
    }
  };

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 1000]);
    setMinRating(0);
    setSelectedShapes([]);
    setSelectedBadges([]);
    setSearchParams((search) => {
      search.delete("category");
      search.delete("search");
      return search;
    });
    setSortBy("featured");
  };



  return (
    <div className={styles.pageWrapper}>
      <Header
        onSearch={handleSearch}
        onSelectCategory={handleSelectCategory}
        selectedCategory={selectedCategories.length === 1 ? selectedCategories[0] : null}
      />

      <main className={styles.container}>
        {/* Page title and sorting controls */}
        <div className={styles.pageHeader}>
          <div className={styles.titleArea}>
            <h1 className={styles.title}>
              {selectedCategories.length === 1 ? `${selectedCategories[0]}` : "Catalog"}
            </h1>
            <p className={styles.subtitle}>
              Showing {processedProducts.length} items of artisanal quality.
            </p>
          </div>

          <div className={styles.filterControls}>
            {/* Mobile Filter Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className={styles.mobileFilterBtn}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <span>Filters</span>
            </button>

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

        {/* Layout Container holding Sidebar on Left and Grid on Right */}
        <div className={styles.layoutContainer}>
          {/* Desktop Sidebar column */}
          <aside className={styles.desktopSidebar}>
            <FilterSidebar
              selectedCategories={selectedCategories}
              onToggleCategory={handleToggleCategory}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              minRating={minRating}
              onMinRatingChange={setMinRating}
              selectedShapes={selectedShapes}
              onToggleShape={(shape) =>
                setSelectedShapes((prev) =>
                  prev.includes(shape) ? prev.filter((s) => s !== shape) : [...prev, shape]
                )
              }
              selectedBadges={selectedBadges}
              onToggleBadge={(badge) =>
                setSelectedBadges((prev) =>
                  prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]
                )
              }
              onResetFilters={handleResetFilters}
            />
          </aside>

          {/* Main content grid area */}
          <div className={styles.productSection}>
            {/* Category Pills (horizontal scroll / wrap at top) */}
            <div className={styles.categoryPills}>
              <button
                type="button"
                className={`${styles.pill} ${selectedCategories.length === 0 ? styles.activePill : ""}`}
                onClick={() => handleSelectCategory(null)}
              >
                All Products
              </button>
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    className={`${styles.pill} ${isActive ? styles.activePill : ""}`}
                    onClick={() => handleSelectCategory(cat)}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Catalog Grid */}
            {isLoading ? (
              <div className="flex justify-center items-center py-32 w-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--text-h)]"></div>
              </div>
            ) : processedProducts.length === 0 ? (
              <div className={styles.emptyState}>
                <svg className="w-12 h-12 mx-auto text-[var(--text)] opacity-40 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-[var(--text)]">No items found matching your filters.</p>
                <button
                  onClick={handleResetFilters}
                  className="mt-4 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider bg-[var(--text-h)] text-[var(--bg)] rounded-full hover:opacity-90 transition-opacity"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
          <div className={styles.grid}>
            {processedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlist.includes(product.id)}
                onAddToCart={addToCart}
                onToggleWishlist={toggleWishlist}
              />
            ))}
          </div>
        )}
          </div>
        </div>

        {/* Mobile slide-over drawer and backdrop */}
        {mobileSidebarOpen && (
          <div className={styles.drawerOverlay} onClick={() => setMobileSidebarOpen(false)}>
            <div
              className={styles.drawerContainer}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.drawerContent}>
                {/* Drawer Header */}
                <div className={styles.drawerHeader}>
                  <h2 className={styles.drawerTitle}>
                    Customize Choices
                  </h2>
                  <button className={styles.drawerCloseBtn} onClick={() => setMobileSidebarOpen(false)}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {/* Drawer Body */}
                <div className={styles.drawerBody}>
                  <FilterSidebar
                    selectedCategories={selectedCategories}
                    onToggleCategory={handleToggleCategory}
                    priceRange={priceRange}
                    onPriceRangeChange={setPriceRange}
                    minRating={minRating}
                    onMinRatingChange={setMinRating}
                    selectedShapes={selectedShapes}
                    onToggleShape={(shape) =>
                      setSelectedShapes((prev) =>
                        prev.includes(shape) ? prev.filter((s) => s !== shape) : [...prev, shape]
                      )
                    }
                    selectedBadges={selectedBadges}
                    onToggleBadge={(badge) =>
                      setSelectedBadges((prev) =>
                        prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]
                      )
                    }
                    onResetFilters={handleResetFilters}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductsPage;
