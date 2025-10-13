import express from "express";
import { createTag, getTags, deleteTag } from "../controllers/tagController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createTag);
router.get("/", getTags);
router.delete("/:id", protect, deleteTag);

export default router;
