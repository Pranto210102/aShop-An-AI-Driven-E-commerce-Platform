import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import styles from "./index.module.css";

const API_URL = window.location.hostname === "localhost"
  ? "http://localhost:5000"
  : (import.meta.env.VITE_API_URL || "https://ashop-backend-4qwa.onrender.com");

interface SuggestionProduct {
  _id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  tags: string[];
  competitorPriceRange?: {
    low: number | null;
    high: number | null;
    source: string;
  };
  aiSuggestions?: {
    action: string;
    reason: string;
    suggestedPrice: number | null;
    priority: "high" | "medium" | "low" | "";
  };
}

interface NewProductSuggestion {
  name: string;
  category: string;
  estimatedPrice: number;
  reason: string;
}

interface MarketInsightData {
  trending?: any;
  marketAnalysis?: {
    summary: string;
    data: {
      productAnalysis: any[];
      newProductSuggestions: NewProductSuggestion[];
      marketSummary: string;
    };
  } | null;
  lastUpdated?: string | null;
}

const CATEGORY_IMAGES: Record<string, string> = {
  "Furniture": "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800",
  "Home Decor": "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&q=80&w=800",
  "Scents": "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800",
  "Apparel": "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=800"
};

const FALLBACK_NEW_PRODUCTS: NewProductSuggestion[] = [
  {
    name: "Traditional Hand-Painted Rickshaw Art Ceramic Vase",
    category: "Home Decor",
    estimatedPrice: 650,
    reason: "Rickshaw art is a recognized UNESCO Intangible Cultural Heritage. Highly popular for modern Bengali home decor."
  },
  {
    name: "Premium Rajshahi Silk Embroidered Cushion Cover",
    category: "Home Decor",
    estimatedPrice: 850,
    reason: "Leverages local heritage silk weavers. Premium positioning attracts high-end local & expat customers."
  },
  {
    name: "Aarong-Style Nakshi Kantha Cotton Bed Runner",
    category: "Home Decor",
    estimatedPrice: 1850,
    reason: "Traditional embroidery style is highly valued in urban apartments in Dhaka. Good profit margins."
  },
  {
    name: "Sajek Valley Mist Sandalwood Candle",
    category: "Scents",
    estimatedPrice: 380,
    reason: "Sandalwood with mountain dew notes, inspired by Sajek Valley tourism. Appeals to youth demographic."
  },
  {
    name: "Asymmetric Sylhet Rattan Lounge Chair",
    category: "Furniture",
    estimatedPrice: 4200,
    reason: "Sylhet rattan is lightweight and durable. Complements contemporary Japandi/Nordic design trends popular in Banani."
  }
];

const AdminPage: React.FC = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Furniture");
  const [shapeType, setShapeType] = useState("");
  const [badge, setBadge] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("20");

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Suggestions state
  const [activeTab, setActiveTab] = useState<"adjustments" | "market-gaps">("adjustments");
  const [suggestions, setSuggestions] = useState<SuggestionProduct[]>([]);
  const [insights, setInsights] = useState<MarketInsightData | null>(null);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const [isRunningAnalysis, setIsRunningAnalysis] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchSuggestionsAndInsights = async () => {
    setIsFetchingSuggestions(true);
    try {
      const sugRes = await fetch(`${API_URL}/api/ai/admin/suggestions`);
      const sugData = await sugRes.json();
      if (sugData.success) {
        setSuggestions(sugData.data || []);
      }

      const insRes = await fetch(`${API_URL}/api/ai/admin/insights`);
      const insData = await insRes.json();
      if (insData.success) {
        setInsights(insData.data || null);
      }
    } catch (err) {
      console.error("Error fetching AI suggestions or insights:", err);
    } finally {
      setIsFetchingSuggestions(false);
    }
  };

  useEffect(() => {
    fetchSuggestionsAndInsights();
  }, []);

  // Handle client-side file upload to ImgBB
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imgbbKey = import.meta.env.VITE_IMGBB_API_KEY;
    if (!imgbbKey || imgbbKey.includes("placeholder")) {
      setMessage({
        type: "error",
        text: "ImgBB API Key is not set or invalid. Please configure VITE_IMGBB_API_KEY in your fronted/.env file.",
      });
      return;
    }

    setIsUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setImageUrl(data.data.url);
        setMessage({ type: "success", text: "Image uploaded successfully to ImgBB!" });
      } else {
        setMessage({ type: "error", text: data.error?.message || "ImgBB upload failed." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Connection error during image upload." });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !category || !imageUrl) {
      setMessage({ type: "error", text: "Please fill in all required fields." });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    const productData = {
      name,
      price: Number(price),
      category,
      shapeType,
      badge,
      imageUrl,
      description,
      stock: Number(stock),
    };

    try {
      const res = await fetch(`${API_URL}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      const data = await res.json();
      if (data.success) {
        setMessage({
          type: "success",
          text: `Artisanal piece "${name}" has been uploaded to the MongoDB catalog!`,
        });
        // Clear form
        setName("");
        setPrice("");
        setShapeType("");
        setBadge("");
        setImageUrl("");
        setDescription("");
        setStock("20");
        // Re-fetch suggestions
        fetchSuggestionsAndInsights();
      } else {
        setMessage({ type: "error", text: data.message || "Failed to create product." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Server connection failed." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplySuggestion = async (product: SuggestionProduct) => {
    if (!product.aiSuggestions || !product.aiSuggestions.action) return;
    setActionLoadingId(product._id);
    setMessage(null);

    const action = product.aiSuggestions.action;
    const payload: Record<string, any> = {};

    if (action === "increase_price" || action === "decrease_price") {
      payload.price = product.aiSuggestions.suggestedPrice || product.price;
    } else if (action === "increase_stock") {
      payload.stock = (product.stock || 0) + 15;
    } else if (action === "decrease_stock") {
      payload.stock = Math.max(0, (product.stock || 0) - 5);
    }

    // Reset suggestion fields since they are applied
    payload.aiSuggestions = {
      action: "",
      reason: "",
      suggestedPrice: null,
      priority: "",
    };

    try {
      const res = await fetch(`${API_URL}/api/products/${product._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setMessage({
          type: "success",
          text: `Successfully applied AI recommendation for "${product.name}".`,
        });
        setSuggestions((prev) => prev.filter((p) => p._id !== product._id));
      } else {
        setMessage({ type: "error", text: data.message || "Failed to update product." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Connection error when applying suggestion." });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleQuickAdd = async (suggestion: NewProductSuggestion, index: number) => {
    setActionLoadingId(`new-${index}`);
    setMessage(null);

    const fallbackImg = CATEGORY_IMAGES[suggestion.category] || CATEGORY_IMAGES["Furniture"];
    const productData = {
      name: suggestion.name,
      price: suggestion.estimatedPrice,
      category: suggestion.category,
      imageUrl: fallbackImg,
      description: suggestion.reason,
      stock: 20,
    };

    try {
      const res = await fetch(`${API_URL}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      const data = await res.json();
      if (data.success) {
        setMessage({
          type: "success",
          text: `Product "${suggestion.name}" added to catalog successfully!`,
        });
        fetchSuggestionsAndInsights();
      } else {
        setMessage({ type: "error", text: data.message || "Failed to add product." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Connection error when quick-adding product." });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handlePrefillForm = (suggestion: NewProductSuggestion) => {
    setName(suggestion.name);
    setPrice(suggestion.estimatedPrice.toString());
    setCategory(suggestion.category);
    setDescription(suggestion.reason);
    setStock("20");
    setImageUrl(CATEGORY_IMAGES[suggestion.category] || CATEGORY_IMAGES["Furniture"]);

    setMessage({
      type: "success",
      text: "Form populated with suggestions. Review the details above and click 'Add Product Piece'!",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRunAnalysis = async () => {
    setIsRunningAnalysis(true);
    setMessage(null);
    try {
      const res = await fetch(`${API_URL}/api/ai/admin/run-analysis`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        setMessage({
          type: "success",
          text: "AI Market analysis completed successfully! Suggestions updated.",
        });
        fetchSuggestionsAndInsights();
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to trigger analysis.",
        });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Could not connect to analysis server." });
    } finally {
      setIsRunningAnalysis(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <Header />

      <main className={styles.container}>
        <div className={styles.adminCard}>
          <div className={styles.header}>
            <span className={styles.adminTag}>Secret Panel</span>
            <h1 className={styles.title}>Add Catalog Item</h1>
            <p className={styles.subtitle}>
              Upload a new sculptural product into the MongoDB Atlas database.
            </p>
          </div>

          {message && (
            <div
              className={`${styles.alert} ${
                message.type === "success" ? styles.alertSuccess : styles.alertError
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Split grid */}
            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label htmlFor="name" className={styles.label}>Product Name *</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sculptural Ceramic Base"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="price" className={styles.label}>Price (Tk) *</label>
                <input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="450"
                  className={styles.input}
                  required
                  min="0"
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label htmlFor="category" className={styles.label}>Category *</label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={styles.input}
                  required
                >
                  <option value="Furniture">Furniture</option>
                  <option value="Home Decor">Home Decor</option>
                  <option value="Scents">Scents</option>
                  <option value="Apparel">Apparel</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="shapeType" className={styles.label}>Contour Shape</label>
                <select
                  id="shapeType"
                  value={shapeType}
                  onChange={(e) => setShapeType(e.target.value)}
                  className={styles.input}
                >
                  <option value="">Standard (None)</option>
                  <option value="top-right-round">Top Right Round</option>
                  <option value="oval-right">Oval Right</option>
                  <option value="wavy">Wavy</option>
                  <option value="diagonal-round">Diagonal Round</option>
                </select>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label htmlFor="badge" className={styles.label}>Collection Badge</label>
                <input
                  type="text"
                  id="badge"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="new, featured, sale"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="stock" className={styles.label}>Stock Quantity *</label>
                <input
                  type="number"
                  id="stock"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="20"
                  className={styles.input}
                  min="0"
                  required
                />
              </div>
            </div>

            {/* Image Upload Block */}
            <div className={styles.uploadBlock}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Image Upload via ImgBB</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className={styles.fileInput}
                  disabled={isUploading}
                />
                <span className={styles.helperText}>
                  {isUploading ? "Uploading image to ImgBB..." : "Upload local image directly."}
                </span>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="imageUrl" className={styles.label}>Image URL *</label>
                <input
                  type="url"
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className={styles.input}
                  required
                />
                <span className={styles.helperText}>
                  Supports direct links or updates automatically when uploading files above.
                </span>
              </div>
            </div>

            {/* Description */}
            <div className={styles.inputGroup}>
              <label htmlFor="description" className={styles.label}>Concept / Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Hand-crafted in clay-throws with custom textured glazes..."
                className={styles.textarea}
                rows={4}
              />
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isSubmitting || isUploading}
            >
              {isSubmitting ? "Uploading Piece..." : "Add Product Piece"}
            </button>
          </form>
        </div>

        {/* AI Suggestions Dashboard */}
        <div className={styles.dashboardCard}>
          <div className={styles.header}>
            <span className={styles.adminTag}>AI Catalog Optimizer</span>
            <h2 className={styles.title}>AI Recommendations & Insights</h2>
            <p className={styles.subtitle}>
              Dynamic stock adjustments, price optimization, and catalog suggestions tailored for the Bangladeshi market.
            </p>
          </div>

          {/* Tab Selection */}
          <div className={styles.tabHeader}>
            <button
              onClick={() => setActiveTab("adjustments")}
              className={`${styles.tabBtn} ${activeTab === "adjustments" ? styles.tabBtnActive : ""}`}
            >
              Adjustments ({suggestions.length})
            </button>
            <button
              onClick={() => setActiveTab("market-gaps")}
              className={`${styles.tabBtn} ${activeTab === "market-gaps" ? styles.tabBtnActive : ""}`}
            >
              BD Market Standards & Opportunities
            </button>
          </div>

          {/* Insights Summary (Market analysis) */}
          {insights?.marketAnalysis?.summary && (
            <div className={styles.marketSummaryCard}>
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <span style={{ fontSize: "14px" }}>💡</span>
                <span className={styles.label} style={{ fontSize: "9px" }}>Market Intelligence Summary</span>
              </div>
              <p style={{ margin: 0 }}>{insights.marketAnalysis.summary}</p>
            </div>
          )}

          {isFetchingSuggestions ? (
            <div className={styles.emptyState}>
              <div className={styles.loadingSpinner} />
              <span>Scanning database and fetching AI suggestions...</span>
            </div>
          ) : activeTab === "adjustments" ? (
            /* Tab 1: Pricing & Stock Adjustments */
            <div className={styles.suggestionsGrid}>
              {suggestions.length === 0 ? (
                <div className={styles.emptyState}>
                  <span className={styles.emptyIcon}>🎉</span>
                  <span>All catalog pricing and stock levels are currently optimized!</span>
                  <span style={{ opacity: 0.6, fontSize: "10px" }}>
                    Run a manual AI analysis below to re-evaluate after changes.
                  </span>
                </div>
              ) : (
                suggestions.map((product) => {
                  const priority = product.aiSuggestions?.priority || "low";
                  const action = product.aiSuggestions?.action || "";
                  const suggestedPrice = product.aiSuggestions?.suggestedPrice;
                  const reason = product.aiSuggestions?.reason || "Price or stock review recommended.";
                  
                  // Friendly display name for actions
                  let actionText = "";
                  if (action === "increase_price") actionText = `Increase Price to ৳${suggestedPrice}`;
                  else if (action === "decrease_price") actionText = `Decrease Price to ৳${suggestedPrice}`;
                  else if (action === "increase_stock") actionText = "Increase Stock (+15 items)";
                  else if (action === "decrease_stock") actionText = "Decrease Stock (-5 items)";
                  else if (action === "add_variant") actionText = "Add Product Variant";
                  else if (action === "discontinue") actionText = "Discontinue Item";
                  else actionText = action.replace("_", " ");

                  return (
                    <div key={product._id} className={styles.suggestionCard}>
                      <div className={styles.suggestionInfo}>
                        <div className={styles.suggestionTitleRow}>
                          <span className={styles.productName}>{product.name}</span>
                          <span className={`${styles.badge} ${styles.badgeAction}`}>
                            {actionText}
                          </span>
                          <span
                            className={`${styles.badge} ${
                              priority === "high"
                                ? styles.badgeHigh
                                : priority === "medium"
                                ? styles.badgeMedium
                                : styles.badgeLow
                            }`}
                          >
                            {priority} Priority
                          </span>
                        </div>

                        <div className={styles.suggestionMeta}>
                          <span>Category: <strong>{product.category}</strong></span>
                          <span>Current Price: <strong>৳{product.price}</strong></span>
                          <span>Current Stock: <strong>{product.stock} units</strong></span>
                        </div>

                        <p className={styles.suggestionReason}>{reason}</p>
                      </div>

                      <div className={styles.suggestionActions}>
                        {product.competitorPriceRange && (product.competitorPriceRange.low || product.competitorPriceRange.high) && (
                          <div className={styles.competitorBox}>
                            <span style={{ opacity: 0.6 }}>Competitor Range</span>
                            <strong>
                              ৳{product.competitorPriceRange.low || "?"} - ৳{product.competitorPriceRange.high || "?"}
                            </strong>
                            <span style={{ fontSize: "8px", opacity: 0.5 }}>via Daraz/Evaly</span>
                          </div>
                        )}

                        <button
                          onClick={() => handleApplySuggestion(product)}
                          disabled={actionLoadingId !== null}
                          className={styles.primaryActionBtn}
                        >
                          {actionLoadingId === product._id ? "Applying..." : "Apply"}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            /* Tab 2: Bangladeshi Market Suggestions (Market Opportunities) */
            <div className={styles.suggestionsGrid}>
              {(() => {
                const items = insights?.marketAnalysis?.data?.newProductSuggestions || FALLBACK_NEW_PRODUCTS;
                return items.map((item, idx) => (
                  <div key={idx} className={styles.suggestionCard}>
                    <div className={styles.suggestionInfo}>
                      <div className={styles.suggestionTitleRow}>
                        <span className={styles.productName}>{item.name}</span>
                        <span className={`${styles.badge} ${styles.badgeAction}`}>
                          Estimated: ৳{item.estimatedPrice}
                        </span>
                      </div>
                      <div className={styles.suggestionMeta}>
                        <span>Target Category: <strong>{item.category}</strong></span>
                      </div>
                      <p className={styles.suggestionReason}>{item.reason}</p>
                    </div>

                    <div className={styles.suggestionActions}>
                      <button
                        onClick={() => handlePrefillForm(item)}
                        className={styles.actionBtn}
                      >
                        Pre-fill Form
                      </button>
                      <button
                        onClick={() => handleQuickAdd(item, idx)}
                        disabled={actionLoadingId !== null}
                        className={styles.primaryActionBtn}
                      >
                        {actionLoadingId === `new-${idx}` ? "Creating..." : "Quick Add"}
                      </button>
                    </div>
                  </div>
                ));
              })()}
            </div>
          )}

          {/* Refresh / Run Analysis Section */}
          <div className={styles.refreshRow}>
            <span className={styles.refreshText}>
              Last AI catalog analysis update:{" "}
              <strong>
                {insights?.lastUpdated ? new Date(insights.lastUpdated).toLocaleString() : "Never"}
              </strong>
            </span>

            <button
              onClick={handleRunAnalysis}
              disabled={isRunningAnalysis}
              className={styles.refreshBtn}
            >
              {isRunningAnalysis ? (
                <>
                  <div className={styles.loadingSpinner} />
                  <span>Running AI Scan...</span>
                </>
              ) : (
                <>
                  <span>✨ Run AI Market Analysis</span>
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminPage;
