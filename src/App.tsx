import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { RequireTransporterProfile } from './components/RequireTransporterProfile';
import { AppShell } from './layouts/AppShell';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CompleteTransporterProfilePage } from './pages/CompleteTransporterProfilePage';
import { DashboardPage } from './pages/DashboardPage';
import { OpenRequestsPage } from './pages/OpenRequestsPage';
import { RequestDetailPage } from './pages/RequestDetailPage';
import { ComparePage } from './pages/ComparePage';
import { ProfilePage } from './pages/ProfilePage';
import { NotificationsPage } from './pages/NotificationsPage';

function ProtectedShell() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-zinc-50 text-zinc-500 dark:bg-[#050505] dark:text-zinc-400">
        Chargement…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedShell />}>
        <Route path="/onboarding/transporter" element={<CompleteTransporterProfilePage />} />
        <Route element={<RequireTransporterProfile />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/requests/open" element={<OpenRequestsPage />} />
          <Route path="/requests/:id" element={<RequestDetailPage />} />
          <Route path="/requests/:id/compare" element={<ComparePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
