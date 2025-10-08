import User from "../models/User.js";

// Get all users
export const getAllUsers = async (req, res) => {
  if (req.user.role !== "superadmin") {
    return res.status(403).json({ message: "Not authorized" });
  }

  try {
    const users = await User.find()
      .select("name email role createdAt") // exclude password
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update user role (user <-> admin only)
export const updateUserRole = async (req, res) => {
  if (req.user.role !== "superadmin") {
    return res.status(403).json({ message: "Not authorized" });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "superadmin") {
      return res.status(400).json({ message: "Cannot change superadmin role" });
    }

    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    user.role = role;
    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
