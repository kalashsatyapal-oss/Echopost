import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function AllBlogList({ blogs, currentUserId, refreshBlogs }) {
  const [likedBlogIds, setLikedBlogIds] = useState([]);
  const [activeAnimations, setActiveAnimations] = useState({});
  const [openComments, setOpenComments] = useState({});
  const [commentsData, setCommentsData] = useState({});
  const [newCommentText, setNewCommentText] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState({});
  const [commentCounts, setCommentCounts] = useState({});
  const [expandedContent, setExpandedContent] = useState({}); // blogId => bool

  useEffect(() => {
    if (blogs && currentUserId) {
      const liked = blogs
        .filter((b) => b.likes.includes(currentUserId))
        .map((b) => b._id);
      setLikedBlogIds(liked);

      // Initialize comment counts
      blogs.forEach(async (b) => {
        try {
          const res = await axios.get(`http://localhost:5000/api/comments/${b._id}`);
          setCommentCounts((prev) => ({ ...prev, [b._id]: res.data.length }));
        } catch (err) {
          console.error("Failed to fetch comment count", err);
        }
      });
    }
  }, [blogs, currentUserId]);

  const toggleLike = async (blogId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/blogs/like/${blogId}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      setActiveAnimations((prev) => ({ ...prev, [blogId]: true }));
      setTimeout(() => setActiveAnimations((prev) => ({ ...prev, [blogId]: false })), 1000);

      if (likedBlogIds.includes(blogId)) {
        setLikedBlogIds(likedBlogIds.filter((id) => id !== blogId));
      } else {
        setLikedBlogIds([...likedBlogIds, blogId]);
      }

      if (refreshBlogs) refreshBlogs();
    } catch (err) {
      console.error("Failed to like/unlike blog:", err);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

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

  const toggleContent = (blogId) => {
    setExpandedContent((prev) => ({ ...prev, [blogId]: !prev[blogId] }));
  };

  const addComment = async (blogId) => {
    const text = newCommentText[blogId]?.trim();
    if (!text) return;
    try {
      const res = await axios.post(
        `http://localhost:5000/api/comments/${blogId}`,
        { text },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
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

  const editComment = (commentId, text) => {
    setEditingCommentId(commentId);
    setEditingText((prev) => ({ ...prev, [commentId]: text }));
  };

  const updateComment = async (commentId, blogId) => {
    const text = editingText[commentId]?.trim();
    if (!text) return;
    try {
      const res = await axios.put(
        `http://localhost:5000/api/comments/${commentId}`,
        { text },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setCommentsData((prev) => ({
        ...prev,
        [blogId]: prev[blogId].map((c) => (c._id === commentId ? res.data : c)),
      }));
      setEditingCommentId(null);
      setEditingText((prev) => ({ ...prev, [commentId]: "" }));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteComment = async (commentId, blogId) => {
    try {
      await axios.delete(`http://localhost:5000/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCommentsData((prev) => ({
        ...prev,
        [blogId]: prev[blogId].filter((c) => c._id !== commentId),
      }));
      setCommentCounts((prev) => ({ ...prev, [blogId]: (prev[blogId] || 1) - 1 }));
    } catch (err) {
      console.error(err);
    }
  };

  const getProfileImage = (profileImage) => {
    if (!profileImage) return null;
    const base64Pattern = /^[A-Za-z0-9+/]+={0,2}$/;
    if (base64Pattern.test(profileImage)) return `data:image/png;base64,${profileImage}`;
    if (profileImage.startsWith("data:image") || profileImage.startsWith("http")) return profileImage;
    return `http://localhost:5000${profileImage}`;
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {blogs.length > 0 ? (
        blogs.map((b) => {
          const isLiked = likedBlogIds.includes(b._id);
          const isAnimating = activeAnimations[b._id];
          const comments = commentsData[b._id] || [];
          const commentCount = commentCounts[b._id] || 0;
          const isExpanded = expandedContent[b._id] || false;

          return (
            <div key={b._id} className="p-5 bg-white rounded-lg shadow hover:shadow-xl transition border relative overflow-hidden">
              {/* Author Info */}
              <div className="flex items-center gap-3 mb-2">
                {b.author?.profileImage && (
                  <img
                    src={getProfileImage(b.author.profileImage)}
                    alt={b.author.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <span className="font-semibold text-gray-700">{b.author?.name || "Unknown Author"}</span>
              </div>

              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                <Link to={`/blog/${b._id}`} className="hover:text-blue-600">{b.title}</Link>
              </h2>

              <div className="flex justify-between mb-2">
                <p className="text-sm text-blue-600 font-medium">{b.category || "Uncategorized"}</p>
                <p className="text-sm text-gray-500">Published: {formatDate(b.createdAt)}</p>
              </div>

              {/* Blog content with Read More / Read Less */}
              <div className="text-gray-700 mb-3">
                <p className={`${!isExpanded ? "line-clamp-3" : ""}`} dangerouslySetInnerHTML={{ __html: b.content }} />
                {b.content.length > 200 && (
                  <button onClick={() => toggleContent(b._id)} className="text-blue-500 font-semibold mt-1">
                    {isExpanded ? "Read Less" : "Read More"}
                  </button>
                )}
              </div>

              <div className="flex justify-between items-center text-sm text-gray-600 relative">
                <button
                  onClick={() => toggleLike(b._id)}
                  className={`relative flex items-center gap-1 font-semibold transition-transform duration-150 ${
                    isLiked ? "text-blue-500 scale-110" : "text-gray-600"
                  }`}
                >
                  👍 {b.likes?.length || 0}
                  {isAnimating && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                      <span className="animate-fly-thumbs text-blue-500 text-lg">👍</span>
                      {[...Array(6)].map((_, i) => (
                        <span key={i} className={`absolute w-1 h-1 bg-blue-400 rounded-full animate-particle-${i}`} />
                      ))}
                    </div>
                  )}
                </button>

                <button onClick={() => toggleComments(b._id)}>💬 {commentCount} Comments</button>
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
                    <button onClick={() => addComment(b._id)} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Comment</button>
                  </div>

                  {comments.map((c) => (
                    <div key={c._id} className="mb-2 p-2 bg-gray-50 rounded shadow-sm flex gap-2">
                      {c.author?.profileImage && (
                        <img
                          src={getProfileImage(c.author.profileImage)}
                          alt={c.author.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-700">{c.author.name}</span>
                          {c.author._id === currentUserId && (
                            <div className="flex gap-2 text-xs text-gray-500">
                              {editingCommentId === c._id ? (
                                <>
                                  <button onClick={() => updateComment(c._id, b._id)} className="hover:text-green-600">Save</button>
                                  <button onClick={() => setEditingCommentId(null)} className="hover:text-red-600">Cancel</button>
                                </>
                              ) : (
                                <>
                                  <button onClick={() => editComment(c._id, c.text)} className="hover:text-blue-600">Edit</button>
                                  <button onClick={() => deleteComment(c._id, b._id)} className="hover:text-red-600">Delete</button>
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
                          <p className="mt-1 text-gray-700">{c.text}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div className="col-span-full text-center text-gray-500 py-10 bg-gray-50 rounded-lg shadow-inner">No blogs found. Start by creating one!</div>
      )}

      <style>
        {`
          @keyframes flyThumbs {0% { transform: translateY(0) scale(1); opacity:1;} 50% { transform: translateY(-20px) scale(1.3); opacity:1;} 100% { transform: translateY(-40px) scale(0); opacity:0; }}
          .animate-fly-thumbs { animation: flyThumbs 2.5s ease-out forwards; }
          ${[...Array(6)].map((_, i) => `
            @keyframes particle-${i} {0%{transform:translate(0,0);opacity:1;}100%{transform:translate(${Math.random()*40-20}px,${Math.random()*-40}px);opacity:0;}}
            .animate-particle-${i}{animation:particle-${i} 0.8s ease-out forwards;}
          `).join("")}
        `}
      </style>
    </div>
  );
}
