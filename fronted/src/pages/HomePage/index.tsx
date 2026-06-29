import React, { useState } from "react";
import Header from "../../components/Header";
import TrendingProducts from "../../components/TrendingProducts";
import ProductGrid from "../../components/ProductGrid";
import Footer from "../../components/Footer";
import styles from "./index.module.css";
import type { Product } from "../../data/mockdata/products";

const HomePage: React.FC = () => {
  const [cart, setCart] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Toast notifications state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastTimer, setToastTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (message: string) => {
    if (toastTimer) clearTimeout(toastTimer);
    setToastMessage(message);
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 3000);
    setToastTimer(timer);
  };

  const handleAddToCart = (product: Product) => {
    setCart((prev) => [...prev, product]);
    showToast(`"${product.name}" added to cart`);
  };

  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.includes(product.id);
      if (exists) {
        showToast(`Removed "${product.name}" from favorites`);
        return prev.filter((id) => id !== product.id);
      } else {
        showToast(`Added "${product.name}" to favorites`);
        return [...prev, product.id];
      }
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      showToast(`Searching catalog for "${query}"`);
      // Scroll to grid automatically when search is executed
      const gridElement = document.getElementById("products-grid");
      if (gridElement) {
        gridElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleSelectCategory = (category: string | null) => {
    setSelectedCategory(category);
    if (category) {
      showToast(`Filter applied: ${category}`);
      const gridElement = document.getElementById("products-grid");
      if (gridElement) {
        gridElement.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      showToast("Showing all items");
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Dynamic Header */}
      <Header
        cartCount={cart.length}
        wishlistCount={wishlist.length}
        onSearch={handleSearch}
        onSelectCategory={handleSelectCategory}
        selectedCategory={selectedCategory}
      />

      <main className="flex-grow">
        {/* Aesthetic Studio Hero Section */}
        <section className={styles.heroBanner}>
          <span className={styles.heroTag}>Exclusively Crafted</span>
          <h1 className={styles.heroTitle}>
            The Beauty of Organic Contours
          </h1>
          <p className={styles.heroDesc}>
            Art-directed objects, functional furniture, and garments refined by hand to form elegant spaces.
          </p>
          <button
            onClick={() => {
              const gridElement = document.getElementById("products-grid");
              if (gridElement) {
                gridElement.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className={styles.heroBtn}
          >
            Explore Catalog
          </button>
        </section>

        {/* Trending Collection Carousel Section */}
        <TrendingProducts
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          wishlist={wishlist}
        />

        {/* Organic Shaped Bento Grid Section */}
        <ProductGrid
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          wishlist={wishlist}
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
        />
      </main>

      {/* Editorial Footer */}
      <Footer />

      {/* Dynamic Action Toast Notifications */}
      {toastMessage && (
        <div className={styles.toast}>
          <span className={styles.toastCheck}>✓</span>
          <span className={styles.toastText}>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default HomePage;