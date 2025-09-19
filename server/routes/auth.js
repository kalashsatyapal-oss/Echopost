import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import AdminRequest from "../models/AdminRequest.js";
const router = express.Router();
import { verifyToken } from "../middleware/verifyToken.js";

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    const existingReq = await AdminRequest.findOne({ email });
    if (existingUser || existingReq) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    // If role=admin → create request instead
    if (role === "admin") {
      const request = await AdminRequest.create({ name, email, password: hashed });
      return res.json({ message: "Admin request submitted, awaiting superadmin approval", request });
    }

    // Otherwise → normal user
    const user = await User.create({ name, email, password: hashed, role: "user" });
    res.json({ message: "User registered", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, user: { id: user._id, name: user.name, role: user.role, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE PROFILE — requires Authorization: Bearer <token>
router.post("/update", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, profileImage } = req.body; // profileImage should be a base64 data URI or null

    // Basic validation
    if (!name && typeof profileImage === "undefined") {
      return res.status(400).json({ error: "Nothing to update" });
    }

    const updatePayload = {};
    if (name) updatePayload.name = name;
    // allow clearing profileImage by sending null
    if (typeof profileImage !== "undefined") updatePayload.profileImage = profileImage;

    const updated = await User.findByIdAndUpdate(userId, updatePayload, { new: true, select: "-password" });
    if (!updated) return res.status(404).json({ error: "User not found" });

    return res.json({ message: "Profile updated", user: updated });
  } catch (err) {
    console.error("Error /api/auth/update:", err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
