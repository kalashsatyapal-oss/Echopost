import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  // Fetch blogs
  const fetchBlogs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/blogs", {
        params: { search, category },
      });
      setBlogs(res.data);

      // Extract unique categories
      const uniqueCategories = [
        ...new Set(res.data.map((b) => b.category).filter(Boolean)),
      ];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    }
  };

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

  useEffect(() => {
    fetchBlogs();
    fetchUser();
  }, [search, category]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Determine correct profile image source
  const getProfileImage = () => {
    if (!user?.profileImage) return null;

    // Base64 string without prefix
    const base64Pattern = /^[A-Za-z0-9+/]+={0,2}$/;
    if (base64Pattern.test(user.profileImage)) {
      return `data:image/png;base64,${user.profileImage}`;
    }

    // Already base64 or full URL
    if (
      user.profileImage.startsWith("data:image") ||
      user.profileImage.startsWith("http")
    ) {
      return user.profileImage;
    }

    // Otherwise, prepend server URL
    return `http://localhost:5000${user.profileImage}`;
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        {/* Create Blog Button */}
        <button
          onClick={() => navigate("/create")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          + New Blog
        </button>
        {/* Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden focus:outline-none"
          >
            {user?.profileImage ? (
              <img
                src={getProfileImage()}
                alt="profile"
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    "https://via.placeholder.com/150?text=Avatar";
                }}
              />
            ) : (
              <span className="text-lg font-bold">👤</span>
            )}
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-md z-10">
              <Link
                to="/profile"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search blogs..."
          className="flex-grow p-2 border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="p-2 border rounded"
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
      <div className="grid gap-6">
        {blogs.length > 0 ? (
          blogs.map((b) => (
            <div
              key={b._id}
              className="p-4 bg-white rounded shadow hover:shadow-lg transition"
            >
              <h2 className="text-xl font-bold mb-2">
                <Link to={`/blog/${b._id}`} className="hover:underline">
                  {b.title}
                </Link>
              </h2>
              <p className="text-sm text-gray-500 mb-2">{b.category}</p>
              <p
                className="text-gray-700 line-clamp-3"
                dangerouslySetInnerHTML={{ __html: b.content }}
              />
              <div className="mt-2 text-sm text-gray-600">
                {b.likes?.length || 0} Likes • {b.comments?.length || 0}{" "}
                Comments
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No blogs found</p>
        )}
      </div>
    </div>
  );
}
