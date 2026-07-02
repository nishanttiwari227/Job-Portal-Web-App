import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { logout } from '../services/authApi.js';
import { useAuthStore } from '../../../store/authStore.js';

const LogoutPage = () => {
  const navigate = useNavigate();
  const clearUser = useAuthStore((state) => state.clearUser);

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout();
      } catch {
        // Ignore errors on logout to keep UX smooth.
      } finally {
        clearUser();
        toast.success('Logged out successfully');
        navigate('/login');
      }
    };

    performLogout();
  }, [clearUser, navigate]);

  return null;
};

export default LogoutPage;
