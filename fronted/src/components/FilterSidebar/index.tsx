import React from "react";
import styles from "./index.module.css";
import { CATEGORIES } from "../../data/mockdata/products";

interface FilterSidebarProps {
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  minRating: number;
  onMinRatingChange: (rating: number) => void;
  selectedShapes: string[];
  onToggleShape: (shape: string) => void;
  selectedBadges: string[];
  onToggleBadge: (badge: string) => void;
  onResetFilters: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  selectedCategories,
  onToggleCategory,
  priceRange,
  onPriceRangeChange,
  minRating,
  onMinRatingChange,
  selectedShapes,
  onToggleShape,
  selectedBadges,
  onToggleBadge,
  onResetFilters,
}) => {
  return (
    <div className={styles.sidebarContent}>
      {/* Category Section */}
      <div className={styles.filterGroup}>
        <h3 className={styles.filterGroupTitle}>Categories</h3>
        <div className={styles.checkboxList}>
          {CATEGORIES.map((cat) => {
            const isChecked = selectedCategories.includes(cat);
            return (
              <label key={cat} className={styles.checkboxLabel}>
                <div className={styles.checkboxWrapper}>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleCategory(cat)}
                    className={styles.checkboxInput}
                  />
                  <div className={styles.checkboxCustom}>
                    {isChecked && (
                      <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className={styles.checkboxText}>{cat}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Range Section */}
      <div className={styles.filterGroup}>
        <h3 className={styles.filterGroupTitle}>Price Range</h3>
        <div className={styles.priceSliderContainer}>
          <div className={styles.sliderValueRow}>
            <span>Max Price:</span>
            <span className={styles.sliderValueHighlight}>{priceRange[1]} Tk</span>
          </div>
          <input
            type="range"
            min="0"
            max="1000"
            step="10"
            value={priceRange[1]}
            onChange={(e) => onPriceRangeChange([priceRange[0], parseInt(e.target.value)])}
            className={styles.rangeInput}
          />
          <div className={styles.priceInputs}>
            <div className={styles.priceInputWrapper}>
              <span className={styles.priceCurrency}>Tk</span>
              <input
                type="number"
                min="0"
                max={priceRange[1]}
                value={priceRange[0]}
                onChange={(e) => onPriceRangeChange([Math.max(0, parseInt(e.target.value) || 0), priceRange[1]])}
                className={styles.priceNumberInput}
                placeholder="Min"
              />
            </div>
            <span className={styles.priceSeparator}>to</span>
            <div className={styles.priceInputWrapper}>
              <span className={styles.priceCurrency}>Tk</span>
              <input
                type="number"
                min={priceRange[0]}
                max="1000"
                value={priceRange[1]}
                onChange={(e) => onPriceRangeChange([priceRange[0], Math.min(1000, parseInt(e.target.value) || 1000)])}
                className={styles.priceNumberInput}
                placeholder="Max"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Rating Section */}
      <div className={styles.filterGroup}>
        <h3 className={styles.filterGroupTitle}>Customer Rating</h3>
        <div className={styles.ratingList}>
          {[4.5, 4.0, 3.5].map((rating) => {
            const isActive = minRating === rating;
            return (
              <button
                key={rating}
                type="button"
                onClick={() => onMinRatingChange(isActive ? 0 : rating)}
                className={`${styles.ratingButton} ${isActive ? styles.ratingActive : ""}`}
              >
                <div className={styles.starsWrapper}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`${styles.starIcon} ${
                        star <= Math.floor(rating)
                          ? styles.starFilled
                          : star - 0.5 <= rating
                          ? styles.starHalf
                          : styles.starEmpty
                      }`}
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <span className={styles.ratingText}>{rating} & Up</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Shape Aesthetics Section */}
      <div className={styles.filterGroup}>
        <h3 className={styles.filterGroupTitle}>Organic Contour Shape</h3>
        <div className={styles.shapeGrid}>
          {[
            { id: "top-right-round", label: "Top Curve", styleClass: styles.shapeThumbTopRightRound },
            { id: "oval-right", label: "Oval Wing", styleClass: styles.shapeThumbOvalRight },
            { id: "sharp-rect", label: "Brutalist", styleClass: styles.shapeThumbSharpRect },
            { id: "wavy", label: "Wavy Organic", styleClass: styles.shapeThumbWavy },
            { id: "compact-box", label: "Compact Square", styleClass: styles.shapeThumbCompactBox },
            { id: "diagonal-round", label: "Diagonal Curve", styleClass: styles.shapeThumbDiagonalRound },
          ].map((shape) => {
            const isSelected = selectedShapes.includes(shape.id);
            return (
              <button
                key={shape.id}
                type="button"
                onClick={() => onToggleShape(shape.id)}
                className={`${styles.shapeBtn} ${isSelected ? styles.shapeBtnActive : ""}`}
              >
                <div className={`${styles.shapeThumb} ${shape.styleClass}`} />
                <span className={styles.shapeLabel}>{shape.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Collection Badges Section */}
      <div className={styles.filterGroup}>
        <h3 className={styles.filterGroupTitle}>Collections</h3>
        <div className={styles.badgeTags}>
          {["Best Seller", "New Season", "Trending", "Organic Form", "Exclusive", "Hot Buy", "Limited Run"].map(
            (badge) => {
              const isSelected = selectedBadges.includes(badge);
              return (
                <button
                  key={badge}
                  type="button"
                  onClick={() => onToggleBadge(badge)}
                  className={`${styles.badgeTagBtn} ${isSelected ? styles.badgeTagBtnActive : ""}`}
                >
                  {badge}
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* Clear Filters */}
      <button type="button" onClick={onResetFilters} className={styles.clearBtn}>
        Reset All Filters
      </button>
    </div>
  );
};

export default FilterSidebar;
