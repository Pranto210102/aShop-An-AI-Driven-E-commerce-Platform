import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { type Product } from "../../data/mockdata/products";
import { useCart } from "../../context/CartContext";
import styles from "./index.module.css";

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { wishlist, addToCart, toggleWishlist, showToast } = useCart();
  const [quantity, setQuantity] = useState(1);

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      try {
        setIsLoading(true);
        const API_URL = import.meta.env.VITE_API_URL || "https://ashop-backend-4qwa.onrender.com";
        const res = await fetch(`${API_URL}/api/products/${productId}`);
        const data = await res.json();
        if (data.success) {
          setProduct({
            ...data.data,
            id: data.data._id,
          });
        }
      } catch (err) {
        console.error("Single Product Fetch Error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const isWishlisted = product ? wishlist.includes(product.id) : false;

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    showToast(`Added ${quantity} item(s) of "${product.name}" to your cart.`);
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

  if (isLoading) {
    return (
      <div className={styles.notFoundWrapper}>
        <Header />
        <main className={styles.notFoundContainer}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--text-h)]" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.notFoundWrapper}>
        <Header />
        <main className={styles.notFoundContainer}>
          <svg className="w-16 h-16 text-[var(--text)] opacity-40 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2>Product Not Found</h2>
          <p>We couldn't locate the artisanal piece you are looking for.</p>
          <Link to="/products" className={styles.catalogLink}>
            Return to Catalog
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const shapeClass = getShapeClass(product.shapeType);

  return (
    <div className={styles.pageWrapper}>
      <Header />

      <main className={styles.container}>
        {/* Navigation Breadcrumb */}
        <div className={styles.breadcrumb}>
          <Link to="/products" className={styles.backLink}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Catalog</span>
          </Link>
          <span className={styles.separator}>/</span>
          <span className={styles.currentCategory}>{product.category}</span>
          <span className={styles.separator}>/</span>
          <span className={styles.currentName}>{product.name}</span>
        </div>

        {/* Product Details Presentation Layout */}
        <div className={styles.presentationLayout}>
          {/* Left Side: Dynamic Gallery Frame */}
          <div className={styles.galleryFrame}>
            <div className={`${styles.imageWrapper} ${shapeClass}`}>
              {product.badge && <span className={styles.badge}>{product.badge}</span>}
              <img
                src={product.imageUrl}
                alt={product.name}
                className={styles.mainImage}
              />
            </div>
            {/* Visual descriptor about organic shape variety */}
            {product.shapeType && (
              <div className={styles.shapeNoteCard}>
                <span className={styles.shapeIcon}>
                  <svg className="w-5 h-5 text-[var(--accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" />
                  </svg>
                </span>
                <p className="text-xs text-[var(--text)] font-semibold">
                  This catalog piece is crafted using our proprietary <strong>{product.shapeType.replace(/-/g, " ")}</strong> silhouette, bringing fluid proportions and contour beauty.
                </p>
              </div>
            )}
          </div>

          {/* Right Side: Editorial Content Info */}
          <div className={styles.detailsContent}>
            <div className={styles.headerGroup}>
              <span className={styles.categoryLabel}>{product.category}</span>
              <h1 className={styles.productTitle}>{product.name}</h1>
              
              {/* Rating & Reviews block */}
              <div className={styles.ratingBlock}>
                <div className={styles.stars}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`${styles.starIcon} ${
                        i < Math.floor(product.rating) ? styles.starFilled : styles.starEmpty
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className={styles.ratingNumber}>{product.rating}</span>
                <span className={styles.reviewsCount}>({product.reviewsCount} reviews)</span>
              </div>
            </div>

            {/* Price section */}
            <div className={styles.priceRow}>
              <span className={styles.priceValue}>{product.price} Tk</span>
              <span className={styles.taxLabel}>VAT and shipping calculated at checkout</span>
            </div>

            {/* Editorial Description */}
            <div className={styles.descriptionGroup}>
              <h3 className={styles.sectionTitle}>The Concept</h3>
              <p className={styles.descriptionText}>
                {product.description ||
                  "Hand-finished in small studios using premium raw components. Each organic shape details subtle contour variations, bringing sculptural character to functional objects."}
              </p>
            </div>

            {/* Production Specifications */}
            <div className={styles.specsGroup}>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Availability</span>
                <span className={styles.specValue}>In Stock & Ready to Ship</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Studio Origin</span>
                <span className={styles.specValue}>Artisanal Design Lab</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>Material</span>
                <span className={styles.specValue}>Premium organic-derived sources</span>
              </div>
            </div>

            {/* Buy / Action block */}
            <div className={styles.purchaseBlock}>
              {/* Quantity Picker */}
              <div className={styles.quantityContainer}>
                <span className={styles.quantityLabel}>Quantity</span>
                <div className={styles.quantitySelector}>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className={styles.quantityBtn}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className={styles.quantityValue}>{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className={styles.quantityBtn}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={styles.actionButtons}>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={styles.addCartBtn}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span>Add to Cart</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className={`${styles.wishlistBtn} ${isWishlisted ? styles.wishlistBtnActive : ""}`}
                  aria-label="Save to Wishlist"
                >
                  <svg className="w-5 h-5" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;
