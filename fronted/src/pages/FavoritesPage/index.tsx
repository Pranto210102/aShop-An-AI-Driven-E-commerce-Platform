import React, { useMemo } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProductCard from "../../components/ProductCard";
import { TRENDING_PRODUCTS, GRID_PRODUCTS } from "../../data/mockdata/products";
import { useCart } from "../../context/CartContext";
import styles from "./index.module.css";
import { Link } from "react-router-dom";

const FavoritesPage: React.FC = () => {
  const { wishlist, addToCart, toggleWishlist } = useCart();

  // Combine products for reference
  const catalogProducts = useMemo(() => {
    const combined = [...TRENDING_PRODUCTS, ...GRID_PRODUCTS];
    const uniqueIds = new Set<string>();
    return combined.filter((prod) => {
      if (uniqueIds.has(prod.id)) return false;
      uniqueIds.add(prod.id);
      return true;
    });
  }, []);

  // Filter products that are in the user's wishlist
  const favoriteProducts = useMemo(() => {
    return catalogProducts.filter((product) => wishlist.includes(product.id));
  }, [catalogProducts, wishlist]);

  return (
    <div className={styles.pageWrapper}>
      <Header />

      <main className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Favorites</h1>
          <p className={styles.subtitle}>
            Your personal curation of {favoriteProducts.length} sculptural object(s).
          </p>
        </div>

        {favoriteProducts.length === 0 ? (
          <div className={styles.emptyState}>
            <svg className="w-16 h-16 mx-auto text-[var(--text)] opacity-35 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <p className="text-sm text-[var(--text)]">Your favorites list is currently empty.</p>
            <Link to="/products" className={styles.exploreBtn}>
              Explore Catalog
            </Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {favoriteProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={true}
                onAddToCart={addToCart}
                onToggleWishlist={toggleWishlist}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default FavoritesPage;
