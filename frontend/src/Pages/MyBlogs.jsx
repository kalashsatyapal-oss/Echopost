import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import Sidebar from "../components/Sidebar.jsx";
import ProfileMenu from "../components/ProfileMenu.jsx";

export default function MyBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  // Fetch current user + their blogs
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
      setBlogs(res.data.blogs || []);
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

    if (user.profileImage.startsWith("data:image") || user.profileImage.startsWith("http")) {
      return user.profileImage;
    }

    const base64Pattern = /^[A-Za-z0-9+/]+={0,2}$/;
    if (base64Pattern.test(user.profileImage)) {
      return `data:image/png;base64,${user.profileImage}`;
    }

    return `http://localhost:5000${user.profileImage}`;
  };

  // Delete a blog
  const handleDelete = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/blogs/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(blogs.filter((b) => b._id !== blogId));
    } catch (err) {
      console.error("Failed to delete blog:", err);
      alert("Failed to delete blog");
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} handleLogout={handleLogout} />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
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
            blogs.map((b) => (
              <div
                key={b._id}
                className="p-5 bg-white rounded-lg shadow hover:shadow-xl transition border flex flex-col justify-between"
              >
                <div>
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
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between mt-2">
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
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-10 bg-gray-50 rounded-lg shadow-inner">
              You haven’t written any blogs yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
