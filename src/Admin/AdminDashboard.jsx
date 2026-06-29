import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Image as ImageIcon,
  CalendarDays,
  Briefcase,
  HeartHandshake,
  MessageSquareQuote,
  LogOut,
  Menu,
  X,
  GraduationCap
} from "lucide-react";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin";
  };

  const navItems = [
    { to: "users", label: "Visitor Details", icon: <Users className="w-5 h-5" /> },

    { to: "alumni", label: "Manage Alumni Directory", icon: <Users className="w-5 h-5" /> },
    { to: "gallery", label: "Manage Gallery", icon: <ImageIcon className="w-5 h-5" /> },
    { to: "events", label: "Manage Events & News", icon: <CalendarDays className="w-5 h-5" /> },
    { to: "mentorships", label: "Mentorships", icon: <Briefcase className="w-5 h-5" /> },
    // { to: "donations", label: "Donations", icon: <HeartHandshake className="w-5 h-5" /> },
    { to: "testimonials", label: "Testimonials", icon: <MessageSquareQuote className="w-5 h-5" /> },
    { to: "faqs", label: "Manage FAQ", icon: <MessageSquareQuote className="w-5 h-5" /> },
  ];

  return (
    <div className="flex h-screen bg-black font-sans text-gray-300 overflow-hidden selection:bg-yellow-500 selection:text-black">

      {/* ─────────── Mobile Backdrop ─────────── */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ─────────── Sidebar ─────────── */}
      <aside
        className={`bg-zinc-950 border-r border-zinc-800 fixed md:relative z-30 top-0 h-full w-72 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Logo & Branding */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.3)]">
              <GraduationCap className="w-6 h-6 text-black" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight leading-tight">
                NMS <span className="text-yellow-500">Alumni</span>
              </h2>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Admin Portal</p>
            </div>
          </div>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-2 text-gray-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-6 px-4">
          <ul className="space-y-2">
            {navItems.map((item, i) => (
              <li key={i}>
                <NavLink
                  to={item.to}
                  onClick={() => setIsSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 font-medium transition-all duration-200 px-4 py-3 rounded-xl
                    ${isActive
                      ? "bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                      : "text-gray-400 hover:text-white hover:bg-zinc-900"
                    }`
                  }
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-zinc-800 shrink-0 bg-zinc-950">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-3 font-bold px-4 py-3 w-full text-red-500 hover:text-white hover:bg-red-500 rounded-xl transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            Secure Logout
          </button>
        </div>
      </aside>

      {/* ─────────── Main Content Area ─────────── */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-black relative">

        {/* Subtle Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>

        {/* Mobile Header */}
        <header className="h-20 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 flex items-center justify-between px-6 md:hidden sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-6 h-6 text-yellow-500" />
            <h1 className="text-lg font-bold text-white">Dashboard</h1>
          </div>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-gray-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Dynamic Outlet Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto w-full animate-fade-in-up">
            <Outlet />
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fade-in-up { 
          from { opacity: 0; transform: translateY(10px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        .animate-fade-in-up { animation: fade-in-up 0.4s ease-out forwards; }
      `}} />
    </div>
  );
};

export default AdminDashboard;