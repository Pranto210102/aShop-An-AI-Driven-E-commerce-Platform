import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import styles from "./index.module.css";
import { useCart } from "../../context/CartContext";

const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, showToast } = useCart();
  const navigate = useNavigate();

  // Promo code states
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState(0);

  // Checkout modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Calculations
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  // Shipping logic: free over 5000 Tk, otherwise 200 Tk flat rate
  const shippingCost = useMemo(() => {
    if (subtotal === 0 || subtotal >= 5000) return 0;
    return 200;
  }, [subtotal]);

  // Tax/VAT: 5% of subtotal
  const tax = useMemo(() => {
    return Math.round(subtotal * 0.05);
  }, [subtotal]);

  // Promo discounts
  const discountAmount = useMemo(() => {
    return Math.round(subtotal * discountPercent);
  }, [subtotal, discountPercent]);

  // Grand total
  const grandTotal = useMemo(() => {
    return Math.max(0, subtotal - discountAmount + shippingCost + tax);
  }, [subtotal, discountAmount, shippingCost, tax]);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    
    if (code === "ASHOP10") {
      setAppliedPromo(code);
      setDiscountPercent(0.1); // 10% discount
      setPromoInput("");
      showToast("Promo Code ASHOP10 applied! 10% discount applied.");
    } else if (code === "WELCOME50") {
      setAppliedPromo(code);
      setDiscountPercent(0.15); // 15% discount
      setPromoInput("");
      showToast("Promo Code WELCOME50 applied! 15% discount applied.");
    } else {
      showToast("Invalid Promo Code");
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setShowSuccessModal(true);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    clearCart();
    navigate("/products");
  };



  return (
    <div className={styles.pageWrapper}>
      <Header
        onSearch={(q) => navigate(`/products?search=${encodeURIComponent(q)}`)}
        onSelectCategory={(c) => navigate(c ? `/products?category=${encodeURIComponent(c)}` : "/products")}
      />

      <main className={styles.container}>
        <h1 className={styles.title}>Your Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className={styles.emptyCard}>
            <svg className="w-16 h-16 mx-auto text-[var(--text)] opacity-40 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className={styles.emptyTitle}>Your cart is empty</h2>
            <p className={styles.emptyText}>
              Looks like you haven't added anything to your cart yet. Explore our curated collections to get started.
            </p>
            <Link to="/products" className={styles.shopBtn}>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className={styles.layout}>
            {/* Cart Items Column */}
            <div className={styles.cartListCol}>
              {cart.map((item) => (
                <div key={item.product.id} className={styles.cartItemCard}>
                  <div className={styles.itemInfo}>
                    <div className={styles.thumbWrapper}>
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className={styles.thumb}
                      />
                    </div>
                    <div className={styles.details}>
                      <span className={styles.itemCat}>{item.product.category}</span>
                      <h3 className={styles.itemName}>{item.product.name}</h3>
                      <span className={styles.itemPrice}>{item.product.price} Tk</span>
                    </div>
                  </div>

                  {/* Quantity adjustments */}
                  <div className={styles.controlsGroup}>
                    <div className={styles.qtyWrapper}>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className={styles.qtyBtn}
                        aria-label="Decrease quantity"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 12H4" />
                        </svg>
                      </button>
                      <span className={styles.qtyValue}>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className={styles.qtyBtn}
                        aria-label="Increase quantity"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id)}
                      className={styles.deleteBtn}
                      aria-label="Delete item"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}

              <Link to="/products" className={styles.continueLink}>
                ← Continue Shopping
              </Link>
            </div>

            {/* Summary Column */}
            <div className={styles.summaryCol}>
              <div className={styles.cardPanel}>
                <h2 className={styles.panelTitle}>Order Summary</h2>
                
                <div className={styles.pricingRow}>
                  <span>Subtotal</span>
                  <span className="font-semibold">{subtotal} Tk</span>
                </div>
                
                {discountAmount > 0 && (
                  <div className={styles.pricingRow}>
                    <span>Promo Discount ({discountPercent * 100}%)</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">-{discountAmount} Tk</span>
                  </div>
                )}

                <div className={styles.pricingRow}>
                  <span>Shipping Cost</span>
                  <span className="font-semibold">
                    {shippingCost === 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400">FREE</span>
                    ) : (
                      `${shippingCost} Tk`
                    )}
                  </span>
                </div>

                <div className={styles.pricingRow}>
                  <span>VAT / Tax (5%)</span>
                  <span className="font-semibold">{tax} Tk</span>
                </div>

                {shippingCost > 0 && (
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1">
                    * Shop for 5,000 Tk or more to get FREE shipping! (Add {5000 - subtotal} Tk more)
                  </p>
                )}

                <div className={styles.pricingTotalRow}>
                  <span>Total Amount</span>
                  <span>{grandTotal} Tk</span>
                </div>

                {/* Promo Input */}
                <form onSubmit={handleApplyPromo} className={styles.promoForm}>
                  <input
                    type="text"
                    placeholder="PROMO CODE (e.g. ASHOP10)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className={styles.promoInput}
                  />
                  <button type="submit" className={styles.promoBtn}>
                    Apply
                  </button>
                </form>

                {appliedPromo && (
                  <p className={styles.promoAppliedMsg}>
                    Code <strong>{appliedPromo}</strong> is active!
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleCheckout}
                  className={styles.checkoutBtn}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Success Modal Overlay */}
      {showSuccessModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.modalCheck}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className={styles.modalTitle}>Order Confirmed!</h2>
            <p className={styles.modalText}>
              Thank you for shopping at <strong>aShop</strong>. Your order has been placed successfully and is being prepared for shipping.
            </p>
            <button
              type="button"
              onClick={handleCloseSuccessModal}
              className={styles.modalBtn}
            >
              Continue to Catalog
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
