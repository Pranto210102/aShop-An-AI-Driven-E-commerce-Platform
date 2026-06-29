import React from "react";
import styles from "./index.module.css";
import { GRID_PRODUCTS } from "../../data/mockdata/products";
import { useCart } from "../../context/CartContext";
import ProductCard from "../ProductCard";

interface ProductGridProps {
  searchQuery: string;
  selectedCategory: string | null;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  searchQuery,
  selectedCategory,
}) => {
  const { wishlist, addToCart, toggleWishlist } = useCart();
  // Filter products based on search query and category selections
  const filteredProducts = GRID_PRODUCTS.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className={styles.section} id="products-grid">
      <div className={styles.sectionHeader}>
        <h2 className={styles.title}>
          {selectedCategory ? `${selectedCategory}` : "Curated Collection"}
        </h2>
        <p className="text-xs text-[var(--text)] mt-1">
          Explore our collection of sculptural shapes and artisanal details.
        </p>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[var(--border)] rounded-2xl">
          <svg className="w-12 h-12 mx-auto text-[var(--text)] opacity-40 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-[var(--text)]">No items found matching your search.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[var(--text-h)] text-[var(--bg)] rounded-full hover:opacity-90"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredProducts.map((product) => (
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
    </section>
  );
};

export default ProductGrid;
