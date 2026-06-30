import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";
import styles from "./index.module.css";


interface OrderItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

interface Order {
  id: string;
  date: string;
  status: "Delivered" | "In Transit" | "Processing";
  total: number;
  items: OrderItem[];
}

const ProfilePage: React.FC = () => {
  const { user, logout, addAddress, updateAddress, deleteAddress, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"orders" | "addresses" | "preferences" | "logout">("orders");
  const [orders, setOrders] = useState<Order[]>([]);

  // Address edit/add state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [addressForm, setAddressForm] = useState({
    tag: "Default Shipping",
    name: "",
    addressLine: "",
    city: "",
    phone: "",
  });
  const [addressError, setAddressError] = useState("");
  const [isAddressSubmitting, setIsAddressSubmitting] = useState(false);

  const handleOpenAddAddress = () => {
    setEditingAddress(null);
    setAddressForm({
      tag: "Default Shipping",
      name: user?.name || "",
      addressLine: "",
      city: "",
      phone: "",
    });
    setAddressError("");
    setShowAddressForm(true);
  };

  const handleOpenEditAddress = (addr: any) => {
    setEditingAddress(addr);
    setAddressForm({
      tag: addr.tag,
      name: addr.name,
      addressLine: addr.addressLine,
      city: addr.city,
      phone: addr.phone,
    });
    setAddressError("");
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      await deleteAddress(id);
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, addressLine, city, phone } = addressForm;
    if (!name.trim() || !addressLine.trim() || !city.trim() || !phone.trim()) {
      setAddressError("Please fill out all fields.");
      return;
    }

    setIsAddressSubmitting(true);
    setAddressError("");

    try {
      let res;
      if (editingAddress) {
        res = await updateAddress(editingAddress._id, addressForm);
      } else {
        res = await addAddress(addressForm);
      }

      if (res.success) {
        setShowAddressForm(false);
      } else {
        setAddressError(res.message || "Failed to save address.");
      }
    } catch (err) {
      setAddressError("An error occurred while saving the address.");
    } finally {
      setIsAddressSubmitting(false);
    }
  };

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login?redirect=/profile");
    }
  }, [user, authLoading, navigate]);

  // Set mock orders on load
  useEffect(() => {
    if (user) {
      setOrders([
        {
          id: "ASP-78901",
          date: "March 14, 2026",
          status: "Delivered",
          total: 938,
          items: [
            {
              id: "t1",
              name: "Minimalist Bouclé Lounge Chair",
              price: 890,
              imageUrl: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800",
            },
            {
              id: "t5",
              name: "Terrazzo Scented Soy Candle",
              price: 48,
              imageUrl: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800",
            },
          ],
        },
        {
          id: "ASP-54320",
          date: "Jan 22, 2026",
          status: "Delivered",
          total: 195,
          items: [
            {
              id: "g4",
              name: "Wavy Organic Mirror",
              price: 195,
              imageUrl: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=800",
            },
          ],
        },
      ]);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isLoading = authLoading || !user;

  return (
    <div className={styles.pageWrapper}>
      <Header />

      <main className={styles.container}>
        {isLoading ? (
          /* Profile Loading Skeleton State */
          <div className={styles.skeletonContainer}>
            <div className={styles.skeletonHeader}>
              <div className={styles.skeletonAvatar} />
              <div className={styles.skeletonTextCol}>
                <div className={styles.skeletonTitle} />
                <div className={styles.skeletonSubtitle} />
              </div>
            </div>
            <div className={styles.skeletonBody}>
              <div className={styles.skeletonLeftCard} />
              <div className={styles.skeletonRightTabs} />
            </div>
          </div>
        ) : (
          user && (
            <div className={styles.profileLayout}>
              {/* Profile Header Dashboard */}
              <section className={styles.profileHeader}>
                 <div className={styles.avatarWrapper}>
                   <img
                     src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"}
                     alt={user.name}
                     className={styles.avatar}
                     referrerPolicy="no-referrer"
                   />
                 </div>
                <div className={styles.profileMeta}>
                  <div className={styles.nameRow}>
                    <h1 className={styles.userName}>{user.name}</h1>
                    <span className={styles.tierBadge}>Collector Elite</span>
                  </div>
                  <p className={styles.userEmail}>{user.email}</p>
                  <p className={styles.userJoined}>Member since January 2025</p>
                </div>
              </section>

              {/* Main Profile Grid Dashboard */}
              <div className={styles.profileGrid}>
                {/* Left Card: Summary details */}
                <aside className={styles.sidebar}>
                  <div className={styles.sidebarCard}>
                    <h3 className={styles.sidebarCardTitle}>About Curator</h3>
                    <p className={styles.sidebarCardBio}>
                      "Architect and collector of sculptural home contours. Curator of minimal functional furniture and bespoke lighting designs."
                    </p>
                    <div className={styles.sidebarMetaItem}>
                      <span className={styles.metaLabel}>Current Base</span>
                      <span className={styles.metaValue}>Dhaka, Bangladesh</span>
                    </div>
                    <div className={styles.sidebarMetaItem}>
                      <span className={styles.metaLabel}>Preferences</span>
                      <span className={styles.metaValue}>Organic Contours, Scents</span>
                    </div>
                  </div>
                </aside>

                {/* Right section: Tabs Dashboard */}
                <div className={styles.tabContentArea}>
                  {/* Tabs Selector Navigation */}
                  <div className={styles.tabNav}>
                    <button
                      type="button"
                      onClick={() => setActiveTab("orders")}
                      className={`${styles.tabBtn} ${activeTab === "orders" ? styles.tabBtnActive : ""}`}
                    >
                      Order History
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("addresses")}
                      className={`${styles.tabBtn} ${activeTab === "addresses" ? styles.tabBtnActive : ""}`}
                    >
                      Shipping Addresses
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("preferences")}
                      className={`${styles.tabBtn} ${activeTab === "preferences" ? styles.tabBtnActive : ""}`}
                    >
                      Settings & Prefs
                    </button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className={styles.tabBtn}
                    >
                      Sign Out
                    </button>
                  </div>

                  {/* Tab Body Contents */}
                  <div className={styles.tabBody}>
                    {/* Orders History Tab */}
                    {activeTab === "orders" && (
                      <div className={styles.ordersTab}>
                        {orders.length === 0 ? (
                          <p className={styles.emptyText}>No purchases documented in your account yet.</p>
                        ) : (
                          <div className={styles.ordersList}>
                            {orders.map((order) => (
                              <div key={order.id} className={styles.orderCard}>
                                <div className={styles.orderHeader}>
                                  <div className={styles.orderMetaCol}>
                                    <span className={styles.orderIdLabel}>Order</span>
                                    <span className={styles.orderIdValue}>{order.id}</span>
                                  </div>
                                  <div className={styles.orderMetaCol}>
                                    <span className={styles.orderDateLabel}>Placed On</span>
                                    <span className={styles.orderDateValue}>{order.date}</span>
                                  </div>
                                  <div className={styles.orderMetaCol}>
                                    <span className={styles.orderStatusLabel}>Status</span>
                                    <span className={`${styles.statusLabel} ${styles[order.status.toLowerCase().replace(" ", "")]}`}>
                                      {order.status}
                                    </span>
                                  </div>
                                  <div className={styles.orderMetaTotalCol}>
                                    <span>Total: <strong>{order.total} Tk</strong></span>
                                  </div>
                                </div>

                                <div className={styles.orderItems}>
                                  {order.items.map((item) => (
                                    <div key={item.id} className={styles.orderItem}>
                                      <div className={styles.itemThumb}>
                                        <img src={item.imageUrl} alt={item.name} />
                                      </div>
                                      <div className={styles.itemMeta}>
                                        <h4 className={styles.itemName}>{item.name}</h4>
                                        <span className={styles.itemPrice}>{item.price} Tk</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Shipping Addresses Tab */}
                    {activeTab === "addresses" && (
                      <div className={styles.addressesTab}>
                        {(!user.addresses || user.addresses.length === 0) ? (
                          <div className={styles.noAddressText}>
                            No shipping addresses saved yet.
                          </div>
                        ) : (
                          <div className={styles.addressGrid}>
                            {user.addresses.map((addr: any, idx: number) => (
                              <div key={addr._id || idx} className={`${styles.addressCard} ${idx === 0 ? styles.defaultAddress : ""}`}>
                                <div className={styles.addressCardHeader}>
                                  <span className={styles.addressTag}>{addr.tag}</span>
                                  <div className={styles.addressActions}>
                                    <button
                                      type="button"
                                      onClick={() => handleOpenEditAddress(addr)}
                                      className={styles.editBtn}
                                      title="Edit Address"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                      </svg>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteAddress(addr._id!)}
                                      className={styles.deleteBtn}
                                      title="Delete Address"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                                <h4 className={styles.addressName}>{addr.name}</h4>
                                <p className={styles.addressLine}>{addr.addressLine}</p>
                                <p className={styles.addressCity}>{addr.city}</p>
                                <p className={styles.addressPhone}>Phone: {addr.phone}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        <button type="button" onClick={handleOpenAddAddress} className={styles.addAddressBtn}>
                          + Add New Address
                        </button>
                      </div>
                    )}

                    {/* Settings & Preferences Tab */}
                    {activeTab === "preferences" && (
                      <div className={styles.preferencesTab}>
                        <h4 className={styles.prefSectionTitle}>Curation Aesthetics</h4>
                        <div className={styles.prefOptionGroup}>
                          <label className={styles.checkboxLabel}>
                            <input type="checkbox" defaultChecked className={styles.checkboxInput} />
                            <span className={styles.checkboxText}>Prioritize minimalist silhouettes in recommender</span>
                          </label>
                          <label className={styles.checkboxLabel}>
                            <input type="checkbox" defaultChecked className={styles.checkboxInput} />
                            <span className={styles.checkboxText}>Auto-toggle dark mode based on systemic schedules</span>
                          </label>
                        </div>

                        <h4 className={styles.prefSectionTitle}>Notification Settings</h4>
                        <div className={styles.prefOptionGroup}>
                          <label className={styles.checkboxLabel}>
                            <input type="checkbox" defaultChecked className={styles.checkboxInput} />
                            <span className={styles.checkboxText}>Email updates for newly crafted limited runs</span>
                          </label>
                          <label className={styles.checkboxLabel}>
                            <input type="checkbox" className={styles.checkboxInput} />
                            <span className={styles.checkboxText}>SMS notification for delivery details</span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </main>

      {/* Address Edit/Add Modal */}
      {showAddressForm && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {editingAddress ? "Edit Shipping Address" : "Add New Shipping Address"}
              </h2>
            </div>

            <form onSubmit={handleAddressSubmit} className={styles.form}>
              {addressError && <div className={styles.errorText}>{addressError}</div>}

              <div className={styles.inputGroup}>
                <label className={styles.label}>Address Label</label>
                <select
                  name="tag"
                  value={addressForm.tag}
                  onChange={(e) => setAddressForm({ ...addressForm, tag: e.target.value })}
                  className={styles.input}
                >
                  <option value="Default Shipping">Default Shipping</option>
                  <option value="Home Shipping">Home Shipping</option>
                  <option value="Office Billing">Office Billing</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Recipient Name</label>
                <input
                  type="text"
                  placeholder="e.g. Vance Studios"
                  value={addressForm.name}
                  onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Address Line</label>
                <input
                  type="text"
                  placeholder="e.g. House 45, Road 11, Banani"
                  value={addressForm.addressLine}
                  onChange={(e) => setAddressForm({ ...addressForm, addressLine: e.target.value })}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>City, Country</label>
                <input
                  type="text"
                  placeholder="e.g. Dhaka 1213, Bangladesh"
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Phone Number</label>
                <input
                  type="text"
                  placeholder="e.g. +880 1712 345678"
                  value={addressForm.phone}
                  onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.actions}>
                <button
                  type="button"
                  onClick={() => setShowAddressForm(false)}
                  className={styles.skipBtn}
                  disabled={isAddressSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={isAddressSubmitting}
                >
                  {isAddressSubmitting ? "Saving..." : "Save Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProfilePage;
