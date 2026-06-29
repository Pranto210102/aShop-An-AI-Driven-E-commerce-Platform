import express from "express";
import {
  registerUser,
  loginUser,
  googleLogin,
  getUserProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);
router.get("/profile", protect, getUserProfile);

export default router;
