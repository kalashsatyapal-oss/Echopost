import Blog from "../models/Blog.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

// Create Blog
// Create Blog
export const createBlog = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    let imageUrl = "";

    if (req.file) {
      const buffer = req.file.buffer;
      imageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "blogs" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );
        stream.end(buffer);
      });
    }

    // Validate tags
    let parsedTags = [];
    if (tags) {
      parsedTags = Array.isArray(tags) ? tags : JSON.parse(tags);
      if (parsedTags.length < 1 || parsedTags.length > 5) {
        return res
          .status(400)
          .json({ message: "Please select between 1 and 5 tags" });
      }
    }

    const blog = await Blog.create({
      title,
      content,
      category,
      author: req.user._id,
      image: imageUrl,
      tags: parsedTags, // store ObjectIds
    });

    const populatedBlog = await blog.populate("tags", "name");
    res.status(201).json(populatedBlog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Blogs with Search & Category Filter
// Get all blogs with search + category
// Get All Blogs with Search & Category Filter
export const getBlogs = async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (search) {
      // Search by title or author name
      const authors = await User.find({
        name: { $regex: search, $options: "i" },
      }).select("_id");

      const authorIds = authors.map((a) => a._id);

      query = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { author: { $in: authorIds } },
        ],
      };
    }

    if (category) {
      query.category = category;
    }

    const blogs = await Blog.find(query)
      .populate("author", "name profileImage")
      .populate("tags", "name")
      .sort({ createdAt: -1 });

    res.json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Single Blog
export const getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id) .populate("author", "name profileImage")
  .populate("tags", "name");
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update Blog
// Update Blog
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.author.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    const { title, content, category, tags } = req.body;

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.category = category || blog.category;

    // ✅ Handle tag updates
    if (tags) {
      const parsedTags = Array.isArray(tags) ? tags : JSON.parse(tags);
      blog.tags = parsedTags;
    }

    // ✅ Handle new image upload if file exists
    if (req.file) {
      const buffer = req.file.buffer;
      const imageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "blogs" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );
        stream.end(buffer);
      });
      blog.image = imageUrl;
    }

    await blog.save();

    const populatedBlog = await blog.populate("tags", "name");
    res.json(populatedBlog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Blog
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.author.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    await blog.deleteOne();
    res.json({ message: "Blog deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Like/Unlike Blog
// Toggle like
export const toggleLike = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const userId = req.user._id.toString();
    if (blog.likes.includes(userId)) {
      blog.likes = blog.likes.filter((id) => id.toString() !== userId);
    } else {
      blog.likes.push(userId);
    }

    await blog.save();
    res.json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
