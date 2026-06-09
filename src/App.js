import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

// --- PUBLIC COMPONENTS ---
import Home from "./page/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollTop";

import Auth from "./page/Auth";
// import Donations from "./page/Donation";
import Gallery from "./page/Gallery";
import NewsEvents from "./page/Events";
import Contact from "./page/ContactUs";
import AboutUs from "./page/AboutUs";
import AlumniDirectory from "./page/AlumniDirectory";
import Opportunities from "./page/mentorships";

// --- ADMIN COMPONENTS ---
import AdminLogin from "./Admin/AdminLogin";
import AdminDashboard from "./Admin/AdminDashboard";
import ManageGallery from "./Admin/ManageGallery";
import ManageEvents from "./Admin/ManageEvents";
import UsersDetails from "./Admin/UsersDetails";
import ManageAlumni from "./Admin/ManageAlumni";
// import AdminFAQs from "./Admin/AdminFAQs";
// import AdminTestimonials from "./Admin/AdminTestimonials";

/* ─────────────────────────────────────────────────────────
 * PROTECTED ROUTES
 * ───────────────────────────────────────────────────────── */

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

function AdminProtectedRoute({ children }) {
  const adminToken = localStorage.getItem("adminToken");

  if (!adminToken) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

/* ─────────────────────────────────────────────────────────
 * LAYOUT
 * ───────────────────────────────────────────────────────── */

const SERVER_URL = 
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SERVER_URL) ||
  (typeof process !== 'undefined' && process.env && process.env.REACT_APP_SERVER_URL) || 
  "http://localhost:5000";

function PublicLayout() {
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        const hasTracked = sessionStorage.getItem("hasTrackedVisit");
        if (!hasTracked) {
          const response = await fetch(`${SERVER_URL}/api/visitors/track-visitor`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (response.ok) {
            sessionStorage.setItem("hasTrackedVisit", "true");
          }
        }
      } catch (err) {
        console.error("Failed to track visitor:", err);
      }
    };
    trackVisitor();
  }, []);

  return (
    <div className="bg-black min-h-screen flex flex-col selection:bg-yellow-500 selection:text-black">
      <Navbar />
      <main className="pt-24 flex-grow w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
 * APP ROUTER
 * ───────────────────────────────────────────────────────── */

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        {/* =========================================
            PUBLIC ROUTES
            ========================================= */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          {/* <Route path="/donations" element={<Donations />} /> */}
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<AboutUs />} />
          
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/events" element={<NewsEvents />} />
          <Route path="/alumni" element={<AlumniDirectory />} />

          {/* Protected user route */}
          <Route
            path="/opportunities"
            element={
              <ProtectedRoute>
                <Opportunities />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* =========================================
            ADMIN ROUTES
            ========================================= */}
            
        {/* ADMIN LOGIN */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* ADMIN DASHBOARD (Correctly Nested) */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<Navigate to="visitors" replace />} />
          
          {/* CHILD ROUTES: 
            These render inside the <Outlet /> of AdminDashboard.
            Their URLs will be "/admin/dashboard/gallery", "/admin/dashboard/users", etc. 
          */}
          <Route path="users" element={<UsersDetails />} />
          <Route path="visitors" element={<UsersDetails />} />
          <Route path="gallery" element={<ManageGallery />} />
           <Route path="events" element={<ManageEvents />} />
           <Route path="alumni" element={<ManageAlumni />} />
          {/* <Route path="faqs" element={<AdminFAQs />} /> */}
          {/* <Route path="testimonials" element={<AdminTestimonials />} /> */}
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;