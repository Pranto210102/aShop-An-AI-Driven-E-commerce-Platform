import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import TrendingProducts from "../../components/TrendingProducts";
import ProductGrid from "../../components/ProductGrid";
import Footer from "../../components/Footer";
import styles from "./index.module.css";

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
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
      const gridElement = document.getElementById("products-grid");
      if (gridElement) {
        gridElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Dynamic Header */}
      <Header
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
          <div className={styles.heroActionGroup}>
            <Link
              to="/products"
              className={styles.heroBtnPrimary}
            >
              Shop Full Catalog
            </Link>
            <button
              onClick={() => {
                const gridElement = document.getElementById("products-grid");
                if (gridElement) {
                  gridElement.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className={styles.heroBtnSecondary}
            >
              Explore Collection
            </button>
          </div>
        </section>

        {/* Trending Collection Carousel Section */}
        <TrendingProducts />

        {/* Organic Shaped Bento Grid Section */}
        <ProductGrid
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
        />
      </main>

      {/* Editorial Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;