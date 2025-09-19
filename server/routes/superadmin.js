import express from "express";
import AdminRequest from "../models/AdminRequest.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware: only superadmin can access
const verifySuperadmin = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "superadmin") return res.status(403).json({ error: "Not authorized" });

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Get all requests
router.get("/requests", verifySuperadmin, async (req, res) => {
  const requests = await AdminRequest.find();
  res.json(requests);
});

// Approve request → create admin user
router.post("/approve/:id", verifySuperadmin, async (req, res) => {
  try {
    const request = await AdminRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ error: "Request not found" });

    // Create admin user
    const admin = await User.create({
      name: request.name,
      email: request.email,
      password: request.password, // already hashed
      role: "admin"
    });

    request.status = "accepted";
    await request.save();

    res.json({ message: "Request approved, admin created", admin });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reject request
router.post("/reject/:id", verifySuperadmin, async (req, res) => {
  try {
    const request = await AdminRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ error: "Request not found" });

    request.status = "rejected";
    await request.save();

    res.json({ message: "Request rejected", request });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
