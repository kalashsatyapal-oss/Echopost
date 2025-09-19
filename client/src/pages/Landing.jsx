import React from "react";
import logo from "../assets/logo.png"; // Make sure the logo image exists at this path
import { FaUserEdit, FaLock, FaUsers } from "react-icons/fa"; // Feature icons
import { FaTwitter, FaFacebook, FaInstagram } from "react-icons/fa"; // Social icons

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 via-blue-50 to-indigo-200 text-gray-800 flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <div className="flex items-center">
          <img
            src={logo}
            alt="EchoPost Logo"
            className="h-20 w-40 mr-4 rounded-xl shadow-lg object-contain bg-white" // Improved size, shape, and added object-contain and bg-white for modern look
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
        <h1 className="text-5xl font-extrabold mb-2 text-indigo-700 text-center">
          Welcome to EchoPost
        </h1>
        <div className="mb-6 text-lg text-teal-700 font-semibold text-center">
          The modern blogging platform for creative minds.
        </div>
        {/* Features with icons */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex flex-col items-center bg-white bg-opacity-70 rounded-xl p-4 shadow hover:scale-105 transition">
            <FaUserEdit className="text-3xl text-teal-500 mb-2" />
            <span className="font-semibold text-gray-700">Profile Customization</span>
            <span className="text-gray-500 text-sm text-center">Personalize your profile and blog appearance</span>
          </div>
          <div className="flex flex-col items-center bg-white bg-opacity-70 rounded-xl p-4 shadow hover:scale-105 transition">
            <FaLock className="text-3xl text-indigo-500 mb-2" />
            <span className="font-semibold text-gray-700">Secure Authentication</span>
            <span className="text-gray-500 text-sm text-center">Robust security for your account and posts</span>
          </div>
          <div className="flex flex-col items-center bg-white bg-opacity-70 rounded-xl p-4 shadow hover:scale-105 transition">
            <FaUsers className="text-3xl text-pink-400 mb-2" />
            <span className="font-semibold text-gray-700">Community</span>
            <span className="text-gray-500 text-sm text-center">Connect and interact with a vibrant community</span>
          </div>
        </div>
        {/* Testimonial */}
        <blockquote className="mb-8 max-w-lg text-center italic text-gray-600">
          "EchoPost helped me share my stories and connect with amazing people. The customization and security features are top-notch!"
          <br />
          <span className="font-semibold text-indigo-600">— A Happy Blogger</span>
        </blockquote>
        <a
          href="/login"
          className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-teal-500 text-white rounded-lg shadow-lg hover:scale-105 transition font-semibold text-lg"
        >
          Get Started
        </a>
        <div className="mt-4 text-teal-700 font-medium">
          Start your blog today!
        </div>
      </main>
      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 text-sm flex flex-col items-center gap-2">
        <div className="flex gap-4 justify-center mb-2">
          <a href="https://twitter.com" aria-label="Twitter" className="hover:text-indigo-500">
            <FaTwitter />
          </a>
          <a href="https://facebook.com" aria-label="Facebook" className="hover:text-indigo-500">
            <FaFacebook />
          </a>
          <a href="https://instagram.com" aria-label="Instagram" className="hover:text-indigo-500">
            <FaInstagram />
          </a>
        </div>
        <span>
          &copy; {new Date().getFullYear()} EchoPost. All rights reserved.
        </span>
      </footer>
    </div>
  );
}