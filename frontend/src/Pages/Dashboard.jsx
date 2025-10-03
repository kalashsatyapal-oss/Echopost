import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Sidebar from "../components/Sidebar.jsx";
import ProfileMenu from "../components/ProfileMenu.jsx";
import AllBlogList from "../components/AllBlogList.jsx";

export default function Dashboard() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  // Fetch current user
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.get("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

  // Fetch blogs
  const fetchBlogs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/blogs", {
        params: { search, category },
      });

      // Convert likes to strings to match currentUserId
      const blogsWithStringLikes = res.data.map((b) => ({
        ...b,
        likes: b.likes.map((id) => id.toString()),
      }));

      setBlogs(blogsWithStringLikes);

      // Extract unique categories
      const uniqueCategories = [
        ...new Set(res.data.map((b) => b.category).filter(Boolean)),
      ];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) fetchBlogs();
  }, [search, category, user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Simplified: Cloudinary URL
  const getProfileImage = () => {
    return user?.profileImage || "/default-avatar.png";
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        handleLogout={handleLogout}
      />

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
            <h1 className="text-2xl font-bold text-gray-800">📖 My Dashboard</h1>
          </div>

          <ProfileMenu
            user={user}
            handleLogout={handleLogout}
            getProfileImage={getProfileImage}
          />
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-8 bg-gray-50 p-4 rounded-lg shadow-sm">
          <input
            type="text"
            placeholder="🔍 Search blogs..."
            className="flex-grow p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c, i) => (
              <option key={i} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Blog List */}
        <AllBlogList blogs={blogs} currentUserId={user?._id} refreshBlogs={fetchBlogs} />
      </div>
    </div>
  );
}
