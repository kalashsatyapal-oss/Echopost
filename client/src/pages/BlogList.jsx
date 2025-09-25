import { useEffect, useState } from "react";
import axios from "axios";

function BlogList({ user }) {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get("/api/blogs/all"); // ✅ updated route
      const data = res.data.blogs; // ✅ extract blogs array
      setBlogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setBlogs([]); // fallback to empty array
    }
  };

  const handleLike = async (id) => {
    try {
      await axios.post(`/api/blogs/${id}/like`, { userId: user._id });
      fetchBlogs();
    } catch (error) {
      console.error("Error liking blog:", error);
    }
  };

  const handleComment = async (id, text) => {
    try {
      await axios.post(`/api/blogs/${id}/comment`, { userId: user._id, text });
      fetchBlogs();
    } catch (error) {
      console.error("Error commenting on blog:", error);
    }
  };

  return (
    <div>
      {Array.isArray(blogs) && blogs.length > 0 ? (
        blogs.map(blog => (
          <div key={blog._id} className="border p-4 mb-4 rounded">
            <h3 className="font-bold">{blog.title}</h3>
            <p>{blog.content}</p>
            <p className="text-sm text-gray-500">Author: {blog.author?.name || "Unknown"}</p>
            <div>
              <button onClick={() => handleLike(blog._id)}>
                👍 {blog.likes?.length || 0}
              </button>
            </div>
            <div>
              <h4>Comments:</h4>
              {blog.comments?.map((c, index) => (
                <div key={index}>{c.text}</div>
              ))}
              <input
                type="text"
                placeholder="Add comment"
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    handleComment(blog._id, e.target.value);
                    e.target.value = "";
                  }
                }}
              />
            </div>
          </div>
        ))
      ) : (
        <p>No blogs available.</p>
      )}
    </div>
  );
}

export default BlogList;