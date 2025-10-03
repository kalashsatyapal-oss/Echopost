import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function ProfileMenu({ user, handleLogout, getProfileImage }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Optimize Cloudinary image if available
  const profileImageSrc = user?.profileImage
    ? `${getProfileImage()}?w_100,h_100,c_fill,q_auto,f_auto`
    : null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        aria-haspopup="true"
        aria-expanded={menuOpen}
        className="w-10 h-10 rounded-full border flex items-center justify-center overflow-hidden focus:outline-none shadow"
      >
        {profileImageSrc ? (
          <img
            src={profileImageSrc}
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