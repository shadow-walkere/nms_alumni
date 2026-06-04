import React, { useState } from "react";
import { NavLink, Outlet, Navigate } from "react-router-dom";
import {
  Users,
  MailCheck,
  BookOpenText,
  MessageCircle,
  GalleryThumbnails,
  CreditCard,
  Calendar,
  ShoppingBag,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin";
  };

  return (
    <div className="flex h-screen font-inter text-white mt-[-5rem]">
      {/* ─────────── Sidebar ─────────── */}
      <aside
        className={`bg-slate-900 border-r border-slate-800 fixed md:relative z-20 top-0 h-full w-64 p-5 
        transition-transform duration-300 overflow-y-auto  /* 👈 scrollable sidebar */
        ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo + Mobile Close Button */}
        <div className="flex items-center justify-between mb-10 mt-6 md:mt-0">
          <div className="flex items-center gap-3">
            <img
              src="../../TVA_logo.jpeg"
              alt="TVA Logo"
              className="w-9 h-9 rounded-full border-2 border-pink-500 object-cover shadow-[0_0_10px_rgba(236,72,153,0.5)]"
            />
            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-400">
              TVA
            </h2>
          </div>

          {/* Close button (mobile) */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden hover:text-pink-400 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* ─────────── Nav Links ─────────── */}
        <nav>
          <ul className="space-y-4 pb-8">
            {/* Each NavLink closes sidebar on mobile */}
            {[
              {
                to: "visitors",
                label: "Visitor Details",
                icon: <Users className="w-5 h-5" />,
              },
              {
                to: "registration",
                label: "Registrations",
                icon: <MailCheck className="w-5 h-5" />,
              },
              // {
              //   to: "tracker",
              //   label: "Tracker",
              //   icon: <MailCheck className="w-5 h-5" />,
              // },
              {
                to: "news-updates",
                label: "News & Updates",
                icon: <BookOpenText className="w-5 h-5" />,
              },
              {
                to: "donations",
                label: "Donations",
                icon: <MessageCircle className="w-5 h-5" />,
              },
              {
                to: "resources",
                label: "Resources Hub",
                icon: <Calendar className="w-5 h-5" />,
              },
              {
                to: "gallery",
                label: " Gallery",
                icon: <CreditCard className="w-5 h-5" />,
              },
              {
                to: "testimonials",
                label: "Testimonials",
                icon: <ShoppingBag className="w-5 h-5" />,
              },
              {
                to: "leaders",
                label: "Leaders",
                icon: <GalleryThumbnails className="w-5 h-5" />,
              },
              // {
              //   to: "honor-themes",
              //   label: "Honor Themes",
              //   icon: <Mic className="w-5 h-5" />,
              // },
            ].map((item, i) => (
              <li key={i}>
                <NavLink
                  to={item.to}
                  onClick={() => setIsSidebarOpen(false)} // 👈 closes on mobile
                  className={({ isActive }) =>
                    `flex items-center gap-3 text-lg font-medium transition-colors duration-200 px-3 py-2 rounded-xl
                    ${isActive ? "bg-white/10 text-pink-400 shadow-[inset_0_0_10px_rgba(236,72,153,0.1)]" : "text-slate-400 hover:text-blue-400 hover:bg-slate-800/50"}`
                  }
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              </li>
            ))}

            {/* Logout */}
            <li className="pt-4 border-t border-slate-800">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 text-lg font-medium px-3 py-2 w-full text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-colors duration-200"
              >
                <LogOut className="w-5 h-5" />
                Log Out
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* ─────────── Main Content ─────────── */}
      <main
        className={`flex-1 bg-slate-50 text-slate-900 p-6 pt-20 md:pt-6 transition-all duration-300 overflow-y-auto`}
      >
        <div className="flex items-center justify-between mb-6 md:hidden mt-[-2rem]">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-pink-600">
            Admin Dashboard
          </h1>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-slate-600 hover:text-pink-500 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <Outlet />
      </main>
    </div>
  );
};

export const AdminRoutes = () => <Navigate to="products" replace />;

export default AdminDashboard;