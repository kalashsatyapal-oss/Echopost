import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/blogs/${id}`).then((res) => setBlog(res.data));
    axios.get(`http://localhost:5000/api/comments/${id}`).then((res) => setComments(res.data));
  }, [id]);

  const handleLike = async () => {
    const res = await axios.put(
      `http://localhost:5000/api/blogs/${id}/like`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setBlog(res.data);
  };

  const handleComment = async () => {
    const res = await axios.post(
      `http://localhost:5000/api/comments/${id}`,
      { text },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setComments([res.data, ...comments]);
    setText("");
  };

  return blog ? (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
      <p className="text-sm text-gray-500 mb-4">{blog.category}</p>
      <div dangerouslySetInnerHTML={{ __html: blog.content }} />
      <button
        onClick={handleLike}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        👍 {blog.likes.length}
      </button>

      <h2 className="text-xl font-semibold mt-6 mb-2">Comments</h2>
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Add a comment..."
          className="flex-grow p-2 border rounded-l"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={handleComment}
          className="px-4 bg-green-500 text-white rounded-r"
        >
          Post
        </button>
      </div>
      <ul>
        {comments.map((c) => (
          <li key={c._id} className="p-2 border-b">
            <strong>{c.author.name}: </strong>
            {c.text}
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <p className="text-center mt-10">Loading...</p>
  );
}
