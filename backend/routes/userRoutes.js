import express from "express";
import { getProfile, updateProfile, changePassword } from "../controllers/userController.js";
import { protect } from "../Middleware/authMiddleware.js";
import upload from "../Middleware/upload.js";

const router = express.Router();

// Get user profile + authored blogs
router.get("/me", protect, getProfile);

// Update profile (name + profile image)
router.put("/update", protect, upload.single("profileImage"), updateProfile);

// Change password
router.put("/change-password", protect, changePassword);

export default router;
