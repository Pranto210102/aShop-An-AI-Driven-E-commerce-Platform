import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";
import styles from "./index.module.css";

// Declare global Google Identity types
declare global {
  interface Window {
    google: any;
  }
}

const LoginPage: React.FC = () => {
  const { loginWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Parse redirect path from query param
  const from = new URLSearchParams(location.search).get("redirect") || "/profile";

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(from);
    }
  }, [user, navigate, from]);

  // Load Google Identity Services script dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    const initializeGoogle = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "placeholder_for_google_client_id.apps.googleusercontent.com",
          callback: handleGoogleCallback,
        });

        const btnElement = document.getElementById("google-login-btn");
        if (btnElement) {
          window.google.accounts.id.renderButton(btnElement, {
            theme: "outline",
            size: "large",
            width: "320px",
          });
        }
      }
    };

    script.onload = initializeGoogle;

    return () => {
      try {
        document.body.removeChild(script);
      } catch (e) {
        // Safe catch
      }
    };
  }, []);

  const handleGoogleCallback = async (response: any) => {
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      const res = await loginWithGoogle(response.credential);
      if (res.success) {
        navigate(from);
      } else {
        setErrorMessage(res.message || "Google Authentication failed.");
      }
    } catch (e) {
      setErrorMessage("Google connection failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <Header />

      <main className={styles.container}>
        <div className={styles.loginLayout}>
          {/* Left panel: Brand Identity */}
          <div className={styles.brandPanel}>
            <span className={styles.brandTag}>Artisanal Platform</span>
            <h2 className={styles.brandTitle}>Sculptural Objects for Curated Spaces</h2>
            <p className={styles.brandDesc}>
              Join aShop to manage your bespoke wishlists, save artisanal details, and secure checkout runs.
            </p>
          </div>

          {/* Right panel: Google Login action card */}
          <div className={styles.formPanel}>
            <div className={styles.formCard}>
              <h1 className={styles.formTitle}>Sign In</h1>
              <p className={styles.formSubtitle}>
                Log in to access your wishlist, saved cart, and profile context. Google OAuth is currently the exclusive sign-in method.
              </p>

              {errorMessage && <div className={styles.errorAlert}>{errorMessage}</div>}

              {isSubmitting && (
                <div className={styles.loaderContainer}>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--text-h)] mx-auto" />
                  <p className={styles.loaderText}>Verifying session credentials...</p>
                </div>
              )}

              {/* Google OAuth Button Frame */}
              <div className={styles.googleContainer}>
                <div id="google-login-btn" className={styles.googleBtn} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
