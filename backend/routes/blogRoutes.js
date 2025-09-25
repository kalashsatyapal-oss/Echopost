import express from "express";
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
  .post(protect, createBlog);

router.route("/:id")
  .get(getBlog)
  .put(protect, updateBlog)
  .delete(protect, deleteBlog);

router.route("/:id/like").put(protect, toggleLike);

export default router;
