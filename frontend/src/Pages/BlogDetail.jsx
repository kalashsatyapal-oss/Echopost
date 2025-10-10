import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

export default function BlogDetail() {
  const { id } = useParams();
  const token = useSelector((state) => state.auth.token);
  const authUser = useSelector((state) => state.auth.user);

  const currentUserId =
    authUser?.id ||
    authUser?._id ||
    (authUser?._id?.toString && authUser._id.toString()) ||
    null;

  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState({});
  const [isLiked, setIsLiked] = useState(false);
  const [likeAnimating, setLikeAnimating] = useState(false);

  const getImageSrc = (img) => {
    if (!img) return "/default-avatar.png";
    if (typeof img !== "string") return "/default-avatar.png";
    if (img.startsWith("data:") || img.startsWith("http")) return img;
    const base64Pattern = /^[A-Za-z0-9+/]+={0,2}$/;
    if (base64Pattern.test(img)) return `data:image/png;base64,${img}`;
    if (img.startsWith("/")) return `http://localhost:5000${img}`;
    return img;
  };

  const getAuthorId = (author) => {
    if (!author) return null;
    if (typeof author === "string") return author;
    return (
      (author._id && author._id.toString()) ||
      (author.id && author.id.toString()) ||
      null
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const blogRes = await axios.get(`http://localhost:5000/api/blogs/${id}`);
        setBlog(blogRes.data || null);
        setIsLiked(Boolean(blogRes.data?.likes?.includes(currentUserId)));

        const commentsRes = await axios.get(`http://localhost:5000/api/comments/${id}`);
        setComments(Array.isArray(commentsRes.data) ? commentsRes.data : []);
      } catch (err) {
        console.error("Failed to fetch blog/comments:", err);
      }
    };
    fetchData();
  }, [id, currentUserId]);

  const toggleLike = async () => {
    if (!blog) return;
    try {
      const res = await axios.put(
        `http://localhost:5000/api/blogs/like/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBlog(res.data);
      setIsLiked(Boolean(res.data?.likes?.includes(currentUserId)));
      setLikeAnimating(true);
      setTimeout(() => setLikeAnimating(false), 1000);
    } catch (err) {
      console.error("Failed to like/unlike blog:", err);
    }
  };

  const addComment = async () => {
    const text = newCommentText.trim();
    if (!text) return;
    try {
      const res = await axios.post(
        `http://localhost:5000/api/comments/${id}`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments((prev) => [res.data, ...prev]);
      setNewCommentText("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  const editComment = (commentId, text) => {
    setEditingCommentId(commentId);
    setEditingText((prev) => ({ ...prev, [commentId]: text }));
  };

  const updateComment = async (commentId) => {
    const text = editingText[commentId]?.trim();
    if (!text) return;
    try {
      const res = await axios.put(
        `http://localhost:5000/api/comments/${commentId}`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments((prev) => prev.map((c) => (c._id === commentId ? res.data : c)));
      setEditingCommentId(null);
      setEditingText((prev) => ({ ...prev, [commentId]: "" }));
    } catch (err) {
      console.error("Failed to update comment:", err);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:5000/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  if (!blog) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="w-[calc(100%-100px)] mx-[50px] mt-10 px-6 py-8 bg-white rounded-2xl shadow-xl">
      {/* Author */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={getImageSrc(blog.author?.profileImage)}
          alt={blog.author?.name || "Author"}
          className="w-14 h-14 rounded-full object-cover border"
        />
        <div>
          <div className="text-lg font-semibold text-gray-800">{blog.author?.name || "Unknown Author"}</div>
          <div className="text-xs text-gray-500">{new Date(blog.createdAt).toLocaleString()}</div>
        </div>
      </div>

      {/* Blog Image */}
      {blog.image && (
        <img
          src={getImageSrc(blog.image)}
          alt={blog.title}
          className="w-full max-h-96 object-cover rounded-2xl shadow-lg mb-6"
        />
      )}

      <h1 className="text-4xl font-bold mb-3">{blog.title}</h1>
      <p className="text-sm text-gray-500 mb-5">{blog.category}</p>
      <div className="prose max-w-full mb-8" dangerouslySetInnerHTML={{ __html: blog.content }} />

      {/* Like & Comment */}
      <div className="flex items-center gap-6 mb-6">
        <button
          onClick={toggleLike}
          className={`relative flex items-center gap-2 font-semibold transition-transform duration-150 hover:scale-110 ${
            isLiked ? "text-blue-500" : "text-gray-600"
          }`}
        >
          👍 {Array.isArray(blog.likes) ? blog.likes.length : 0}
          {likeAnimating && (
            <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 animate-fly-thumbs text-blue-500 text-lg">👍</span>
          )}
        </button>

        <button
          onClick={() => document.getElementById("commentInput")?.focus()}
          className="flex items-center gap-2 text-gray-600 font-semibold hover:text-green-600"
        >
          💬 {comments.length} Comments
        </button>
      </div>

      {/* Comment Input */}
      <div className="flex mb-6 gap-2">
        <input
          id="commentInput"
          type="text"
          placeholder="Add a comment..."
          className="flex-grow p-3 border rounded-l-lg focus:ring-2 focus:ring-green-400 outline-none"
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
        />
        <button
          onClick={addComment}
          className="px-5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-r-lg transition"
        >
          Post
        </button>
      </div>

      {/* Comments */}
      <ul className="space-y-4">
        {comments.map((c) => {
          const authorId = getAuthorId(c.author);
          const isAuthor = Boolean(authorId && currentUserId && authorId === currentUserId);

          return (
            <li
              key={c._id}
              className={`p-4 border rounded-xl bg-gray-50 ${
                editingCommentId === c._id ? "border-green-400 bg-green-50" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={getImageSrc(c.author?.profileImage)}
                    alt={c.author?.name || "User"}
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                  <div>
                    <div className="font-semibold text-gray-800">{c.author?.name || "Unknown"}</div>
                    <div className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleString()}</div>
                  </div>
                </div>

                {isAuthor && (
                  <div className="flex gap-3 text-sm text-gray-500">
                    {editingCommentId === c._id ? (
                      <>
                        <button onClick={() => updateComment(c._id)} className="hover:text-green-600 font-semibold">Save</button>
                        <button onClick={() => setEditingCommentId(null)} className="hover:text-red-600 font-semibold">Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => editComment(c._id, c.text)} className="hover:text-blue-600 font-semibold">Edit</button>
                        <button onClick={() => deleteComment(c._id)} className="hover:text-red-600 font-semibold">Delete</button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {editingCommentId === c._id ? (
                <input
                  value={editingText[c._id] ?? ""}
                  onChange={(e) => setEditingText((prev) => ({ ...prev, [c._id]: e.target.value }))}
                  className="w-full mt-3 p-2 border rounded focus:ring-2 focus:ring-green-400 outline-none"
                />
              ) : (
                <p className="text-gray-700 mt-3">{c.text}</p>
              )}
            </li>
          );
        })}
      </ul>

      <style>
        {`
          @keyframes flyThumbs {
            0% { transform: translateY(0) scale(1); opacity:1; }
            50% { transform: translateY(-20px) scale(1.3); opacity:1; }
            100% { transform: translateY(-40px) scale(0); opacity:0; }
          }
          .animate-fly-thumbs { animation: flyThumbs 1s ease-out forwards; }
        `}
      </style>
    </div>
  );
}
