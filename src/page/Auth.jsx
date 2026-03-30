import React, { useState } from "react";
import axios from "axios";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    year: "",
    profession: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = isLogin
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/auth/signup";

      const res = await axios.post(url, form);

      alert(res.data.message || "Success");

      // Save token (for later use)
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

    } catch (err) {
      alert(err.response?.data?.message || "Error occurred");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">

        {/* TOGGLE */}
        <div className="flex justify-between mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`w-1/2 py-2 rounded-l-lg ${
              isLogin ? "bg-blue-900 text-white" : "bg-gray-200"
            }`}
          >
            Login
          </button>

          <button
            onClick={() => setIsLogin(false)}
            className={`w-1/2 py-2 rounded-r-lg ${
              !isLogin ? "bg-yellow-500 text-black" : "bg-gray-200"
            }`}
          >
            Sign Up
          </button>
        </div>

        <h2 className="text-2xl font-bold text-center text-blue-900">
          {isLogin ? "Welcome Back" : "Join NMS Alumni"}
        </h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">

          {!isLogin && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="w-full border px-4 py-2 rounded-lg"
                onChange={handleChange}
              />

              <input
                type="text"
                name="year"
                placeholder="Graduation Year"
                className="w-full border px-4 py-2 rounded-lg"
                onChange={handleChange}
              />

              <input
                type="text"
                name="profession"
                placeholder="Profession"
                className="w-full border px-4 py-2 rounded-lg"
                onChange={handleChange}
              />
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border px-4 py-2 rounded-lg"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border px-4 py-2 rounded-lg"
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className={`w-full py-2 rounded-lg font-semibold ${
              isLogin
                ? "bg-blue-900 text-white"
                : "bg-yellow-500 text-black"
            }`}
          >
            {isLogin ? "Login" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}