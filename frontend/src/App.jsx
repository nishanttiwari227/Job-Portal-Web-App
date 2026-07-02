import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import PublicRoute from './routes/PublicRoute.jsx';
import LoginPage from './features/auth/pages/LoginPage.jsx';
import RegisterPage from './features/auth/pages/RegisterPage.jsx';
import EmailVerificationPage from './features/auth/pages/EmailVerificationPage.jsx';
import LogoutPage from './features/auth/pages/LogoutPage.jsx';
import CandidateDashboardPage from './features/candidate/pages/CandidateDashboardPage.jsx';
import RecruiterDashboardPage from './features/recruiter/pages/RecruiterDashboardPage.jsx';
import { useAuthStore } from './store/authStore.js';

const DashboardRoute = () => {
  const user = useAuthStore((state) => state.user);

  if (user?.role === 'recruiter') {
    return <Navigate to="/recruiter-dashboard" replace />;
  }

  return <CandidateDashboardPage />;
};

const RecruiterDashboardRoute = () => {
  const user = useAuthStore((state) => state.user);

  if (user?.role !== 'recruiter') {
    return <Navigate to="/dashboard" replace />;
  }

  return <RecruiterDashboardPage />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/login" replace />} />
        <Route
          path="login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route
          path="verify-email"
          element={
            <PublicRoute>
              <EmailVerificationPage />
            </PublicRoute>
          }
        />
        <Route
          path="logout"
          element={
            <ProtectedRoute>
              <LogoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <DashboardRoute />
            </ProtectedRoute>
          }
        />
        <Route
          path="recruiter-dashboard"
          element={
            <ProtectedRoute>
              <RecruiterDashboardRoute />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
