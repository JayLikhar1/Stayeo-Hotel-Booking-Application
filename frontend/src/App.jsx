import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Pages
import HomePage from './pages/HomePage';
import HotelsPage from './pages/HotelsPage';
import HotelDetailPage from './pages/HotelDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BookingPage from './pages/BookingPage';
import BookingSuccessPage from './pages/BookingSuccessPage';
import MyBookingsPage from './pages/MyBookingsPage';
import WishlistPage from './pages/WishlistPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import CareersPage from './pages/CareersPage';
import PressPage from './pages/PressPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import WriteReviewPage from './pages/WriteReviewPage';
import PartnerPage from './pages/PartnerPage';
import AffiliatePage from './pages/AffiliatePage';
import BlogPage from './pages/BlogPage';
import ReferPage from './pages/ReferPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminHotels from './pages/admin/AdminHotels';
import AdminBookings from './pages/admin/AdminBookings';
import AdminHotelForm from './pages/admin/AdminHotelForm';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ToastContainer from './components/ui/ToastContainer';
import ScrollToTop from './components/ui/ScrollToTop';

// Store
import { useAuthStore } from './store/authStore';

// ── App-level loading screen while token is being verified ───────────────────
const AppLoader = () => (
  <div className="min-h-screen bg-dark-950 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-glow-sm animate-pulse">
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </div>
      <div className="w-6 h-6 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
      <p className="text-white/30 text-sm">Loading StayEo...</p>
    </div>
  </div>
);

// Protected Route — redirects to /login if not authenticated
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Public-only Route — redirects away if already logged in
const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated) {
    // Send admin to admin panel, users to dashboard
    const dest = user?.role === 'admin' ? '/admin' : '/dashboard';
    return <Navigate to={dest} replace />;
  }

  return children;
};

// Layout wrapper (with navbar/footer)
const MainLayout = ({ children }) => (
  <>
    <Navbar />
    <main className="min-h-screen">{children}</main>
    <Footer />
  </>
);

// Admin layout (no footer)
const AdminLayout = ({ children }) => (
  <>
    <main className="min-h-screen bg-dark-950">{children}</main>
  </>
);

function App() {
  const { initAuth, isInitializing } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Block rendering until token verification is complete
  // This prevents the flash of unauthenticated content or wrong redirects
  if (isInitializing) {
    return <AppLoader />;
  }

  return (
    <Router>
      <ScrollToTop />
      <ToastContainer />
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
          <Route path="/hotels" element={<MainLayout><HotelsPage /></MainLayout>} />
          <Route path="/hotels/:id" element={<MainLayout><HotelDetailPage /></MainLayout>} />

          {/* Auth routes — redirect away if already logged in */}
          <Route path="/login" element={
            <PublicOnlyRoute><LoginPage /></PublicOnlyRoute>
          } />
          <Route path="/register" element={
            <PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>
          } />

          {/* Protected user routes */}
          <Route path="/booking/:hotelId" element={
            <ProtectedRoute>
              <MainLayout><BookingPage /></MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/booking/success/:bookingId" element={
            <ProtectedRoute>
              <MainLayout><BookingSuccessPage /></MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/my-bookings" element={
            <ProtectedRoute>
              <MainLayout><MyBookingsPage /></MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/wishlist" element={
            <ProtectedRoute>
              <MainLayout><WishlistPage /></MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <MainLayout><ProfilePage /></MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <MainLayout><UserDashboard /></MainLayout>
            </ProtectedRoute>
          } />

          {/* Company pages */}
          <Route path="/about"    element={<MainLayout><AboutPage /></MainLayout>} />
          <Route path="/careers"  element={<MainLayout><CareersPage /></MainLayout>} />
          <Route path="/press"    element={<MainLayout><PressPage /></MainLayout>} />
          <Route path="/privacy"  element={<MainLayout><PrivacyPage /></MainLayout>} />
          <Route path="/terms"    element={<MainLayout><TermsPage /></MainLayout>} />

          {/* Community pages */}
          <Route path="/write-review" element={<MainLayout><WriteReviewPage /></MainLayout>} />
          <Route path="/partner"      element={<MainLayout><PartnerPage /></MainLayout>} />
          <Route path="/affiliate"    element={<MainLayout><AffiliatePage /></MainLayout>} />
          <Route path="/blog"         element={<MainLayout><BlogPage /></MainLayout>} />
          <Route path="/refer"        element={<MainLayout><ReferPage /></MainLayout>} />

          {/* Admin routes */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <AdminLayout><AdminDashboard /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/hotels" element={
            <ProtectedRoute adminOnly>
              <AdminLayout><AdminHotels /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/hotels/new" element={
            <ProtectedRoute adminOnly>
              <AdminLayout><AdminHotelForm /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/hotels/edit/:id" element={
            <ProtectedRoute adminOnly>
              <AdminLayout><AdminHotelForm /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/bookings" element={
            <ProtectedRoute adminOnly>
              <AdminLayout><AdminBookings /></AdminLayout>
            </ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;
