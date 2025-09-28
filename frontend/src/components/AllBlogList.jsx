import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function AllBlogList({ blogs, currentUserId, refreshBlogs }) {
  const [likedBlogIds, setLikedBlogIds] = useState([]);
  const [activeAnimations, setActiveAnimations] = useState({});

  // Sync liked blogs when blogs or user changes
  useEffect(() => {
    if (blogs && currentUserId) {
      const liked = blogs
        .filter((b) => b.likes.includes(currentUserId))
        .map((b) => b._id);
      setLikedBlogIds(liked);
    }
  }, [blogs, currentUserId]);

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
      }, 1000);

      // Update liked state
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
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
              className="p-5 bg-white rounded-lg shadow hover:shadow-xl transition border relative overflow-hidden"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                <Link to={`/blog/${b._id}`} className="hover:text-blue-600">
                  {b.title}
                </Link>
              </h2>

              <div className="flex justify-between mb-2">
                <p className="text-sm text-blue-600 font-medium">
                  {b.category || "Uncategorized"}
                </p>
                <p className="text-sm text-gray-500">
                  Published: {formatDate(b.createdAt)}
                </p>
              </div>

              <p
                className="text-gray-700 line-clamp-3 mb-3"
                dangerouslySetInnerHTML={{ __html: b.content }}
              />

              {/* Likes & Comments */}
              <div className="flex justify-between items-center text-sm text-gray-600 relative">
                <button
                  onClick={() => toggleLike(b._id)}
                  className={`relative flex items-center gap-1 font-semibold transition-transform duration-150 ${
                    isLiked ? "text-blue-500 scale-110" : "text-gray-600"
                  }`}
                >
                  👍 {b.likes?.length || 0}

                  {/* Flying thumbs up + particles */}
                  {isAnimating && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                      <span className="animate-fly-thumbs text-blue-500 text-lg">👍</span>
                      {/* Particles */}
                      {[...Array(6)].map((_, i) => (
                        <span
                          key={i}
                          className={`absolute w-1 h-1 bg-blue-400 rounded-full animate-particle-${i}`}
                        />
                      ))}
                    </div>
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

      {/* Tailwind custom animations */}
      <style>
        {`
          @keyframes flyThumbs {
            0% { transform: translateY(0) scale(1); opacity: 1; }
            50% { transform: translateY(-20px) scale(1.3); opacity: 1; }
            100% { transform: translateY(-40px) scale(0); opacity: 0; }
          }
          .animate-fly-thumbs { animation: flyThumbs 2.5s ease-out forwards; }

          ${[...Array(6)]
            .map(
              (_, i) => `
              @keyframes particle-${i} {
                0% { transform: translate(0,0); opacity:1; }
                100% { transform: translate(${Math.random() * 40 - 20}px, ${
                Math.random() * -40
              }px); opacity:0; }
              }
              .animate-particle-${i} { animation: particle-${i} 0.8s ease-out forwards; }
            `
            )
            .join("")}
        `}
      </style>
    </div>
  );
}
