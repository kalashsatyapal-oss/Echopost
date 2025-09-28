import { useState } from "react";
import { Link } from "react-router-dom";

export default function ProfileMenu({ user, handleLogout, getProfileImage }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="w-10 h-10 rounded-full border flex items-center justify-center overflow-hidden focus:outline-none shadow"
      >
        {user?.profileImage ? (
          <img
            src={getProfileImage()}
            alt="profile"
            className="w-full h-full object-cover rounded-full"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "https://via.placeholder.com/150?text=Avatar";
            }}
          />
        ) : (
          <span className="text-lg font-bold">👤</span>
        )}
      </button>

      {menuOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border z-10">
          <Link
            to="/profile"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-lg"
          >
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-b-lg"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
