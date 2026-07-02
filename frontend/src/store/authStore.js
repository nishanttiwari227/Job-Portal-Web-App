import { create } from 'zustand';

const getInitialUser = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const storedUser = window.localStorage.getItem('jobPortalUser');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

const initialUser = getInitialUser();

export const useAuthStore = create((set) => ({
  user: initialUser,
  isAuthenticated: Boolean(initialUser),
  setUser: (user) => {
    if (typeof window !== 'undefined') {
        window.localStorage.setItem('jobPortalUser', JSON.stringify(user));
    }
    set({ user, isAuthenticated: Boolean(user) });
  },
  clearUser: () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('jobPortalUser');
    }
    set({ user: null, isAuthenticated: false });
  },
}));
