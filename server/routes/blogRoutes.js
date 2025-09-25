// blogRoutes.js
import express from "express";
import Blog from "../models/Blog.js";
import User from "../models/User.js";

const router = express.Router();

// Middleware for logging route hits
router.use((req, res, next) => {
  console.log("✅ blogRoutes hit:", req.method, req.url);
  next();
});

router.post("/create", async (req, res) => {
  const { title, content, author } = req.body;

  try {
    if (!title || !content || !author) {
      return res.status(400).json({ error: "Title, content, and author are required" });
    }

    const newBlog = new Blog({ title, content, author });
    await newBlog.save();

    res.status(201).json({ message: "Blog created", blog: newBlog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Get all blogs from all users
router.get("/all", async (req, res) => {
  try {
    const blogs = await Blog.find().populate("author", "name email");

    if (blogs.length === 0) {
      console.log("ℹ️ No blogs are there.");
    }

    res.json({ blogs }); // returns empty array if none found
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});
// Like a blog
router.post("/:id/like", async (req, res) => {
  const { userId } = req.body;

  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    if (blog.likes.includes(userId)) {
      return res.status(400).json({ error: "User already liked this blog" });
    }

    blog.likes.push(userId);
    await blog.save();

    res.status(200).json({ message: "Blog liked", likes: blog.likes.length });
  } catch (err) {
    res.status(500).json({ error: "Failed to like blog" });
  }
});

// Comment on a blog
router.post("/:id/comment", async (req, res) => {
  const { userId, text } = req.body;

  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    const userExists = await User.findById(userId);
    if (!userExists) return res.status(404).json({ error: "User not found" });

    const comment = { author: userId, text };
    blog.comments.push(comment);
    await blog.save();

    res.status(201).json({ message: "Comment added", comments: blog.comments });
  } catch (err) {
    res.status(500).json({ error: "Failed to add comment" });
  }
});

export default router;