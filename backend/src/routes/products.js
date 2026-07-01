import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  seedProducts,
  updateProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/", createProduct);
router.post("/seed", seedProducts);
router.get("/:id", getProductById);
router.patch("/:id", updateProduct);

export default router;
