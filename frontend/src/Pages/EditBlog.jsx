import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import BlogEditor from "../components/BlogEditor.jsx";

export default function EditBlog() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/blogs/${id}`).then((res) => {
      setTitle(res.data.title);
      setCategory(res.data.category);
      setContent(res.data.content);
    });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put(
      `http://localhost:5000/api/blogs/${id}`,
      { title, category, content },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    navigate(`/blog/${id}`);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Edit Blog</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 mb-4 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Category"
          className="w-full p-2 mb-4 border rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <BlogEditor content={content} setContent={setContent} />
        <button className="w-full mt-4 bg-green-500 text-white py-2 rounded hover:bg-green-600">
          Update
        </button>
      </form>
    </div>
  );
}
