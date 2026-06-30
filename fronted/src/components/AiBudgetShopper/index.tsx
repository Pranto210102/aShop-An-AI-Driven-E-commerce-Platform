import React, { useState } from "react";
import styles from "./index.module.css";
import type { Product } from "../../data/mockdata/products";
import { useCart } from "../../context/CartContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AiBudgetShopper: React.FC = () => {
  const { addToCart, showToast } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [budget, setBudget] = useState("");
  const [intent, setIntent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Product[] | null>(null);
  const [aiReply, setAiReply] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    const budgetValue = parseFloat(budget);

    if (isNaN(budgetValue) || budgetValue <= 0) {
      showToast("Please enter a valid budget amount in Tk");
      return;
    }

    setIsLoading(true);
    setRecommendations(null);
    setAiReply(null);
    setErrorMessage(null);

    try {
      const res = await fetch(`${API_URL}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: intent,
          budget: budgetValue,
        }),
      });

      const data = await res.json();

      if (data.success && data.data) {
        // Map backend product format (_id) to frontend format (id)
        const mappedProducts: Product[] = (data.data.recommendations || []).map(
          (p: Record<string, unknown>) => ({
            id: (p._id as string) || (p.id as string),
            name: p.name as string,
            price: p.price as number,
            category: p.category as string,
            imageUrl: p.imageUrl as string,
            rating: p.rating as number,
            reviewsCount: p.reviewsCount as number,
            badge: (p.badge as string) || "",
            description: (p.description as string) || "",
            shapeType: (p.shapeType as Product["shapeType"]) || undefined,
          })
        );

        setRecommendations(mappedProducts);
        setAiReply(data.data.reply || null);
      } else {
        setErrorMessage(
          data.message || "AI service is temporarily unavailable. Please try again."
        );
        setRecommendations([]);
      }
    } catch {
      setErrorMessage(
        "Could not connect to the AI service. Please ensure the backend server is running."
      );
      setRecommendations([]);
    }

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
                  <svg className={styles.titleIcon} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" />
                  </svg>
                  Groq Budget Assistant
                </h2>
                <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
                  <svg className={styles.closeSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      <div className={styles.submitSpinner} />
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
                  <span className={styles.loadingText}>Groq is optimizing combinations...</span>
                </div>
              )}

              {/* Error Message */}
              {errorMessage && !isLoading && (
                <div className={styles.errorCard}>
                  <span className={styles.errorIcon}>⚠</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* AI Reply */}
              {aiReply && !isLoading && (
                <div className={styles.aiReplyCard}>
                  <span className={styles.aiReplyIcon}>✨</span>
                  <p>{aiReply}</p>
                </div>
              )}

              {/* Recommendation Results */}
              {recommendations && !isLoading && (
                <div className={styles.resultsPanel}>
                  <h3 className={styles.resultsTitle}>Suggested Combinations</h3>

                  {recommendations.length === 0 && !errorMessage ? (
                    <div className={styles.noResults}>
                      No products fit within your entered budget. Try increasing the amount or matching a different keyword.
                    </div>
                  ) : recommendations.length > 0 ? (
                    <>
                      <div className={styles.recList}>
                        {recommendations.map((product) => (
                          <div key={product.id} className={styles.recItemCard}>
                            <div className={styles.recItemInner}>
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
                          <span className={styles.summaryValue}>{budget} Tk</span>
                        </div>
                        <div className={styles.summaryRow}>
                          <span>Optimized Item Count</span>
                          <span className={styles.summaryValue}>{recommendations.length} items</span>
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
                  ) : null}
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
