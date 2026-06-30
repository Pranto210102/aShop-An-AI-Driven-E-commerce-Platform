import express from "express";
import {
  registerUser,
  loginUser,
  googleLogin,
  getUserProfile,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);
router.get("/profile", protect, getUserProfile);
router.post("/addresses", protect, addUserAddress);
router.put("/addresses/:id", protect, updateUserAddress);
router.delete("/addresses/:id", protect, deleteUserAddress);

export default router;
