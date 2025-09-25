import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

export default function Profile() {
  const token = useSelector((state) => state.auth.token);
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [name, setName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile + blogs
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user || {});
        setBlogs(res.data.blogs || []);
        setName(res.data.user?.name || "");
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  // Update profile (name + image)
  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (image) formData.append("profileImage", image);

      const res = await axios.put(
        "http://localhost:5000/api/users/update",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUser(res.data);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile");
    }
  };

  // Change password
  const handlePasswordChange = async () => {
    try {
      await axios.put(
        "http://localhost:5000/api/users/change-password",
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOldPassword("");
      setNewPassword("");
      alert("Password updated successfully!");
    } catch (err) {
      console.error("Error changing password:", err);
      alert(err.response?.data?.message || "Failed to update password");
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6 text-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6 text-center">
        <p>Unable to load profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>

      <div className="flex flex-col items-center mb-4">
        <img
          src={
            user.profileImage
              ? `data:${user.profileImageType};base64,${user.profileImage}`
              : "/default-avatar.png"
          }
          alt="profile"
          className="w-24 h-24 rounded-full mb-2 object-cover"
        />
        <input
          type="file"
          className="w-full p-2"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
      </div>

      <input
        type="text"
        className="w-full p-2 mb-4 border rounded"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        onClick={handleUpdate}
        className="w-full bg-blue-500 text-white py-2 rounded mb-6"
      >
        Update Profile
      </button>

      <h2 className="text-xl font-semibold mb-2">Change Password</h2>
      <input
        type="password"
        placeholder="Old Password"
        className="w-full p-2 mb-2 border rounded"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="New Password"
        className="w-full p-2 mb-4 border rounded"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button
        onClick={handlePasswordChange}
        className="w-full bg-red-500 text-white py-2 rounded mb-6"
      >
        Change Password
      </button>

      <h2 className="text-xl font-semibold mb-2">My Blogs</h2>
      {blogs.length > 0 ? (
        <ul className="space-y-2">
          {blogs.map((b) => (
            <li key={b._id} className="p-2 border rounded">
              {b.title}
            </li>
          ))}
        </ul>
      ) : (
        <p>No blogs yet</p>
      )}
    </div>
  );
}
