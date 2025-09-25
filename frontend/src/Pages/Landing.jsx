import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-purple-100 text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to EchoPost 📝</h1>
      <p className="text-lg text-gray-600 mb-8">
        Share your thoughts, explore blogs, and connect with others.
      </p>
      <div className="flex gap-4">
        <Link
          to="/login"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
