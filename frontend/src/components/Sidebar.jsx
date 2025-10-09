import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Sidebar({ sidebarOpen, setSidebarOpen, handleLogout }) {
  const user = useSelector((state) => state.auth.user); // ✅ get user from Redux

  return (
    <div
      className={`fixed inset-y-0 left-0 w-64 bg-white border-r shadow-lg transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform md:translate-x-0 z-20`}
    >
      <div className="p-4 font-bold text-lg border-b">📚 Dashboard</div>
      <nav className="flex flex-col p-4 space-y-2">
        <Link to="/dashboard" className="px-3 py-2 rounded hover:bg-gray-100">
          Home
        </Link>
        <Link to="/create" className="px-3 py-2 rounded hover:bg-gray-100">
          Create Blog
        </Link>
        <Link to="/my-blogs" className="px-3 py-2 rounded hover:bg-gray-100">
          My Blogs
        </Link>
        <Link to="/profile" className="px-3 py-2 rounded hover:bg-gray-100">
          Profile
        </Link>
        <Link
          to="/guidelines"
          className="px-3 py-2 rounded hover:bg-gray-100 text-gray-700"
        >
          Guidelines
        </Link>
        {/* ✅ Visible to both admin and superadmin */}
        {(user?.role === "admin" || user?.role === "superadmin") && (
          <Link
            to="/admin-dashboard"
            className="px-3 py-2 rounded hover:bg-gray-100 text-purple-600 font-semibold"
          >
            Admin Dashboard
          </Link>
        )}
        {user?.role === "superadmin" && (
          <Link
            to="/superadmin-dashboard"
            className="px-3 py-2 rounded hover:bg-gray-100 text-blue-500 font-semibold"
          >
            SuperAdmin Dashboard
          </Link>
        )}
        <button
          onClick={handleLogout}
          className="px-3 py-2 rounded hover:bg-gray-100 text-left text-red-500"
        >
          Logout
        </button>
      </nav>
    </div>
  );
}
