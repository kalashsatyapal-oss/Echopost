import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export default function SuperadminDashboard() {
  const [requests, setRequests] = useState([]);
  const { token } = useSelector((s) => s.auth);

  useEffect(() => {
    axios.get("http://localhost:5000/api/superadmin/requests", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setRequests(res.data));
  }, []);

  const handleAction = async (id, action) => {
    await axios.post(`http://localhost:5000/api/superadmin/${action}/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const res = await axios.get("http://localhost:5000/api/superadmin/requests", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setRequests(res.data);
  };

  const pending = requests.filter(r => r.status === "pending");
  const accepted = requests.filter(r => r.status === "accepted");
  const rejected = requests.filter(r => r.status === "rejected");

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Superadmin Dashboard</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Pending Requests</h2>
        {pending.length === 0 ? <p>No pending requests</p> : (
          pending.map(r => (
            <div key={r._id} className="p-4 bg-gray-100 rounded mb-2 flex justify-between">
              <span>{r.name} ({r.email})</span>
              <div>
                <button onClick={() => handleAction(r._id, "approve")} className="px-4 py-1 bg-green-500 text-white rounded mr-2">Approve</button>
                <button onClick={() => handleAction(r._id, "reject")} className="px-4 py-1 bg-red-500 text-white rounded">Reject</button>
              </div>
            </div>
          ))
        )}
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Accepted Requests</h2>
        {accepted.map(r => (
          <div key={r._id} className="p-4 bg-green-100 rounded mb-2">
            {r.name} ({r.email})
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Rejected Requests</h2>
        {rejected.map(r => (
          <div key={r._id} className="p-4 bg-red-100 rounded mb-2">
            {r.name} ({r.email})
          </div>
        ))}
      </section>
    </div>
  );
}
