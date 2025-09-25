import User from "../models/User.js";
import Blog from "../models/Blog.js";
import bcrypt from "bcryptjs";

// Get User Profile + Authored Blogs
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    const blogs = await Blog.find({ author: req.user._id }).sort({ createdAt: -1 });
    res.json({ user, blogs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (req.body.name) user.name = req.body.name;

    if (req.file) {
      // Convert uploaded file to base64 and save MIME type
      user.profileImage = req.file.buffer.toString("base64");
      user.profileImageType = req.file.mimetype;
    }

    await user.save();

    const { password, ...userData } = user.toObject();
    res.json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// Change Password
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Old password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
