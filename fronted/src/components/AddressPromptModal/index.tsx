import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./index.module.css";

const AddressPromptModal: React.FC = () => {
  const { user, addAddress } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    tag: "Default Shipping",
    name: "",
    addressLine: "",
    city: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Show only if user is logged in, has NO address, and has not dismissed in current session
    if (
      user &&
      (!user.addresses || user.addresses.length === 0) &&
      !sessionStorage.getItem("address_prompt_dismissed")
    ) {
      setIsOpen(true);
      // Autofill name with user name if empty
      setFormData((prev) => ({ ...prev, name: prev.name || user.name }));
    } else {
      setIsOpen(false);
    }
  }, [user]);

  if (!isOpen) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDismiss = () => {
    sessionStorage.setItem("address_prompt_dismissed", "true");
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, addressLine, city, phone } = formData;
    if (!name.trim() || !addressLine.trim() || !city.trim() || !phone.trim()) {
      setError("Please fill out all address fields.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await addAddress(formData);
      if (res.success) {
        setIsOpen(false);
      } else {
        setError(res.message || "Failed to save address.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.title}>Complete Your Profile</h2>
          <p className={styles.subtitle}>
            Please provide your shipping address to ease your checkout process.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.errorText}>{error}</div>}

          <div className={styles.inputGroup}>
            <label className={styles.label}>Address Label</label>
            <select
              name="tag"
              value={formData.tag}
              onChange={handleInputChange}
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
              name="name"
              placeholder="e.g. Vance Studios"
              value={formData.name}
              onChange={handleInputChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Address Line</label>
            <input
              type="text"
              name="addressLine"
              placeholder="e.g. House 45, Road 11, Banani"
              value={formData.addressLine}
              onChange={handleInputChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>City, Country</label>
            <input
              type="text"
              name="city"
              placeholder="e.g. Dhaka 1213, Bangladesh"
              value={formData.city}
              onChange={handleInputChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Phone Number</label>
            <input
              type="text"
              name="phone"
              placeholder="e.g. +880 1712 345678"
              value={formData.phone}
              onChange={handleInputChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={handleDismiss}
              className={styles.skipBtn}
              disabled={isSubmitting}
            >
              Skip
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressPromptModal;
