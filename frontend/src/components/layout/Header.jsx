import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore.js';
import { logout } from '../../features/auth/services/authApi.js';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  
  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      // Ignore API errors to ensure local state is cleared regardless of backend status
    } finally {
      clearUser();
      toast.success('Logged out successfully');
      navigate('/login');
    }
  };

  const getDashboardLink = () => {
    if (user?.role === 'admin') return '/admin';
    if (user?.role === 'recruiter') return '/recruiter-dashboard';
    return '/dashboard';
  };

  const getProfileLink = () => {
    if (user?.role === 'recruiter') return '/recruiter/company';
    if (user?.role === 'admin') return '/admin'; // Admins default to their dashboard
    return '/candidate/profile';
  };

  const getSettingsLink = () => {
    if (user?.role === 'recruiter') return '/recruiter/settings';
    if (user?.role === 'admin') return '/admin'; 
    return '/candidate/settings';
  };

  if (!user) return null;

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
        
        {/* Logo / Brand */}
        <Link to={getDashboardLink()} className="text-xl font-bold text-blue-600">
          JobPortal
        </Link>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 hover:bg-slate-50 p-2 rounded-md transition-colors"
          >
            <div className="flex flex-col text-right">
              <span className="text-sm font-semibold text-slate-900">{user.name}</span>
              <span className="text-xs text-slate-500 capitalize">{user.role}</span>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-slate-100 py-1 overflow-hidden">
              <Link
                to={getDashboardLink()}
                onClick={() => setIsDropdownOpen(false)}
                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to={getProfileLink()}
                onClick={() => setIsDropdownOpen(false)}
                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Profile
              </Link>
              <Link
                to={getSettingsLink()}
                onClick={() => setIsDropdownOpen(false)}
                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Settings
              </Link>
              <div className="border-t border-slate-100 my-1"></div>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;