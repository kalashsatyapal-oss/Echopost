import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function AllBlogList({ blogs, currentUserId, refreshBlogs }) {
  const [likedBlogIds, setLikedBlogIds] = useState(
    blogs.filter((b) => b.likes.includes(currentUserId)).map((b) => b._id)
  );

  const [activeAnimations, setActiveAnimations] = useState({});

  const toggleLike = async (blogId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/blogs/like/${blogId}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      // Trigger animation
      setActiveAnimations((prev) => ({ ...prev, [blogId]: true }));
      setTimeout(() => {
        setActiveAnimations((prev) => ({ ...prev, [blogId]: false }));
      }, 300);

      // Update liked state
      if (likedBlogIds.includes(blogId)) {
        setLikedBlogIds(likedBlogIds.filter((id) => id !== blogId));
      } else {
        setLikedBlogIds([...likedBlogIds, blogId]);
      }

      // Refresh blog list to update like counts
      if (refreshBlogs) refreshBlogs();
    } catch (err) {
      console.error("Failed to like/unlike blog:", err);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {blogs.length > 0 ? (
        blogs.map((b) => {
          const isLiked = likedBlogIds.includes(b._id);
          const isAnimating = activeAnimations[b._id];

          return (
            <div
              key={b._id}
              className="p-5 bg-white rounded-lg shadow hover:shadow-xl transition border relative"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                <Link to={`/blog/${b._id}`} className="hover:text-blue-600">
                  {b.title}
                </Link>
              </h2>
              <p className="text-sm text-blue-600 font-medium mb-2">
                {b.category || "Uncategorized"}
              </p>
              <p
                className="text-gray-700 line-clamp-3 mb-3"
                dangerouslySetInnerHTML={{ __html: b.content }}
              />

              {/* Likes & Comments */}
              <div className="flex justify-between items-center text-sm text-gray-600">
                <button
                  onClick={() => toggleLike(b._id)}
                  className={`relative flex items-center gap-1 font-semibold transition-transform duration-150 ${
                    isLiked ? "text-blue-500 scale-110" : "text-gray-600"
                  }`}
                >
                  👍 {b.likes?.length || 0}

                  {/* Pop animation */}
                  {isAnimating && (
                    <span className="absolute top-0 left-0 -translate-y-2 animate-pop text-blue-500 text-lg">
                      👍
                    </span>
                  )}
                </button>

                <span>💬 {b.comments?.length || 0} Comments</span>
              </div>
            </div>
          );
        })
      ) : (
        <div className="col-span-full text-center text-gray-500 py-10 bg-gray-50 rounded-lg shadow-inner">
          No blogs found. Start by creating one!
        </div>
      )}
    </div>
  );
}
