import express from "express";
import upload from "../middleware/upload.js";
import {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  toggleLike,
} from "../controllers/blogController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(getBlogs)
  .post(protect, upload.single("image"), createBlog);

router.route("/:id")
  .get(getBlog)
  .put(protect, upload.single("image"), updateBlog)
  .delete(protect, deleteBlog);

router.put("/like/:id", protect, toggleLike);

export default router;
