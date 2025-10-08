import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ManageUsers from "../components/ManageUsers";

export default function SuperAdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalBlogs: 0 });
  const [loading, setLoading] = useState(true);

  // ✅ Fetch admin requests
  const fetchRequests = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin-requests", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching admin requests:", err);
    }
  };

  // ✅ Fetch system stats
  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/stats", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle admin request status change
  const handleUpdate = async (id, status) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/admin-requests/${id}`,
        { status },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success(`Request ${status}`);
      setRequests((prev) => prev.map((r) => (r._id === id ? res.data : r)));
    } catch (err) {
      console.error(err);
      toast.error("Failed to update request");
    }
  };

  useEffect(() => {
    fetchStats();
    fetchRequests();
    const interval = setInterval(fetchRequests, 5000); // auto refresh requests
    return () => clearInterval(interval);
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading dashboard...
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        SuperAdmin Dashboard
      </h1>

      {/* ✅ Stats Section */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 shadow rounded-xl border">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">
            Total Users
          </h2>
          <p className="text-3xl font-bold text-purple-600">
            {stats.totalUsers}
          </p>
        </div>
        <div className="bg-white p-4 shadow rounded-xl border">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">
            Total Blogs
          </h2>
          <p className="text-3xl font-bold text-purple-600">
            {stats.totalBlogs}
          </p>
        </div>
      </div>
      {/* Manage Users Section */}
      <ManageUsers />
      {/* ✅ Admin Requests Section */}
      <h2 className="text-2xl font-semibold mb-4">Admin Requests</h2>
      {requests.length === 0 && (
        <p className="text-gray-500">No requests found.</p>
      )}

      <div className="space-y-3">
        {requests.map((r) => (
          <div
            key={r._id}
            className="p-3 bg-white border rounded-lg flex justify-between items-center shadow-sm"
          >
            <div>
              <p className="font-semibold text-gray-800">
                {r.name} ({r.email})
              </p>
              <p className="text-sm text-gray-600">
                Status:{" "}
                <span
                  className={
                    r.status === "pending"
                      ? "text-yellow-500 font-semibold"
                      : r.status === "accepted"
                      ? "text-green-500 font-semibold"
                      : "text-red-500 font-semibold"
                  }
                >
                  {r.status}
                </span>
              </p>
            </div>

            {r.status === "pending" && (
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={() => handleUpdate(r._id, "accepted")}
                >
                  Accept
                </button>
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => handleUpdate(r._id, "rejected")}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
