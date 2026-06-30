import React, { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import styles from "./index.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AdminPage: React.FC = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Furniture");
  const [shapeType, setShapeType] = useState("");
  const [badge, setBadge] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

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
      } else {
        setMessage({ type: "error", text: data.message || "Failed to create product." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Server connection failed." });
    } finally {
      setIsSubmitting(false);
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
      </main>

      <Footer />
    </div>
  );
};

export default AdminPage;
