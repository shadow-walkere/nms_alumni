import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { User, Lock, ShieldCheck, ArrowLeft, AlertCircle } from "lucide-react";
import SERVER_URL from "../config";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(`${SERVER_URL}/api/admin/login`, {
        username,
        password,
      });

      if (response.data && response.data.token) {
        localStorage.setItem("adminToken", response.data.token);
        toast.success("Welcome back! Redirecting to dashboard...");
        navigate("/admin/dashboard");
      } else {
        setError("Invalid response format. Token missing.");
        toast.error("Login failed: token missing in response");
        console.error("Token missing in response");
      }
    } catch (err) {
      console.error("Login Error:", err.response || err);
      const msg =
        err.response?.data?.message || "Login failed due to server error";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleHome = () => {
    navigate("/");
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center bg-slate-900 overflow-hidden font-sans selection:bg-pink-500 selection:text-white mt-[-5rem] pt-4">

      {/* 🌌 Futuristic Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-600/30 rounded-full blur-[120px] animate-pulse-slow delay-1000"></div>
        <div className="absolute inset-0 bg-slate-900/[0.03] bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:20px_20px] opacity-20"></div>
      </div>

      {/* 🛡️ Login Card (Glassmorphism) */}
      <div className="relative z-10 w-full max-w-md px-6">

        {/* Back to Home Button */}
        <button
          onClick={handleHome}
          className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm font-medium"
        >
          <div className="p-2 bg-slate-800 rounded-full group-hover:bg-slate-700 transition-colors">
            <ArrowLeft size={16} />
          </div>
          Return to Website
        </button>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 sm:p-10 rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] relative overflow-hidden">

          {/* Subtle Card Top Glow */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-pink-500"></div>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner border border-slate-700">
              <ShieldCheck className="w-8 h-8 text-pink-400" />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">
              Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-400">Portal</span>
            </h2>
            <p className="text-slate-400 text-sm mt-2 font-medium">
              Secure access for authorized personnel
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                Username
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Enter admin username"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-slate-700 text-white rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-pink-400 transition-colors" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-slate-700 text-white rounded-xl focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all placeholder:text-slate-600 tracking-widest"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 text-red-400 bg-red-400/10 border border-red-400/20 p-3 rounded-lg text-sm">
                <AlertCircle size={16} className="shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-4 bg-gradient-to-r from-blue-600 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-pink-500/25 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? "Authenticating..." : "Sign In to Dashboard"}
            </button>
          </form>

          {/* Footer inside card */}
          <div className="mt-8 text-center border-t border-white/10 pt-6">
            <span className="text-slate-500 text-xs font-medium uppercase tracking-widest">
              © {new Date().getFullYear()} NMS Alumni Network
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;