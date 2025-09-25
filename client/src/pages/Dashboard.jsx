import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/authSlice";
import logo from "../assets/logo.png";

export default function Dashboard() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  // helper to get initials
  const initials = (name = "") =>
    name.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 via-blue-50 to-indigo-200 text-gray-800 flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <div className="flex items-center">
          {/* Hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded hover:bg-gray-100 mr-4"
            aria-label="Open sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {/* Logo */}
          <img
            src={logo}
            alt="EchoPost Logo"
            className="h-20 w-40 mr-4 rounded-xl shadow-lg object-contain bg-white"
          />
          <div>
            <span className="text-2xl font-extrabold text-indigo-700 tracking-wide">
              EchoPost
            </span>
            <div className="text-sm text-teal-700 font-medium">
              Your voice. Your story.
            </div>
          </div>
        </div>
        
        <div className="relative">
          <button
            className="flex items-center gap-2 p-1 rounded hover:bg-gray-100"
            onClick={() => setProfileMenuOpen(p => !p)}
          >
            {user?.profileImage ? (
              <img src={user.profileImage} alt="avatar" className="w-9 h-9 rounded-full object-cover" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                {initials(user?.name || "U")}
              </div>
            )}
          </button>
          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow z-40">
              <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-50" onClick={() => setProfileMenuOpen(false)}>Profile</Link>
              <Link to="/settings" className="block px-4 py-2 text-sm hover:bg-gray-50" onClick={() => setProfileMenuOpen(false)}>Settings</Link>
              <button
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                onClick={() => {
                  dispatch(logout());
                  navigate("/login");
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-200 ease-in-out w-64 bg-white border-r p-4 z-30`}>
        <button className="mb-4 px-2 py-1 rounded hover:bg-gray-100" onClick={() => setSidebarOpen(false)}>Close</button>
        <nav className="space-y-2">
          <Link to="/dashboard" className="block px-3 py-2 rounded hover:bg-gray-100">Home</Link>
          <Link to="/profile" className="block px-3 py-2 rounded hover:bg-gray-100">Profile</Link>
          <Link to="/settings" className="block px-3 py-2 rounded hover:bg-gray-100">Settings</Link>
          {user?.role === "superadmin" && (
            <Link to="/superadmin" className="block px-3 py-2 rounded hover:bg-gray-100">Superadmin Dashboard</Link>
          )}
        </nav>
      </aside>

      {/* Main content area */}
      <main className="flex flex-col items-center justify-center flex-grow px-4">
        {/* Add dashboard content here */}
        
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 text-sm flex flex-col items-center gap-2">
        <span>
          &copy; {new Date().getFullYear()} EchoPost. All rights reserved.
        </span>
      </footer>
    </div>
  );
}