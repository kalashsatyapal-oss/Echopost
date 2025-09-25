import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(loginUser(form));
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 via-blue-50 to-indigo-200 text-gray-800 flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <div className="flex items-center">
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
        <div>
          <a
            href="/login"
            className="px-4 py-2 mr-4 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-500 transition"
            aria-label="Login"
          >
            Login
          </a>
          <a
            href="/register"
            className="px-4 py-2 bg-teal-500 text-white rounded-lg shadow hover:bg-teal-400 transition"
            aria-label="Register"
          >
            Register
          </a>
        </div>
      </header>
      {/* Main Content */}
      <main className="flex flex-col items-center justify-center flex-grow px-4">
        <form onSubmit={handleSubmit} className="bg-white bg-opacity-80 p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6 text-indigo-700 text-center">Login</h2>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 mb-4 border rounded"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-4 border rounded"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button className="w-full bg-gradient-to-r from-indigo-600 to-teal-500 text-white py-2 rounded shadow-lg hover:scale-105 transition font-semibold">
            Login
          </button>
        </form>
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