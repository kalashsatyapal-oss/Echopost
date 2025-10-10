import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ManageUsers from "../components/ManageUsers";
import EditGuidelines from "../components/EditGuidelines";
import { useNavigate } from "react-router-dom";

export default function SuperAdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalBlogs: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

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
    const interval = setInterval(fetchRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500 mr-3"></div>
        Loading dashboard...
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Main Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold text-purple-700 tracking-tight">
              EchoPost
            </h1>
            <p className="text-lg text-gray-600 mt-1 font-medium">
              SuperAdmin Dashboard
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            🏠 Go to Dashboard
          </button>
        </div>

        {/* Navbar below header */}
        <nav className="border-t border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 py-2 flex gap-6">
            {["dashboard", "users", "guidelines"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative pb-1 transition-colors ${
                  activeTab === tab
                    ? "text-purple-600 font-semibold"
                    : "text-gray-600 hover:text-purple-600"
                }`}
              >
                {tab === "dashboard" && "🏠 Dashboard"}
                {tab === "users" && "👤 Manage Users"}
                {tab === "guidelines" && "🛠️ Edit Guidelines"}
                {activeTab === tab && (
                  <span className="absolute left-0 bottom-0 w-full h-0.5 bg-purple-600 rounded"></span>
                )}
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 pb-10">
        {activeTab === "dashboard" && (
          <>
            {/* Stats Section */}
            <div className="grid md:grid-cols-2 gap-6 mt-6 mb-10">
              <div className="bg-purple-100 p-6 rounded-xl shadow flex items-center gap-4">
                <div className="text-purple-600 text-4xl">👥</div>
                <div>
                  <h2 className="text-lg font-semibold text-purple-800">
                    Total Users
                  </h2>
                  <p className="text-3xl font-bold">{stats.totalUsers}</p>
                </div>
              </div>
              <div className="bg-blue-100 p-6 rounded-xl shadow flex items-center gap-4">
                <div className="text-blue-600 text-4xl">📝</div>
                <div>
                  <h2 className="text-lg font-semibold text-blue-800">
                    Total Blogs
                  </h2>
                  <p className="text-3xl font-bold">{stats.totalBlogs}</p>
                </div>
              </div>
            </div>

            {/* Admin Requests */}
            <div className="flex items-center gap-2 mt-10 mb-4">
              <span className="text-2xl font-semibold text-gray-800">
                📥 Admin Requests
              </span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {requests.length === 0 ? (
              <p className="text-gray-500">No requests found.</p>
            ) : (
              <div className="space-y-4">
                {requests.map((r) => (
                  <div
                    key={r._id}
                    className="p-4 bg-white border rounded-lg shadow flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">{r.name}</p>
                      <p className="text-sm text-gray-600">{r.email}</p>
                      <span
                        className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
                          r.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : r.status === "accepted"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {r.status}
                      </span>
                    </div>

                    {r.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          className="px-4 py-1.5 bg-green-500 text-white rounded hover:bg-green-600"
                          onClick={() => handleUpdate(r._id, "accepted")}
                        >
                          Accept
                        </button>
                        <button
                          className="px-4 py-1.5 bg-red-500 text-white rounded hover:bg-red-600"
                          onClick={() => handleUpdate(r._id, "rejected")}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "users" && (
          <div className="mt-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              👤 Manage Users
            </h2>
            <ManageUsers />
          </div>
        )}

        {activeTab === "guidelines" && (
          <div className="mt-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              🛠️ Edit Guidelines
            </h2>
            <EditGuidelines />
          </div>
        )}
      </div>
    </div>
  );
}
