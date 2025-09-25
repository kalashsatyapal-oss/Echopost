import { useState } from "react";
import { useDispatch } from "react-redux";
import { register } from "../redux/authSlice.js";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await dispatch(register({ name, email, password }));

      if (result.meta.requestStatus === "fulfilled") {
        setSuccessMessage("✅ Registered successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login"); // redirect to login after 2s
        }, 2000);
      } else {
        setSuccessMessage("❌ Registration failed. Please try again.");
      }
    } catch (error) {
      setSuccessMessage("❌ Something went wrong.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white rounded shadow-md w-96"
      >
        <h1 className="text-2xl font-bold mb-4">Register</h1>

        {successMessage && (
          <div className="mb-4 text-center text-sm font-medium text-green-600">
            {successMessage}
          </div>
        )}

        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 mb-4 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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

        <button className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
          Register
        </button>
      </form>
    </div>
  );
}
