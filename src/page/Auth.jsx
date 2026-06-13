import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import SERVER_URL from "../config";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    year: "",
    profession: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear status when user starts typing again
    if (status.message) setStatus({ type: "", message: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const url = isLogin
        ? `${SERVER_URL}/api/auth/login`
        : `${SERVER_URL}/api/auth/signup`;

      const res = await axios.post(url, form);

      setStatus({
        type: "success",
        message: res.data.message || (isLogin ? "Login successful!" : "Account created successfully!"),
      });

      // Save token (for later use)
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        
        // Optional: Redirect user after successful login
        // setTimeout(() => navigate("/"), 1500); 
      }

    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.message || "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-black text-gray-300 font-sans selection:bg-yellow-500 selection:text-black">
      
      {/* LEFT PANEL: Image & Branding (Hidden on small screens) */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden border-r border-yellow-500/20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
        
        <div className="relative z-10 p-12 max-w-lg text-center animate-fade-in-up">
          <h1 className="text-4xl font-extrabold text-white mb-4 tracking-wide">
            Welcome to the <br />
            <span className="text-yellow-500">NMS Alumni Network</span>
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed">
            Connect with generations of excellence. Mentor the youth, expand your professional network, and give back to the community that shaped you.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL: Authentication Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.8)] relative z-10">
          
          {/* Mobile Only Header */}
          <div className="lg:hidden text-center mb-8">
            <h2 className="text-2xl font-extrabold text-white uppercase tracking-widest">
              NMS <span className="text-yellow-500">Alumni</span>
            </h2>
          </div>

          {/* TOGGLE BUTTONS */}
          <div className="flex p-1 bg-zinc-900 rounded-xl mb-8 border border-zinc-800">
            <button
              type="button"
              onClick={() => { setIsLogin(true); setStatus({ type: "", message: "" }); }}
              className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all duration-300 ${
                isLogin 
                  ? "bg-yellow-500 text-black shadow-md" 
                  : "text-gray-500 hover:text-white"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => { setIsLogin(false); setStatus({ type: "", message: "" }); }}
              className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all duration-300 ${
                !isLogin 
                  ? "bg-yellow-500 text-black shadow-md" 
                  : "text-gray-500 hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>

          <h2 className="text-3xl font-bold text-white mb-2 text-center">
            {isLogin ? "Welcome Back" : "Create an Account"}
          </h2>
          <p className="text-gray-500 text-sm text-center mb-6">
            {isLogin ? "Enter your credentials to access your account." : "Join our community and stay connected."}
          </p>

          {/* STATUS ALERTS */}
          {status.message && (
            <div className={`mb-6 p-4 rounded-xl text-sm font-bold flex items-center gap-3 border animate-fade-in ${
              status.type === "success" 
                ? "bg-green-950/40 text-green-400 border-green-900/50" 
                : "bg-red-950/40 text-red-400 border-red-900/50"
            }`}>
              {status.type === "success" 
                ? <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                : <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              }
              <span>{status.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* SIGNUP ONLY FIELDS */}
            {!isLogin && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <label className="text-xs uppercase tracking-widest font-bold text-gray-500 ml-1 mb-2 block">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    placeholder="e.g. John Doe"
                    className="w-full px-5 py-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all placeholder-zinc-600"
                    onChange={handleChange}
                    required={!isLogin}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-widest font-bold text-gray-500 ml-1 mb-2 block">Class Of</label>
                    <input
                      type="number"
                      name="year"
                      value={form.year}
                      placeholder="e.g. 2018"
                      className="w-full px-5 py-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all placeholder-zinc-600"
                      onChange={handleChange}
                      required={!isLogin}
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest font-bold text-gray-500 ml-1 mb-2 block">Profession</label>
                    <input
                      type="text"
                      name="profession"
                      value={form.profession}
                      placeholder="e.g. Engineer"
                      className="w-full px-5 py-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all placeholder-zinc-600"
                      onChange={handleChange}
                      required={!isLogin}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* UNIVERSAL FIELDS */}
            <div>
              <label className="text-xs uppercase tracking-widest font-bold text-gray-500 ml-1 mb-2 block">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                placeholder="you@example.com"
                className="w-full px-5 py-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all placeholder-zinc-600"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 ml-1 mr-1">
                <label className="text-xs uppercase tracking-widest font-bold text-gray-500">Password</label>
                {isLogin && (
                  <Link to="/forgot-password" className="text-xs font-bold text-yellow-500 hover:text-yellow-400 transition-colors">
                    Forgot Password?
                  </Link>
                )}
              </div>
              <input
                type="password"
                name="password"
                value={form.password}
                placeholder="••••••••"
                className="w-full px-5 py-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all placeholder-zinc-600"
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-500 text-black py-4 rounded-xl font-extrabold text-lg hover:bg-yellow-400 transform active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(234,179,8,0.2)] flex justify-center items-center gap-2 mt-4"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full" viewBox="0 0 24 24"></svg>
                  Processing...
                </>
              ) : (
                isLogin ? "Sign In" : "Create Account"
              )}
            </button>
          </form>

          {/* BACK TO HOME */}
          <div className="mt-8 text-center">
            <Link to="/" className="text-sm font-medium text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              Back to Home
            </Link>
          </div>

        </div>
      </div>

      {/* Custom Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
      `}} />
    </div>
  );
}