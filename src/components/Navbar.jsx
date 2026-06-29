import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "News & Events", path: "/events" },
    { name: "Contact Us", path: "/contact" },
    { name: "Gallery", path: "/Gallery" },
    { name: "Alumni Directory", path: "/alumni" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      onMouseMove={handleMouseMove}
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-gradient-to-b from-black/95 to-black/85 backdrop-blur-xl border-b border-yellow-500/30 py-3 shadow-2xl shadow-yellow-500/10"
          : "bg-gradient-to-b from-black to-black/95 py-6 border-b border-yellow-500/10"
      }`}
    >
      {/* Animated gradient background effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(234, 179, 8, 0.15), transparent 80%)`,
          transition: "all 0.3s ease-out",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative z-10">
        {/* LOGO - Enhanced */}
        <Link
          to="/"
          className="flex flex-col group cursor-pointer transform transition-all duration-300 hover:scale-105"
        >
          <div className="flex items-center gap-2">
            {/* Animated accent circle */}
            <div className="relative w-2.5 h-2.5 rounded-full bg-yellow-500 group-hover:bg-yellow-300 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-yellow-500/50 group-hover:scale-125" />
            <span className="text-lg font-black text-yellow-400 uppercase tracking-widest group-hover:text-yellow-300 transition-all duration-300 drop-shadow-lg">
              The Nambale Magnet School
            </span>
          </div>
          <span className="text-xs text-gray-500 font-semibold tracking-wide group-hover:text-yellow-400/70 transition-all duration-300 ml-5">
            Alumni Network
          </span>
        </Link>

        {/* DESKTOP LINKS - Enhanced */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-8 text-sm font-bold tracking-wide">
            {navLinks.map((link, index) => (
              <li
                key={link.name}
                style={{
                  animation: `slideInDown 0.5s ease-out ${index * 0.05}s both`,
                }}
              >
                <Link
                  to={link.path}
                  className={`relative px-3 py-2 group transition-all duration-300 ${
                    isActive(link.path)
                      ? "text-yellow-400"
                      : "text-gray-300 hover:text-yellow-300"
                  }`}
                >
                  {link.name}

                  {/* Enhanced underline with glow */}
                  <span
                    className={`absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent transition-all duration-500 ${
                      isActive(link.path)
                        ? "w-full opacity-100 shadow-lg shadow-yellow-400/50"
                        : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                    }`}
                  />

                  {/* Glow effect on hover */}
                  <span className="absolute inset-0 rounded-lg bg-yellow-400/0 group-hover:bg-yellow-400/10 transition-all duration-300" />
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA Buttons */}
          <div className="flex items-center gap-4 pl-6 border-l border-yellow-500/20">
            <Link
              to="/auth"
              className="relative group px-6 py-2.5 rounded-full text-sm font-extrabold overflow-hidden transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-yellow-400/40"
            >
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-300 group-hover:from-yellow-300 group-hover:to-yellow-400" />

              {/* Animated shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"
                  style={{
                    animation: "shimmer 2s infinite",
                  }}
                />
              </div>

              <span className="relative text-black flex items-center gap-2">
                Login
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </Link>
          </div>
        </div>

        {/* MOBILE MENU BUTTON - Enhanced */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden relative w-10 h-10 text-yellow-400 focus:outline-none flex items-center justify-center group"
        >
          <div className="absolute inset-0 bg-yellow-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <svg
            className={`w-6 h-6 transition-transform duration-300 ${
              isOpen ? "rotate-90" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* MOBILE MENU DROPDOWN - Enhanced */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-gradient-to-b from-zinc-900 to-black border-b border-yellow-500/20 backdrop-blur-xl shadow-2xl transition-all duration-400 overflow-hidden ${
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 invisible"
        }`}
      >
        <ul className="flex flex-col px-6 gap-3 py-6 text-center">
          {navLinks.map((link, index) => (
            <li
              key={link.name}
              style={{
                animation: isOpen ? `slideInDown 0.4s ease-out ${index * 0.08}s both` : "none",
              }}
            >
              <Link
                to={link.path}
                className={`block text-base font-bold py-3 px-4 rounded-lg transition-all duration-300 ${
                  isActive(link.path)
                    ? "bg-yellow-500/20 text-yellow-300 border-b-2 border-yellow-400"
                    : "text-gray-300 hover:bg-yellow-500/10 hover:text-yellow-300"
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}

{/* 
          <li>
            <Link
              to="/auth"
              className="block bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-8 py-3 rounded-full font-extrabold w-full hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/50"
            >
              Login / Register
            </Link>
          </li> */}
        </ul>
      </div>

      <style>{`
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </nav>
  );
}