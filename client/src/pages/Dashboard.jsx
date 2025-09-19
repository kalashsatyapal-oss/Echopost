import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/authSlice";

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
    <div className="min-h-screen flex bg-gray-50">
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

      {/* Page content area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b bg-white">
          <div className="flex items-center gap-3">
            {/* hamburger */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded hover:bg-gray-100"
              aria-label="Open sidebar"
            >
              {/* simple hamburger icon */}
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="text-sm text-gray-600">EchoPost</div>
          </div>

          <div className="relative">
            {/* profile menu icon */}
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

        {/* Main content area — developer friendly quick links/cards */}
        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded shadow-sm">
              <div className="text-sm text-gray-500">Logged in as</div>
              <div className="font-medium text-lg">{user?.name}</div>
              <div className="text-xs text-gray-400">{user?.email}</div>
              <div className="mt-2 text-xs inline-block px-2 py-1 rounded bg-gray-100">{user?.role}</div>
            </div>

            <div className="p-4 bg-white rounded shadow-sm">
              <div className="text-sm text-gray-500">Dev</div>
              <div className="mt-2">
                <div className="text-xs text-gray-600">Token present: {Boolean(localStorage.getItem("token")) ? "yes" : "no"}</div>
                <div className="text-xs text-gray-600">User JSON in localStorage: {localStorage.getItem("user") ? "yes" : "no"}</div>
              </div>
            </div>

            <div className="p-4 bg-white rounded shadow-sm">
              <div className="text-sm text-gray-500">Quick Links</div>
              <div className="flex flex-col gap-2 mt-2">
                <Link className="text-sm text-blue-600" to="/profile">Open Profile</Link>
                <Link className="text-sm text-blue-600" to="/settings">Open Settings</Link>
                {user?.role === "superadmin" && <Link className="text-sm text-blue-600" to="/superadmin">Open Superadmin</Link>}
              </div>
            </div>
          </div>

          {/* additional content area */}
          <section className="mt-6">
            {/* developer friendly hints */}
            <div className="text-sm text-gray-500">Hints</div>
            <ul className="list-disc pl-5 text-sm text-gray-600 mt-2">
              <li>Use Settings to change name or upload profile image (stored as base64).</li>
              <li>Superadmin will see a link to the Superadmin dashboard in the sidebar and here.</li>
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
}
