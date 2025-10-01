import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

export default function BlogDetail() {
  const { id } = useParams();
  const token = useSelector((state) => state.auth.token);
  const currentUserId = useSelector((state) => state.auth.user?._id);

  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState({});
  const [isLiked, setIsLiked] = useState(false);
  const [likeAnimating, setLikeAnimating] = useState(false);

  // Fetch blog & comments
  useEffect(() => {
    const fetchData = async () => {
      try {
        const blogRes = await axios.get(`http://localhost:5000/api/blogs/${id}`);
        setBlog(blogRes.data);
        setIsLiked(blogRes.data.likes.includes(currentUserId));

        const commentsRes = await axios.get(`http://localhost:5000/api/comments/${id}`);
        setComments(commentsRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id, currentUserId]);

  // Handle Like
  const toggleLike = async () => {
    if (!blog) return;
    try {
      const res = await axios.put(
        `http://localhost:5000/api/blogs/like/${id}`, // make sure URL matches your backend route
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBlog(res.data);
      setIsLiked(res.data.likes.includes(currentUserId));

      setLikeAnimating(true);
      setTimeout(() => setLikeAnimating(false), 1000);
    } catch (err) {
      console.error("Failed to like blog", err);
    }
  };

  // Handle Comment
  const addComment = async () => {
    const text = newCommentText.trim();
    if (!text) return;

    try {
      const res = await axios.post(
        `http://localhost:5000/api/comments/${id}`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments([res.data, ...comments]);
      setNewCommentText("");
    } catch (err) {
      console.error(err);
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
      console.error(err);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:5000/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error(err);
    }
  };

  if (!blog) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
      <p className="text-sm text-gray-500 mb-4">{blog.category}</p>
      <div dangerouslySetInnerHTML={{ __html: blog.content }} />

      {/* Like & Comment Buttons */}
      <div className="flex justify-start items-center text-sm text-gray-600 relative mt-4 mb-4">
        <button
          onClick={toggleLike}
          className={`relative flex items-center gap-1 font-semibold transition-transform duration-150 ${
            isLiked ? "text-blue-500 scale-110" : "text-gray-600"
          }`}
        >
          👍 {blog.likes.length}
          {likeAnimating && (
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
              <span className="animate-fly-thumbs text-blue-500 text-lg">👍</span>
              {[...Array(6)].map((_, i) => (
                <span key={i} className={`absolute w-1 h-1 bg-blue-400 rounded-full animate-particle-${i}`} />
              ))}
            </div>
          )}
        </button>

        <button
          onClick={() => document.getElementById("commentInput").focus()}
          className="ml-4 flex items-center gap-1 text-gray-600 font-semibold"
        >
          💬 {comments.length} Comments
        </button>
      </div>

      {/* Comment Input */}
      <div className="flex mb-4">
        <input
          id="commentInput"
          type="text"
          placeholder="Add a comment..."
          className="flex-grow p-2 border rounded-l"
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
        />
        <button
          onClick={addComment}
          className="px-4 bg-green-500 text-white rounded-r"
        >
          Post
        </button>
      </div>

      {/* Comments List */}
      <ul>
        {comments.map((c) => (
          <li key={c._id} className="mb-2 p-2 border rounded flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <strong>{c.author.name}</strong>
              {c.author._id === currentUserId && (
                <div className="flex gap-2 text-sm text-gray-500">
                  {editingCommentId === c._id ? (
                    <>
                      <button onClick={() => updateComment(c._id)} className="hover:text-green-600">Save</button>
                      <button onClick={() => setEditingCommentId(null)} className="hover:text-red-600">Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => editComment(c._id, c.text)} className="hover:text-blue-600">Edit</button>
                      <button onClick={() => deleteComment(c._id)} className="hover:text-red-600">Delete</button>
                    </>
                  )}
                </div>
              )}
            </div>
            {editingCommentId === c._id ? (
              <input
                value={editingText[c._id] || ""}
                onChange={(e) => setEditingText((prev) => ({ ...prev, [c._id]: e.target.value }))}
                className="w-full mt-1 p-1 border rounded"
              />
            ) : (
              <p className="text-gray-700">{c.text}</p>
            )}
          </li>
        ))}
      </ul>

      <style>
        {`
          @keyframes flyThumbs {0% { transform: translateY(0) scale(1); opacity:1;} 50% { transform: translateY(-20px) scale(1.3); opacity:1;} 100% { transform: translateY(-40px) scale(0); opacity:0; }}
          .animate-fly-thumbs { animation: flyThumbs 1s ease-out forwards; }
          ${[...Array(6)].map((_, i) => `
            @keyframes particle-${i} {0%{transform:translate(0,0);opacity:1;}100%{transform:translate(${Math.random()*40-20}px,${Math.random()*-40}px);opacity:0;}}
            .animate-particle-${i}{animation:particle-${i} 0.8s ease-out forwards;}
          `).join("")}
        `}
      </style>
    </div>
  );
}
