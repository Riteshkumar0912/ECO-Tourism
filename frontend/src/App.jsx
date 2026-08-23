import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import { AuthProvider }   from './context/AuthContext';
import Sidebar            from './components/Sidebar';
import AuthModal          from './components/AuthModal';
import ProtectedRoute     from './components/ProtectedRoute';
import ToastNotification  from './components/ToastNotification';
import LandingPage        from './pages/LandingPage';
import AuthPage           from './pages/AuthPage';
import TouristPlanner     from './pages/TouristPlanner';
import HotelBooking       from './pages/HotelBooking';
import CameraMonitor      from './pages/CameraMonitor';
import AuthorityDashboard from './pages/AuthorityDashboard';
import HotelPortal        from './pages/HotelPortal';

function AppLayout() {
  const location = useLocation();
  const isStandalonePage = location.pathname === '/' || location.pathname === '/auth';

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Show Sidebar on all routes except Landing Gateway and Auth Page */}
      {!isStandalonePage && <Sidebar />}

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <main className="flex-1">
          <Routes>
            {/* Landing Page Role Selection Gateway */}
            <Route path="/" element={<LandingPage />} />

            {/* Dedicated Role Authentication Page */}
            <Route path="/auth" element={<AuthPage />} />

            {/* Tourist & Public Routes */}
            <Route
              path="/tourist"
              element={
                <ProtectedRoute allowedRoles={['tourist', 'authority', 'merchant']}>
                  <TouristPlanner />
                </ProtectedRoute>
              }
            />

            <Route
              path="/hotels"
              element={
                <ProtectedRoute allowedRoles={['tourist', 'authority', 'merchant']}>
                  <HotelBooking />
                </ProtectedRoute>
              }
            />

            {/* Authority & Police Guarded Routes */}
            <Route
              path="/camera"
              element={
                <ProtectedRoute allowedRoles={['authority']}>
                  <CameraMonitor />
                </ProtectedRoute>
              }
            />

            <Route
              path="/authority"
              element={
                <ProtectedRoute allowedRoles={['authority']}>
                  <AuthorityDashboard />
                </ProtectedRoute>
              }
            />

            {/* Local Merchant Guarded Route */}
            <Route
              path="/hotel"
              element={
                <ProtectedRoute allowedRoles={['merchant']}>
                  <HotelPortal />
                </ProtectedRoute>
              }
            />

            {/* 404 fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          {/* Global persistent notifications & auth modal */}
          <ToastNotification />
          <AuthModal />

          <AppLayout />
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
}
