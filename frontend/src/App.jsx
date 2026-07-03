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
import CandidateWorkspace from './features/candidate/CandidateWorkspace.jsx';
import ProfilePage from './features/candidate/pages/ProfilePage.jsx';
import ResumePage from './features/candidate/pages/ResumePage.jsx';
import SavedJobsPage from './features/candidate/pages/SavedJobsPage.jsx';
import NotificationsPage from './features/candidate/pages/NotificationsPage.jsx';
import SettingsPage from './features/candidate/pages/SettingsPage.jsx';
import RecruiterWorkspace from './features/recruiter/RecruiterWorkspace.jsx';
import CompanyPage from './features/recruiter/pages/CompanyPage.jsx';
import JobsPage from './features/recruiter/pages/JobsPage.jsx';
import JobFormPage from './features/recruiter/pages/JobFormPage.jsx';
import ApplicantsPage from './features/recruiter/pages/ApplicantsPage.jsx';
import RecruiterSettings from './features/recruiter/pages/RecruiterSettings.jsx';
import JobsListPage from './features/jobs/pages/JobsListPage.jsx';
import JobDetailsPage from './features/jobs/pages/JobDetailsPage.jsx';

// New Admin Imports
import AdminWorkspace from './features/admin/AdminWorkspace.jsx';
import AdminDashboardPage from './features/admin/pages/AdminDashboardPage.jsx';
import AdminUsersPage from './features/admin/pages/AdminUsersPage.jsx';
import AdminCompaniesPage from './features/admin/pages/AdminCompaniesPage.jsx';
import AdminJobsPage from './features/admin/pages/AdminJobsPage.jsx';
import AdminApplicationsPage from './features/admin/pages/AdminApplicationsPage.jsx';

const DashboardRoute = () => {
  const user = useAuthStore((state) => state.user);

  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

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

const RecruiterOnly = () => {
  const user = useAuthStore((state) => state.user);
  if (user?.role !== 'recruiter') return <Navigate to="/dashboard" replace />;
  return <RecruiterWorkspace />;
};

const AdminOnly = () => {
  const user = useAuthStore((state) => state.user);
  if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return <AdminWorkspace />;
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
        
        <Route path="candidate" element={<ProtectedRoute><CandidateWorkspace /></ProtectedRoute>}>
          <Route path="profile" element={<ProfilePage />} />
          <Route path="resume" element={<ResumePage />} />
          <Route path="saved-jobs" element={<SavedJobsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="jobs" element={<JobsListPage />} />
          <Route path="jobs/:slug" element={<JobDetailsPage />} />
          <Route index element={<Navigate to="/candidate/profile" replace />} />
        </Route>

        <Route
          path="recruiter-dashboard"
          element={
            <ProtectedRoute>
              <RecruiterDashboardRoute />
            </ProtectedRoute>
          }
        />
        <Route
          path="recruiter"
          element={
            <ProtectedRoute>
              <RecruiterOnly />
            </ProtectedRoute>
          }
        >
          <Route path="company" element={<CompanyPage />} />
          <Route path="jobs" element={<JobsPage />} />
          <Route path="jobs/new" element={<JobFormPage />} />
          <Route path="jobs/:id/edit" element={<JobFormPage />} />
          <Route path="applicants" element={<ApplicantsPage />} />
          <Route path="settings" element={<RecruiterSettings />} />
          <Route index element={<Navigate to="/recruiter/company" replace />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="admin"
          element={
            <ProtectedRoute>
              <AdminOnly />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="companies" element={<AdminCompaniesPage />} />
          <Route path="jobs" element={<AdminJobsPage />} />
          <Route path="applications" element={<AdminApplicationsPage />} />
        </Route>

      </Route>
    </Routes>
  );
}

export default App;