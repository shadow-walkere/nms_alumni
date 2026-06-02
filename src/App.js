import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

// --- PUBLIC COMPONENTS ---
import Home from "./page/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollTop";

import Auth from "./page/Auth";
import Donations from "./page/Donation";
import Gallery from "./page/Gallery";
import NewsEvents from "./page/Events";
import Contact from "./page/ContactUs";
import AboutUs from "./page/AboutUs";
import AlumniDirectory from "./page/AlumniDirectory";
import Opportunities from "./page/mentorships";

// --- ADMIN COMPONENTS ---
// Make sure these paths match where you saved the files
import AdminLogin from "./Admin/AdminLogin"; 
import AdminDashboard from "./Admin/AdminDashboard";
import ManageGallery from "./Admin/ManageGallery";
import UsersDetails from "./Admin/UserDetails";
import AdminFAQs from "./Admin/AdminFAQs";
import AdminTestimonials from "./Admin/AdminTestimonials";

/* ─────────────────────────────────────────────────────────
 * PROTECTED ROUTE WRAPPERS
 * ───────────────────────────────────────────────────────── */

/* 1. Regular User Protected Route */
function ProtectedRoute({ children }) {
  const user = localStorage.getItem("user");
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  return children;
}

/* 2. Admin Protected Route */
function AdminProtectedRoute({ children }) {
  const adminToken = localStorage.getItem("adminToken");
  if (!adminToken) {
    return <Navigate to="/admin" replace />;
  }
  return children;
}

/* ─────────────────────────────────────────────────────────
 * LAYOUT WRAPPERS
 * ───────────────────────────────────────────────────────── */

/* * Public Layout Wraps the standard app with Navbar and Footer.
 * This prevents the Navbar/Footer from rendering on the Admin pages.
 */
function PublicLayout() {
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
 * MAIN APP ROUTER
 * ───────────────────────────────────────────────────────── */

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        {/* =========================================
            PUBLIC APP (Uses Navbar & Footer)
            ========================================= */}
        <Route element={<PublicLayout />}>
          
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/donations" element={<Donations />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<AboutUs />} />

          {/* User Protected Routes */}
          <Route
            path="/gallery"
            element={
              <ProtectedRoute>
                <Gallery />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events"
            element={
              <ProtectedRoute>
                <NewsEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/alumni-directory"
            element={
              <ProtectedRoute>
                <AlumniDirectory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentorships"
            element={
              <ProtectedRoute>
                <Opportunities />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* =========================================
            ADMIN PORTAL (Standalone Fullscreen Layouts)
            ========================================= */}
            
        {/* Admin Login Page */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* Admin Dashboard & Nested Routes */}
        <Route
          path="/admin/*"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<UsersDetails />} />
          <Route path="gallery" element={<ManageGallery />} />
          <Route path="faqs" element={<AdminFAQs />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;