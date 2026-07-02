import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
