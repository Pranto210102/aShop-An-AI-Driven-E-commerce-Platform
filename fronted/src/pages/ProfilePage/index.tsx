import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import styles from "./index.module.css";

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  bio: string;
  location: string;
  memberSince: string;
  tier: string;
}

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
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"orders" | "addresses" | "preferences">("orders");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  // Simulation loading delay (mocking backend fetch)
  useEffect(() => {
    const timer = setTimeout(() => {
      setUser({
        name: "Elian Vance",
        email: "elian.vance@studio.design",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
        bio: "Architect and collector of sculptural home contours. Curator of minimal functional furniture and bespoke lighting designs.",
        location: "Dhaka, Bangladesh",
        memberSince: "January 2025",
        tier: "Collector Elite",
      });

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
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

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
                  <img src={user.avatar} alt={user.name} className={styles.avatar} />
                </div>
                <div className={styles.profileMeta}>
                  <div className={styles.nameRow}>
                    <h1 className={styles.userName}>{user.name}</h1>
                    <span className={styles.tierBadge}>{user.tier}</span>
                  </div>
                  <p className={styles.userEmail}>{user.email}</p>
                  <p className={styles.userJoined}>Member since {user.memberSince}</p>
                </div>
              </section>

              {/* Main Profile Grid Dashboard */}
              <div className={styles.profileGrid}>
                {/* Left Card: Summary details */}
                <aside className={styles.sidebar}>
                  <div className={styles.sidebarCard}>
                    <h3 className={styles.sidebarCardTitle}>About Curator</h3>
                    <p className={styles.sidebarCardBio}>"{user.bio}"</p>
                    <div className={styles.sidebarMetaItem}>
                      <span className={styles.metaLabel}>Current Base</span>
                      <span className={styles.metaValue}>{user.location}</span>
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
                        <div className={styles.addressGrid}>
                          <div className={`${styles.addressCard} ${styles.defaultAddress}`}>
                            <div className={styles.addressCardHeader}>
                              <span className={styles.addressTag}>Default Shipping</span>
                            </div>
                            <h4 className={styles.addressName}>{user.name}</h4>
                            <p className={styles.addressLine}>House 45, Road 11, Banani</p>
                            <p className={styles.addressCity}>Dhaka 1213, Bangladesh</p>
                            <p className={styles.addressPhone}>Phone: +880 1712 345678</p>
                          </div>

                          <div className={styles.addressCard}>
                            <div className={styles.addressCardHeader}>
                              <span className={styles.addressTag}>Office Billing</span>
                            </div>
                            <h4 className={styles.addressName}>Vance Studios</h4>
                            <p className={styles.addressLine}>Flat 4B, Gulshan Tower, Gulshan 2</p>
                            <p className={styles.addressCity}>Dhaka 1212, Bangladesh</p>
                            <p className={styles.addressPhone}>Phone: +880 1819 876543</p>
                          </div>
                        </div>
                        <button type="button" className={styles.addAddressBtn}>
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

      <Footer />
    </div>
  );
};

export default ProfilePage;
