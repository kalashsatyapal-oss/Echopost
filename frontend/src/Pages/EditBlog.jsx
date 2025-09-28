import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function EditBlog() {
  const { id } = useParams();
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");

  // TipTap editor setup
  const editor = useEditor({
    extensions: [StarterKit],
    content: "", // initially empty
    onUpdate: ({ editor }) => setContent(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[200px] p-2 border rounded",
        placeholder: "Edit your blog content here...",
      },
    },
  });

  // Fetch blog details
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/blogs/${id}`);
        setTitle(res.data.title);
        setCategory(res.data.category);
        setContent(res.data.content);

        // Set the content in TipTap editor
        if (editor) editor.commands.setContent(res.data.content);
      } catch (err) {
        console.error("Failed to fetch blog:", err);
        alert("Failed to load blog.");
      }
    };
    fetchBlog();
  }, [id, editor]);

  // Handle update
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!title || !category || !content) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/blogs/${id}`,
        { title, category, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Blog updated successfully!");
      navigate("/my-blogs");
    } catch (err) {
      console.error("Failed to update blog:", err);
      alert("Failed to update blog.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Edit Blog</h1>
      <form onSubmit={handleUpdate} className="flex flex-col gap-4">
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
          Update Blog
        </button>
      </form>
    </div>
  );
}
