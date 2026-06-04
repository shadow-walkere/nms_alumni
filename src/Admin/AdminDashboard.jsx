// import React, { useState } from "react";
// import { NavLink, Outlet, Navigate, Link } from "react-router-dom";
// import {
//   TrendingUp,
//   Image as GalleryIcon,
//   HelpCircle,
//   MessageSquare,
//   LogOut,
//   Menu,
//   X,
// } from "lucide-react";

// export default function AdminDashboard() {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   const handleLogout = () => {
//     localStorage.removeItem("adminToken");
//     window.location.href = "/admin";
//   };

//   const navItems = [
//     { name: "Dashboard", path: "/admin/dashboard", icon: TrendingUp },
//     { name: "Gallery", path: "/admin/gallery", icon: GalleryIcon },
//     { name: "FAQs", path: "/admin/faqs", icon: HelpCircle },
//     { name: "Testimonials", path: "/admin/testimonials", icon: MessageSquare },
//   ];

//   return (
//     <div className="flex h-screen font-sans text-gray-300 bg-black selection:bg-yellow-500 selection:text-black overflow-hidden relative">
      
//       {/* ────────────────── Mobile Overlay ────────────────── */}
//       {isSidebarOpen && (
//         <div 
//           className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden animate-fade-in"
//           onClick={() => setIsSidebarOpen(false)}
//         ></div>
//       )}

//       {/* ────────────────── Sidebar ────────────────── */}
//       <aside
//         className={`bg-zinc-950 border-r border-zinc-900 fixed md:relative z-50 top-0 h-full w-64 flex flex-col transition-transform duration-300 ease-in-out shrink-0
//         ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
//       >
//         {/* Header / Logo */}
//         <div className="p-6 border-b border-zinc-900 flex items-center justify-between shrink-0">
//           <div>
//             <Link to="/" className="text-2xl font-extrabold text-white tracking-tight hover:text-yellow-500 transition-colors block">
//               NMS <span className="text-yellow-500">Admin</span>
//             </Link>
//             <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest font-bold">Command Center</p>
//           </div>
          
//           {/* Close button (mobile) */}
//           <button
//             onClick={() => setIsSidebarOpen(false)}
//             className="md:hidden text-gray-500 hover:text-yellow-500 transition-colors p-1 bg-zinc-900 rounded-md"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Navigation Links */}
//         <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto no-scrollbar">
//           {navItems.map((item) => (
//             <NavLink
//               key={item.name}
//               to={item.path}
//               end={item.name === "Dashboard"} // Prevents dashboard from always staying active
//               onClick={() => setIsSidebarOpen(false)} // Close sidebar on mobile after clicking
//               className={({ isActive }) =>
//                 `w-full text-left px-4 py-3 rounded-lg font-bold text-sm transition-all duration-300 flex items-center gap-3 ${
//                   isActive
//                     ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.05)]"
//                     : "text-gray-400 hover:bg-zinc-900 hover:text-white border border-transparent"
//                 }`
//               }
//             >
//               <item.icon className="w-4 h-4 shrink-0" />
//               {item.name}
//             </NavLink>
//           ))}
//         </nav>

//         {/* Footer / User Profile & Logout */}
//         <div className="p-6 border-t border-zinc-900 shrink-0">
//           <div className="flex items-center gap-3 mb-4">
//             <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden shrink-0">
//               <img src="https://i.pravatar.cc/150?img=33" alt="Admin Avatar" className="w-full h-full object-cover" />
//             </div>
//             <div>
//               <p className="text-sm font-bold text-white leading-tight">Admin User</p>
//               <p className="text-xs text-gray-500">Superadmin</p>
//             </div>
//           </div>
//           <button
//             onClick={handleLogout}
//             className="w-full bg-zinc-900 border border-zinc-800 text-gray-400 px-4 py-2 rounded-lg text-sm font-bold hover:border-red-500/50 hover:text-red-500 transition-colors flex justify-center items-center gap-2 group"
//           >
//             <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
//             Sign Out
//           </button>
//         </div>
//       </aside>

//       {/* ────────────────── Main Content ────────────────── */}
//       <main className="flex-1 bg-black text-gray-300 relative h-full flex flex-col overflow-hidden">
//         {/* Subtle Background Texture */}
//         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-5 pointer-events-none z-0"></div>

//         {/* Mobile Top Bar */}
//         <header className="md:hidden sticky top-0 z-30 bg-black/80 backdrop-blur-md border-b border-zinc-900 p-4 flex items-center justify-between shrink-0">
//           <h1 className="text-lg font-extrabold text-white">
//             NMS <span className="text-yellow-500">Admin</span>
//           </h1>
//           <button
//             onClick={() => setIsSidebarOpen(true)}
//             className="text-gray-400 hover:text-yellow-500 transition-colors"
//           >
//             <Menu className="w-6 h-6" />
//           </button>
//         </header>

//         {/* Rendered Nested Routes go here */}
//         <div className="flex-1 overflow-y-auto p-6 md:p-10 relative z-10 w-full h-full">
//           <Outlet />
//         </div>
//       </main>

//       {/* GLOBAL STYLES (Optional: if not already in your index.css) */}
//       <style dangerouslySetInnerHTML={{__html: `
//         .no-scrollbar::-webkit-scrollbar { display: none; }
//         .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
//         @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
//         .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
//       `}} />
//     </div>
//   );
// }

// // Redirect /admin to /admin/dashboard
// export const AdminRoutes = () => <Navigate to="/admin/dashboard" replace />;



import React from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { Users, Image, HelpCircle, MessageSquare, LogOut, LayoutDashboard } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Gallery", path: "/admin/gallery", icon: Image },
    { name: "FAQs", path: "/admin/faqs", icon: HelpCircle },
    { name: "Testimonials", path: "/admin/testimonials", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-black text-gray-300 flex font-sans selection:bg-yellow-500 selection:text-black">
      
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col hidden md:flex">
        <div className="h-20 flex items-center justify-center border-b border-zinc-800">
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            NMS <span className="text-yellow-500">Admin</span>
          </h1>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${
                  isActive
                    ? "bg-yellow-500 text-black shadow-[0_0_10px_rgba(234,179,8,0.2)]"
                    : "text-gray-400 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-lg transition-all font-medium"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Header (Mobile menu placeholder & Breadcrumbs) */}
        <header className="h-20 bg-zinc-950/50 backdrop-blur-md border-b border-zinc-800 flex items-center px-8 sticky top-0 z-10">
          <h2 className="text-xl font-bold text-white capitalize">
            {location.pathname.split("/").pop() || "Dashboard"}
          </h2>
        </header>

        {/* Dynamic Nested Route Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* The Outlet is critical: It renders UsersDetails, ManageGallery, etc., based on the URL */}
          <Outlet /> 
        </div>
      </main>

    </div>
  );
};

export default AdminDashboard;