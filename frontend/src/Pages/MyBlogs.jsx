import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import Sidebar from "../components/Sidebar.jsx";
import ProfileMenu from "../components/ProfileMenu.jsx";

export default function MyBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [likedBlogIds, setLikedBlogIds] = useState([]);
  const [activeAnimations, setActiveAnimations] = useState({});
  const [openComments, setOpenComments] = useState({});
  const [commentsData, setCommentsData] = useState({});
  const [newCommentText, setNewCommentText] = useState({});
  const [commentCounts, setCommentCounts] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const currentUserId = user?._id;

  // Fetch current user + blogs
  const fetchUserData = async () => {
    try {
      if (!token) return;

      const res = await axios.get("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
      setBlogs(res.data.blogs || []);

      const liked = (res.data.blogs || [])
        .filter((b) => b.likes.includes(res.data.user._id))
        .map((b) => b._id);
      setLikedBlogIds(liked);

      // Comment counts
      res.data.blogs.forEach(async (b) => {
        try {
          const resC = await axios.get(`http://localhost:5000/api/comments/${b._id}`);
          setCommentCounts((prev) => ({ ...prev, [b._id]: resC.data.length }));
        } catch {}
      });
    } catch (err) {
      console.error("Failed to fetch user blogs:", err);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const getProfileImage = () => {
    if (!user?.profileImage) return null;
    if (user.profileImage.startsWith("data:image") || user.profileImage.startsWith("http")) return user.profileImage;
    const base64Pattern = /^[A-Za-z0-9+/]+={0,2}$/;
    if (base64Pattern.test(user.profileImage)) return `data:image/png;base64,${user.profileImage}`;
    return `http://localhost:5000${user.profileImage}`;
  };

  // Delete a blog
  const handleDelete = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/blogs/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(blogs.filter((b) => b._id !== blogId));
    } catch (err) {
      console.error("Failed to delete blog:", err);
      alert("Failed to delete blog");
    }
  };

  // Toggle like
  const toggleLike = async (blogId) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/blogs/like/${blogId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setActiveAnimations((prev) => ({ ...prev, [blogId]: true }));
      setTimeout(() => setActiveAnimations((prev) => ({ ...prev, [blogId]: false })), 1000);

      if (likedBlogIds.includes(blogId)) {
        setLikedBlogIds(likedBlogIds.filter((id) => id !== blogId));
      } else {
        setLikedBlogIds([...likedBlogIds, blogId]);
      }

      setBlogs((prev) =>
        prev.map((b) => (b._id === blogId ? { ...b, likes: res.data.likes } : b))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle comments
  const toggleComments = async (blogId) => {
    if (!openComments[blogId]) {
      try {
        const res = await axios.get(`http://localhost:5000/api/comments/${blogId}`);
        setCommentsData((prev) => ({ ...prev, [blogId]: res.data }));
      } catch (err) {
        console.error(err);
      }
    }
    setOpenComments((prev) => ({ ...prev, [blogId]: !prev[blogId] }));
  };

  const addComment = async (blogId) => {
    const text = newCommentText[blogId]?.trim();
    if (!text) return;
    try {
      const res = await axios.post(
        `http://localhost:5000/api/comments/${blogId}`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCommentsData((prev) => ({
        ...prev,
        [blogId]: [res.data, ...(prev[blogId] || [])],
      }));
      setCommentCounts((prev) => ({ ...prev, [blogId]: (prev[blogId] || 0) + 1 }));
      setNewCommentText((prev) => ({ ...prev, [blogId]: "" }));
    } catch (err) {
      console.error(err);
    }
  };

  // Edit comment
  const startEditComment = (commentId, text) => {
    setEditingCommentId(commentId);
    setEditCommentText(text);
  };

  const saveEditComment = async (blogId, commentId) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/comments/${commentId}`,
        { text: editCommentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommentsData((prev) => ({
        ...prev,
        [blogId]: prev[blogId].map((c) =>
          c._id === commentId ? { ...c, text: res.data.text } : c
        ),
      }));
      setEditingCommentId(null);
      setEditCommentText("");
    } catch (err) {
      console.error(err);
    }
  };

  // Delete comment
  const deleteComment = async (blogId, commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCommentsData((prev) => ({
        ...prev,
        [blogId]: prev[blogId].filter((c) => c._id !== commentId),
      }));
      setCommentCounts((prev) => ({ ...prev, [blogId]: prev[blogId] - 1 }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} handleLogout={handleLogout} />
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 md:ml-64 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-white z-10 py-2 border-b">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 rounded bg-gray-100"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>
            <h1 className="text-2xl font-bold text-gray-800">📝 My Blogs</h1>
          </div>

          <ProfileMenu
            user={user}
            handleLogout={handleLogout}
            getProfileImage={getProfileImage}
          />
        </div>

        {/* Blog List */}
        <div className="grid md:grid-cols-2 gap-6">
          {blogs.length > 0 ? (
            blogs.map((b) => {
              const isLiked = likedBlogIds.includes(b._id);
              const isAnimating = activeAnimations[b._id];
              const comments = commentsData[b._id] || [];
              const commentCount = commentCounts[b._id] || 0;

              return (
                <div key={b._id} className="p-5 bg-white rounded-lg shadow hover:shadow-xl transition border flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      <Link to={`/blog/${b._id}`} className="hover:text-blue-600">
                        {b.title}
                      </Link>
                    </h2>
                    <p className="text-sm text-blue-600 font-medium mb-2">{b.category || "Uncategorized"}</p>
                    <p className="text-gray-700 line-clamp-3 mb-3" dangerouslySetInnerHTML={{ __html: b.content }} />
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleLike(b._id)}
                        className={`relative flex items-center gap-1 font-semibold transition-transform duration-150 ${
                          isLiked ? "text-blue-500 scale-110" : "text-gray-600"
                        }`}
                      >
                        👍 {b.likes.length}
                        {isAnimating && (
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                            <span className="animate-fly-thumbs text-blue-500 text-lg">👍</span>
                            {[...Array(6)].map((_, i) => (
                              <span key={i} className={`absolute w-1 h-1 bg-blue-400 rounded-full animate-particle-${i}`} />
                            ))}
                          </div>
                        )}
                      </button>
                      <button onClick={() => toggleComments(b._id)} className="text-gray-600 font-semibold">
                        💬 {commentCount} Comments
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        to={`/edit-blog/${b._id}`}
                        className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(b._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Inline comments */}
                  {openComments[b._id] && (
                    <div className="mt-3 border-t pt-3">
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="Write a comment..."
                          value={newCommentText[b._id] || ""}
                          onChange={(e) => setNewCommentText((prev) => ({ ...prev, [b._id]: e.target.value }))}
                          className="flex-grow p-2 border rounded shadow-sm"
                        />
                        <button
                          onClick={() => addComment(b._id)}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Comment
                        </button>
                      </div>

                      {comments.map((c) => (
                        <div key={c._id} className="mb-2 p-2 bg-gray-50 rounded shadow-sm flex justify-between items-start gap-2">
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-gray-700">{c.author.name}</span>
                            </div>
                            {editingCommentId === c._id ? (
                              <div className="mt-1">
                                <input
                                  type="text"
                                  value={editCommentText}
                                  onChange={(e) => setEditCommentText(e.target.value)}
                                  className="w-full p-2 border rounded"
                                />
                                <div className="flex gap-2 mt-1">
                                  <button
                                    onClick={() => saveEditComment(b._id, c._id)}
                                    className="px-2 py-1 bg-green-500 text-white rounded"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingCommentId(null)}
                                    className="px-2 py-1 bg-gray-400 text-white rounded"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <p className="mt-1 text-gray-700">{c.text}</p>
                            )}
                          </div>
                          {c.author._id === currentUserId && editingCommentId !== c._id && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => startEditComment(c._id, c.text)}
                                className="text-sm text-yellow-600 hover:underline"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteComment(b._id, c._id)}
                                className="text-sm text-red-600 hover:underline"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center text-gray-500 py-10 bg-gray-50 rounded-lg shadow-inner">
              You haven’t written any blogs yet.
            </div>
          )}
        </div>
      </div>

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
