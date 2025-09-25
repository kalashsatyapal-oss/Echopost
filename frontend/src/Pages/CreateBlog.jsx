import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  // TipTap editor setup
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }) => setContent(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[200px] p-2 border rounded",
        placeholder: "Write your blog content here...",
      },
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !category || !content) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/blogs",
        { title, category, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Show success message
      setMessage("Blog published successfully!");

      // Reset fields after 2 seconds
      setTimeout(() => {
        setTitle("");
        setCategory("");
        setContent("");
        editor.commands.setContent("");
        setMessage("");
      }, 2000);
    } catch (err) {
      console.error("Failed to create blog:", err);
      alert("Error creating blog");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Create Blog</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Category"
          className="w-full p-2 border rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <EditorContent editor={editor} />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Publish
        </button>
      </form>

      {message && (
        <div className="mt-4 text-green-600 font-semibold">
          {message}
        </div>
      )}
    </div>
  );
}
