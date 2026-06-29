import React from "react";
import styles from "./index.module.css";
import { GRID_PRODUCTS } from "../../data/mockdata/products";
import { useCart } from "../../context/CartContext";

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

  const getShapeClass = (shapeType?: string) => {
    switch (shapeType) {
      case "top-right-round":
        return styles.shapeTopRightRound;
      case "oval-right":
        return styles.shapeOvalRight;
      case "sharp-rect":
        return styles.shapeSharpRect;
      case "wavy":
        return styles.shapeWavy;
      case "compact-box":
        return styles.shapeCompactBox;
      case "diagonal-round":
        return styles.shapeDiagonalRound;
      default:
        return "";
    }
  };

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
          {filteredProducts.map((product) => {
            const isWishlisted = wishlist.includes(product.id);
            const shapeClass = getShapeClass(product.shapeType);

            return (
              <div key={product.id} className={`${styles.card} group`}>
                {/* Asymmetric Shaped Image Wrapper */}
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

                  {/* Add to Cart Overlay */}
                  <div className={styles.actionOverlay}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        addToCart(product);
                      }}
                      className={styles.quickAddBtn}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>

                {/* Details Section */}
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
    </section>
  );
};

export default ProductGrid;
