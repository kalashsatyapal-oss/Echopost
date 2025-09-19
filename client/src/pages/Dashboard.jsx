import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/authSlice";
import { useNavigate, Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">Hello, {user?.name} 👋</h1>
      <p className="mb-6">Welcome to your dashboard</p>

      {/* Superadmin only button */}
      {user?.role === "superadmin" && (
        <Link to="/superadmin" className="mb-4 px-6 py-2 bg-purple-600 text-white rounded">
          Superadmin Dashboard
        </Link>
      )}

      <button
        className="px-6 py-2 bg-red-500 text-white rounded"
        onClick={() => {
          dispatch(logout());
          navigate("/login");
        }}
      >
        Logout
      </button>
    </div>
  );
}
