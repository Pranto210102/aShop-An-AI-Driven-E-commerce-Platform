import React, { useState, useEffect, useRef } from "react";
import styles from "./index.module.css";
import { TRENDING_PRODUCTS } from "../../data/mockdata/products";
import { useCart } from "../../context/CartContext";

const TrendingProducts: React.FC = () => {
  const { addToCart, toggleWishlist, wishlist } = useCart();
  const [activeIndex, setActiveIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Responsive items calculation
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1); // Mobile
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2); // Tablet
      } else {
        setItemsPerView(3); // Desktop
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalItems = TRENDING_PRODUCTS.length;
  const maxIndex = totalItems - itemsPerView;

  // Auto-play timer
  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000); // cycle slowly every 4 seconds

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, maxIndex]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  return (
    <section
      className={styles.section}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.title}>
            Trending Collection
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-ping" />
          </h2>
          <p className="text-xs text-[var(--text)] mt-1">
            Carefully curated items defining this season's editorial standard.
          </p>
        </div>
        {/* Carousel controls */}
        <div className={styles.controls}>
          <button
            onClick={handlePrev}
            className={styles.controlBtn}
            aria-label="Previous Products"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={handleNext}
            className={styles.controlBtn}
            aria-label="Next Products"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.carouselContainer}>
        <div className={styles.sliderTrackWrapper}>
          <div
            className={styles.sliderTrack}
            style={{
              transform: `translateX(-${activeIndex * (100 / itemsPerView)}%)`,
            }}
          >
            {TRENDING_PRODUCTS.map((product) => {
              const isWishlisted = wishlist.includes(product.id);
              return (
                <div
                  key={product.id}
                  className={styles.slide}
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  <div className={`${styles.card} group`}>
                    {/* Image section */}
                    <div className={styles.imageWrapper}>
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
                      <div className={styles.overlay}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            addToCart(product);
                          }}
                          className={styles.actionBtn}
                        >
                          Quick Add
                        </button>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className={styles.content}>
                      <span className={styles.category}>{product.category}</span>
                      <h3 className={styles.productName}>{product.name}</h3>
                      <div className={styles.priceRating}>
                        <span className={styles.price}>{product.price} Tk</span>
                        <div className={styles.rating}>
                          <svg className={styles.starIcon} viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span>{product.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Dots */}
        <div className={styles.dotsWrapper}>
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`${styles.dot} ${activeIndex === idx ? styles.activeDot : ""}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingProducts;
