import React, { useState } from "react";
import styles from "./index.module.css";

const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Brand */}
        <div className={styles.brandCol}>
          <div className={`${styles.logoText} flex items-center gap-2`}>
            <svg className="w-5 h-5 text-[var(--text-h)] dark:text-[var(--accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            aShop<span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] inline-block ml-1" />
          </div>
          <p className={styles.brandDesc}>
            Curated furniture, apparel, and lifestyle artifacts designed with organic contours and tactile finishes.
          </p>
          <div className={styles.socials}>
            <a href="#instagram" className={styles.socialLink} aria-label="Instagram">
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth="2" />
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" strokeWidth="2" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </a>
            <a href="#pinterest" className={styles.socialLink} aria-label="Pinterest">
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeWidth="2"
                  d="M8 22a10 10 0 01-1-19.95M12 16c2 0 4-1.5 4-4.5S14 7 12 7c-2.5 0-4 2-4 5s1.5 4 4 4z"
                />
                <path strokeWidth="2" d="M12 7v9m-4.5-4h9" />
              </svg>
            </a>
            <a href="#twitter" className={styles.socialLink} aria-label="Twitter">
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeWidth="2"
                  d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* Links 1 */}
        <div className={styles.navCol}>
          <h4 className={styles.colTitle}>Collections</h4>
          <a href="#new" className={styles.link}>
            New Arrivals
          </a>
          <a href="#clothing" className={styles.link}>
            Apparel & Garments
          </a>
          <a href="#decor" className={styles.link}>
            Minimal Decor
          </a>
          <a href="#lighting" className={styles.link}>
            Lighting Objects
          </a>
        </div>

        {/* Links 2 */}
        <div className={styles.navCol}>
          <h4 className={styles.colTitle}>Studio</h4>
          <a href="#about" className={styles.link}>
            Our Philosophy
          </a>
          <a href="#materials" className={styles.link}>
            Sourcing & Materials
          </a>
          <a href="#care" className={styles.link}>
            Product Care Guides
          </a>
          <a href="#contact" className={styles.link}>
            Get in Touch
          </a>
        </div>

        {/* Newsletter */}
        <div className={styles.newsletterCol}>
          <h4 className={styles.colTitle}>Newsletter</h4>
          <p className={styles.brandDesc}>
            Join the inner circle. Receive custom editorial releases, product updates, and member privileges.
          </p>
          {subscribed ? (
            <div className="text-xs text-[var(--accent)] font-semibold p-2 bg-[var(--accent-bg)] border border-[var(--accent-border)] rounded-xl mt-2">
              ✓ You have subscribed successfully.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className={styles.newsletterForm}>
              <div className={styles.inputGroup}>
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.emailInput}
                />
              </div>
              <button type="submit" className={styles.submitBtn}>
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottomBar}>
        <div>&copy; {new Date().getFullYear()} aShop. All rights reserved.</div>
        <div className={styles.credits}>
          <span>Crafted with</span>
          <svg className={styles.heartIcon} viewBox="0 0 20 20">
            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
          </svg>
          <span>for premium quality spaces.</span>
        </div>
        <div className={styles.payments}>
          {/* Mock payment icons */}
          <span className="px-1.5 py-0.5 border border-[var(--border)] rounded text-[9px] font-bold">VISA</span>
          <span className="px-1.5 py-0.5 border border-[var(--border)] rounded text-[9px] font-bold">AMEX</span>
          <span className="px-1.5 py-0.5 border border-[var(--border)] rounded text-[9px] font-bold">APPLE PAY</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
