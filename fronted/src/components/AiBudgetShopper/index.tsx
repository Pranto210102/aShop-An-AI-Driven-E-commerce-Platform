import React, { useState, useMemo } from "react";
import styles from "./index.module.css";
import { TRENDING_PRODUCTS, GRID_PRODUCTS } from "../../data/mockdata/products";
import type { Product } from "../../data/mockdata/products";
import { useCart } from "../../context/CartContext";

const AiBudgetShopper: React.FC = () => {
  const { addToCart, showToast } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [budget, setBudget] = useState("");
  const [intent, setIntent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Product[] | null>(null);

  // Combine products for scan catalog
  const catalogProducts = useMemo(() => {
    const combined = [...TRENDING_PRODUCTS, ...GRID_PRODUCTS];
    const uniqueIds = new Set<string>();
    return combined.filter((prod) => {
      if (uniqueIds.has(prod.id)) return false;
      uniqueIds.add(prod.id);
      return true;
    });
  }, []);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    const budgetValue = parseFloat(budget);

    if (isNaN(budgetValue) || budgetValue <= 0) {
      showToast("Please enter a valid budget amount in Tk");
      return;
    }

    setIsLoading(true);
    setRecommendations(null);

    // Simulate backend API processing delay (Gemini analysis)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    /*
     * -------------------------------------------------------------
     * BACKEND GEMINI API PORTAL PLACEHOLDER
     * -------------------------------------------------------------
     * To connect to the real Gemini API in the future, you can replace the local
     * optimization script below with a fetch call to your backend:
     * 
     * try {
     *   const res = await fetch("/api/gemini/budget-planner", {
     *     method: "POST",
     *     headers: { "Content-Type": "application/json" },
     *     body: JSON.stringify({ budget: budgetValue, intent: intent })
     *   });
     *   const data = await res.json();
     *   setRecommendations(data.products);
     * } catch (err) {
     *   console.error(err);
     * }
     * -------------------------------------------------------------
     */

    // Client-side smart combination recommender
    const keywords = intent
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
      .split(/\s+/)
      .filter((word) => word.length > 2); // Filter out short filler words

    // Calculate relevance score for each product based on intent keywords
    const scoredProducts = catalogProducts.map((product) => {
      let score = 1; // Base score
      
      const searchString = `${product.name} ${product.category} ${product.description || ""}`.toLowerCase();
      
      keywords.forEach((keyword) => {
        if (searchString.includes(keyword)) {
          score += 10; // High relevance bump for matching keywords
        }
      });

      return { product, score };
    });

    // Sort by relevance score (highest first), then by price (cheapest first) to fit budget
    scoredProducts.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.product.price - b.product.price;
    });

    // Greedy knapsack optimization selection under budget
    let currentTotal = 0;
    const selected: Product[] = [];

    for (const item of scoredProducts) {
      if (currentTotal + item.product.price <= budgetValue) {
        selected.push(item.product);
        currentTotal += item.product.price;
      }
    }

    setRecommendations(selected);
    setIsLoading(false);
  };

  const handleAddAllToCart = () => {
    if (!recommendations || recommendations.length === 0) return;
    
    recommendations.forEach((product) => {
      addToCart(product);
    });

    showToast(`Added ${recommendations.length} recommended items to your cart!`);
    setIsOpen(false);
  };

  const totalCost = recommendations
    ? recommendations.reduce((sum, p) => sum + p.price, 0)
    : 0;

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={styles.floatingButton}
        aria-label="Open AI Budget Shopper"
      >
        <svg className={styles.aiIcon} viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C8.83 12.19 8 10.66 8 9c0-2.21 1.79-4 4-4s4 1.79 4 4c0 1.66-.83 3.19-2.15 4.1z" />
          <path d="M12 7v4M10 9h4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span>AI Budget Shopper</span>
      </button>

      {/* Slide-over drawer and backdrop */}
      {isOpen && (
        <div className={styles.drawerOverlay} onClick={() => setIsOpen(false)}>
          <div
            className={styles.drawerContainer}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking drawer content
          >
            <div className={styles.drawerContent}>
              {/* Drawer Header */}
              <div className={styles.header}>
                <h2 className={styles.title}>
                  <svg className="w-5 h-5 text-purple-600 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" />
                  </svg>
                  Gemini Budget Assistant
                </h2>
                <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Form Input Section */}
              <form onSubmit={handleAnalyze} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Your Budget (Tk)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 5000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className={styles.input}
                    min="1"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>What are you looking for?</label>
                  <textarea
                    required
                    placeholder="e.g. Minimalist items for living room decoration or accessories for garments"
                    value={intent}
                    onChange={(e) => setIntent(e.target.value)}
                    className={styles.textarea}
                  />
                </div>

                <button type="submit" disabled={isLoading} className={styles.submitBtn}>
                  {isLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>Thinking...</span>
                    </>
                  ) : (
                    <span>Analyze & Optimize</span>
                  )}
                </button>
              </form>

              {/* Loading State Skeleton */}
              {isLoading && (
                <div className={styles.loadingArea}>
                  <div className={styles.spinner} />
                  <span className={styles.loadingText}>Gemini is optimizing combinations...</span>
                </div>
              )}

              {/* Recommendation Results */}
              {recommendations && (
                <div className={styles.resultsPanel}>
                  <h3 className={styles.resultsTitle}>Suggested Combinations</h3>

                  {recommendations.length === 0 ? (
                    <div className={styles.noResults}>
                      No products fit within your entered budget. Try increasing the amount or matching a different keyword.
                    </div>
                  ) : (
                    <>
                      <div className={styles.recList}>
                        {recommendations.map((product) => (
                          <div key={product.id} className={styles.recItemCard}>
                            <div className="flex items-center gap-3">
                              <div className={styles.itemThumbWrapper}>
                                <img
                                  src={product.imageUrl}
                                  alt={product.name}
                                  className={styles.itemThumb}
                                />
                              </div>
                              <div className={styles.itemInfo}>
                                <h4 className={styles.itemName}>{product.name}</h4>
                                <span className={styles.itemPrice}>{product.price} Tk</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Summary calculations */}
                      <div className={styles.summaryCard}>
                        <div className={styles.summaryRow}>
                          <span>User Budget Limit</span>
                          <span className="font-semibold">{budget} Tk</span>
                        </div>
                        <div className={styles.summaryRow}>
                          <span>Optimized Item Count</span>
                          <span className="font-semibold">{recommendations.length} items</span>
                        </div>
                        <div className={styles.summaryTotalRow}>
                          <span>Recommended Total</span>
                          <span>{totalCost} Tk</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddAllToCart}
                        className={styles.addCartBtn}
                      >
                        Add All items to Cart
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AiBudgetShopper;
