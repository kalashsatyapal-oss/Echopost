import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import Swal from "sweetalert2";
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf } from "react-icons/fa";

export default function SuperAdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalBlogs: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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
    const confirm = await Swal.fire({
      title: `Confirm ${status}?`,
      text: `Are you sure you want to ${status} this request?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axios.put(
        `http://localhost:5000/api/admin-requests/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
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
    const interval = setInterval(fetchRequests, 5000); // auto refresh
    return () => clearInterval(interval);
  }, []);

  const filteredRequests = requests.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">SuperAdmin Dashboard</h1>
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Skeleton height={100} />
          <Skeleton height={100} />
        </div>
        <Skeleton count={5} />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">SuperAdmin Dashboard</h1>

      {/* ✅ Stats Section */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 shadow rounded-xl border">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">Total Users</h2>
          <p className="text-3xl font-bold text-purple-600">{stats.totalUsers}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-xl border">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">Total Blogs</h2>
          <p className="text-3xl font-bold text-purple-600">{stats.totalBlogs}</p>
        </div>
      </div>

      {/* ✅ Admin Requests Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Admin Requests</h2>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={fetchRequests}
        >
          Refresh
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by name or email..."
        className="mb-4 p-2 border rounded w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredRequests.length === 0 && (
        <p className="text-gray-500">No matching requests found.</p>
      )}

      <div className="space-y-3">
        {filteredRequests.map((r) => (
          <div
            key={r._id}
            className="p-3 bg-white border rounded-lg flex justify-between items-center shadow-sm"
          >
            <div>
              <p className="font-semibold text-gray-800">
                {r.name} ({r.email})
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                Status:{" "}
                {r.status === "pending" && <FaHourglassHalf className="text-yellow-500" />}
                {r.status === "accepted" && <FaCheckCircle className="text-green-500" />}
                {r.status === "rejected" && <FaTimesCircle className="text-red-500" />}
                <span className="font-semibold capitalize">{r.status}</span>
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