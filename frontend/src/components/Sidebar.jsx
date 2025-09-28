import { Link } from "react-router-dom";

export default function Sidebar({ sidebarOpen, setSidebarOpen, handleLogout }) {
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
