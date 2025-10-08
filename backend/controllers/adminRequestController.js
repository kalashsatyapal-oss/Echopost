import AdminRequest from "../models/AdminRequest.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Create admin request
export const createAdminRequest = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newRequest = await AdminRequest.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: "Admin request created", request: newRequest });
  } catch (err) {
    console.error("Admin request error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all requests (superadmin only)
export const getAdminRequests = async (req, res) => {
  if (!req.user || req.user.role !== "superadmin")
    return res.status(403).json({ message: "Not authorized" });

  const requests = await AdminRequest.find().sort({ createdAt: -1 });
  res.json(requests);
};

// Accept/reject request
export const updateAdminRequest = async (req, res) => {
  if (!req.user || req.user.role !== "superadmin")
    return res.status(403).json({ message: "Not authorized" });

  const { status } = req.body;
  const request = await AdminRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });

  request.status = status;
  await request.save();

  if (status === "accepted") {
    await User.create({
      name: request.name,
      email: request.email,
      password: request.password,
      role: "admin",
    });
  }

  res.json(request);
};
