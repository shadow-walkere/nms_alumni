import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect for the navbar background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Directory", path: "/alumni" },
    { name: "News & Events", path: "/events" },
    { name: "Contact Us", path: "/contact" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/95 backdrop-blur-md border-b border-yellow-500/20 py-3 shadow-lg shadow-yellow-500/5"
          : "bg-black py-5 border-b border-zinc-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="flex flex-col group">
          <span className="text-xl font-extrabold text-yellow-500 uppercase tracking-widest group-hover:text-yellow-400 transition-colors">
            The Nambale Magnet School
          </span>
          <span className="text-xs text-gray-400 font-semibold tracking-normal group-hover:text-gray-300 transition-colors">
            Alumni Network
          </span>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-8 text-sm font-bold tracking-wide">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className={`relative pb-1 transition-colors duration-300 ${
                    isActive(link.path)
                      ? "text-yellow-500"
                      : "text-gray-300 hover:text-yellow-400"
                  }`}
                >
                  {link.name}
                  {/* Underline Animation */}
                  <span
                    className={`absolute left-0 bottom-0 h-[2px] bg-yellow-500 transition-all duration-300 ${
                      isActive(link.path) ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                    style={{ 
                      width: isActive(link.path) ? "100%" : "0%",
                      transition: "width 0.3s ease"
                    }}
                    // Adding a generic hover fix since group-hover needs a parent 'group' class. 
                    // To keep it simple, we'll rely on the CSS below.
                  ></span>
                  <style>{`
                    a:hover span { width: 100% !important; }
                  `}</style>
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4 pl-6 border-l border-zinc-800">
            <Link
              to="/donations"
              className="text-sm font-bold text-gray-300 hover:text-yellow-500 transition-colors"
            >
              Donate
            </Link>
            <Link
              to="/auth"
              className="bg-yellow-500 text-black px-6 py-2 rounded-full text-sm font-extrabold hover:bg-yellow-400 hover:scale-105 hover:shadow-[0_0_15px_rgba(234,179,8,0.4)] transition-all duration-300"
            >
              Login
            </Link>
          </div>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-yellow-500 focus:outline-none p-2"
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-zinc-950 border-b border-yellow-500/20 shadow-2xl transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-96 py-4 opacity-100" : "max-h-0 py-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col px-6 gap-4 text-center">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                to={link.path}
                className={`block text-lg font-bold py-2 ${
                  isActive(link.path) ? "text-yellow-500" : "text-gray-300"
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
          <li className="pt-4 border-t border-zinc-800">
            <Link
              to="/donations"
              className="block text-lg font-bold text-gray-300 py-2"
            >
              Donate
            </Link>
          </li>
          <li>
            <Link
              to="/auth"
              className="inline-block bg-yellow-500 text-black px-8 py-3 rounded-full font-extrabold w-full"
            >
              Login / Register
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}