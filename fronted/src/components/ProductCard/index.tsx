import React from "react";
import { Link } from "react-router-dom";
import styles from "./index.module.css";
import type { Product } from "../../data/mockdata/products";

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onAddToCart,
  onToggleWishlist,
}) => {
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

  const shapeClass = getShapeClass(product.shapeType);

  return (
    <Link to={`/products/${product.id}`} className={styles.cardLink}>
      <div className={`${styles.card} group`}>
        {/* Padded Image Container */}
        <div className={`${styles.imageWrapper} ${shapeClass}`}>
          {product.badge && <span className={styles.badge}>{product.badge}</span>}

          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onToggleWishlist(product);
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

        {/* Info Details */}
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
                onAddToCart(product);
              }}
              className={styles.cartBtn}
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
    </Link>
  );
};

export default ProductCard;
