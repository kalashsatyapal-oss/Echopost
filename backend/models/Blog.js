import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    category: { type: String, required: true },      // main category
    subcategory: { type: String },                  // subcategory optional
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    image: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);
