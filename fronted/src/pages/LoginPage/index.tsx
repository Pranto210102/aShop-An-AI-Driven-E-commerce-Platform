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
  const { login, register, loginWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
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
      // Clean up script
      try {
        document.body.removeChild(script);
      } catch (e) {
        // Safe catch
      }
    };
  }, [isRegisterMode]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (isRegisterMode && !name)) {
      setErrorMessage("All fields are required.");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      if (isRegisterMode) {
        const res = await register(name, email, password);
        if (res.success) {
          navigate(from);
        } else {
          setErrorMessage(res.message || "Registration failed.");
        }
      } else {
        const res = await login(email, password);
        if (res.success) {
          navigate(from);
        } else {
          setErrorMessage(res.message || "Invalid credentials.");
        }
      }
    } catch (err) {
      setErrorMessage("Network connection failed.");
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

          {/* Right panel: Form control card */}
          <div className={styles.formPanel}>
            <div className={styles.formCard}>
              <h1 className={styles.formTitle}>
                {isRegisterMode ? "Create Account" : "Welcome Back"}
              </h1>
              <p className={styles.formSubtitle}>
                {isRegisterMode
                  ? "Sign up with your details to begin curating."
                  : "Sign in with your email or Google account."}
              </p>

              {errorMessage && <div className={styles.errorAlert}>{errorMessage}</div>}

              <form onSubmit={handleSubmit} className={styles.form}>
                {isRegisterMode && (
                  <div className={styles.inputGroup}>
                    <label htmlFor="name" className={styles.label}>Name</label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Elian Vance"
                      className={styles.input}
                      required
                    />
                  </div>
                )}

                <div className={styles.inputGroup}>
                  <label htmlFor="email" className={styles.label}>Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="elian.vance@studio.design"
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="password" className={styles.label}>Password</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={styles.input}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Authenticating..."
                    : isRegisterMode
                    ? "Create Account"
                    : "Log In"}
                </button>
              </form>

              {/* Divider lines */}
              <div className={styles.divider}>
                <span className={styles.dividerLine} />
                <span className={styles.dividerText}>or</span>
                <span className={styles.dividerLine} />
              </div>

              {/* Google OAuth Button Frame */}
              <div className={styles.googleContainer}>
                <div id="google-login-btn" className={styles.googleBtn} />
              </div>

              {/* Toggles */}
              <div className={styles.toggleFooter}>
                {isRegisterMode ? (
                  <p>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setIsRegisterMode(false);
                        setErrorMessage("");
                      }}
                      className={styles.toggleBtn}
                    >
                      Log In
                    </button>
                  </p>
                ) : (
                  <p>
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setIsRegisterMode(true);
                        setErrorMessage("");
                      }}
                      className={styles.toggleBtn}
                    >
                      Sign Up
                    </button>
                  </p>
                )}
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
