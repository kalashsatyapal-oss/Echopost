import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice.js";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // ✅ success/error message
  const [isError, setIsError] = useState(false); // ✅ to style error vs success

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(login({ email, password }));

      if (result.meta.requestStatus === "fulfilled") {
        setIsError(false);
        setMessage("✅ Login successful! Redirecting to dashboard...");
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000); // wait 2 seconds before redirect
      } else {
        setIsError(true);
        setMessage("❌ Login failed. Please check your credentials.");
      }
    } catch (error) {
      setIsError(true);
      setMessage("❌ Something went wrong during login.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        className="p-6 bg-white rounded shadow-md w-96"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold mb-4">Login</h1>

        {message && (
          <div
            className={`mb-4 text-center text-sm font-medium ${
              isError ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Login
        </button>
      </form>
    </div>
  );
}
