import express from "express";
import { addComment, getComments, deleteComment } from "../controllers/commentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/:blogId")
  .get(getComments)
  .post(protect, addComment);

router.route("/delete/:commentId")
  .delete(protect, deleteComment);

export default router;
