import express from "express";
import {
  login,
  logout,
  signup,
  getCurrentUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  approveUser,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

router.get("/me", protectRoute, getCurrentUser);
router.put("/users/:userId/confirm", protectRoute, approveUser);

export default router;
