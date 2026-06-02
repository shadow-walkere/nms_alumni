import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Lock, Loader2, ArrowRight, Home as HomeIcon } from "lucide-react";

const SERVER_URL = "http://localhost:5000";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${SERVER_URL}/api/admin/login`, {
        username,
        password,
      });

      if (response.data && response.data.token) {
        localStorage.setItem("adminToken", response.data.token);
        navigate("/admin/dashboard");
      } else {
        setError("Invalid response format. Token missing.");
      }
    } catch (err) {
      setError(
        err.response?.data?.error || 
        err.response?.data?.message || 
        "Login failed due to server error. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black font-sans text-gray-300 p-4 selection:bg-yellow-500 selection:text-black relative overflow-hidden">
      
      {/* Background Texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none z-0"></div>
      
      {/* Glowing background blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500/10 blur-[100px] rounded-full pointer-events-none z-0"></div>

      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        {/* Branding */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
            NMS <span className="text-yellow-500">Admin</span>
          </h1>
          <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">
            Secure Portal Access
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-8">
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium p-4 rounded-lg mb-6 flex items-center gap-3 animate-fade-in">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin_user"
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-11 pr-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-11 pr-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-500 text-black font-extrabold px-6 py-3.5 rounded-lg hover:bg-yellow-400 transition-all duration-300 shadow-[0_0_15px_rgba(234,179,8,0.2)] hover:shadow-[0_0_25px_rgba(234,179,8,0.3)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Login to Dashboard
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
        
        {/* Footer Actions */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <button 
            onClick={handleHome} 
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-yellow-500 transition-colors font-medium"
          >
            <HomeIcon className="w-4 h-4" />
            Return to Public Site
          </button>
          <p className="text-xs text-zinc-600 font-medium tracking-wide">
            &copy; 2026 Nambale Magnet School. Admin Access Only.
          </p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
      `}} />
    </div>
  );
};

export default AdminLogin;