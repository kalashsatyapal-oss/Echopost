import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    blog: { type: mongoose.Schema.Types.ObjectId, ref: "Blog" },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
