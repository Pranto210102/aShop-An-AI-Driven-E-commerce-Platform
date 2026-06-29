import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  seedProducts,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/", createProduct);
router.post("/seed", seedProducts);
router.get("/:id", getProductById);

export default router;
