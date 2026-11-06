import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CropSelectionPage from './pages/CropSelectionPage';
import CentresPage from './pages/CentresPage';
import SlotBookingPage from './pages/SlotBookingPage';
import SplitSellingPage from './pages/SplitSellingPage';
import TrackingPage from './pages/TrackingPage';
import PaymentTrackingPage from './pages/PaymentTrackingPage';
import OperatorPortalPage from './pages/OperatorPortalPage';

// Protected Route wrapper
function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

// App Layout with conditional sidebar
function AppLayout() {
  const location = useLocation();
  const isPublic = ['/', '/login', '/register'].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex">
        {/* Render Sidebar for non-landing/auth pages */}
        {!isPublic && <Sidebar />}

        <main className={`flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl ${isPublic ? 'w-full' : ''}`}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Farmer / Authenticated Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/crops"
              element={
                <ProtectedRoute>
                  <CropSelectionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/centres"
              element={
                <ProtectedRoute>
                  <CentresPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/book-slot"
              element={
                <ProtectedRoute>
                  <SlotBookingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/split-selling"
              element={
                <ProtectedRoute>
                  <SplitSellingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tracking"
              element={
                <ProtectedRoute>
                  <TrackingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payments"
              element={
                <ProtectedRoute>
                  <PaymentTrackingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/operator-portal"
              element={
                <ProtectedRoute allowedRoles={['operator', 'admin', 'farmer']}>
                  <OperatorPortalPage />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <AppLayout />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
