import { create } from 'zustand';
import api from '../services/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isInitializing: true, // true until token verification completes on startup

  // ── Initialize auth — verify token against backend on every app start ──────
  initAuth: async () => {
    const token = localStorage.getItem('stayeo_token');
    const cachedUser = localStorage.getItem('stayeo_user');

    if (!token || !cachedUser) {
      // No stored session — start fresh
      set({ isInitializing: false, isAuthenticated: false, user: null, token: null });
      return;
    }

    // Optimistically restore from cache so UI doesn't flash
    set({
      token,
      user: JSON.parse(cachedUser),
      isAuthenticated: true,
      isInitializing: true,
    });

    try {
      // Verify token is still valid with the backend
      const res = await api.get('/auth/me');
      const freshUser = res.data.user;

      // Update with fresh user data from server
      localStorage.setItem('stayeo_user', JSON.stringify(freshUser));
      set({
        user: freshUser,
        isAuthenticated: true,
        isInitializing: false,
      });
    } catch {
      // Token expired, revoked, or user deleted — clear everything
      localStorage.removeItem('stayeo_token');
      localStorage.removeItem('stayeo_user');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isInitializing: false,
      });
    }
  },

  // Register — creates account only, does NOT log in automatically
  register: async (data) => {
    set({ isLoading: true });
    try {
      await api.post('/auth/register', data);
      set({ isLoading: false });
      // Return success without setting auth state — user must log in manually
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  },

  // Login — verifies credentials and sets auth state
  login: async (data) => {
    set({ isLoading: true });
    try {
      const res = await api.post('/auth/login', data);
      const { token, user } = res.data;
      localStorage.setItem('stayeo_token', token);
      localStorage.setItem('stayeo_user', JSON.stringify(user));
      set({ token, user, isAuthenticated: true, isLoading: false });
      return { success: true, user };
    } catch (error) {
      set({ isLoading: false });
      const message = error.response?.data?.message || 'Invalid email or password';
      return { success: false, message };
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('stayeo_token');
    localStorage.removeItem('stayeo_user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  // Update user in store
  updateUser: (userData) => {
    const updatedUser = { ...get().user, ...userData };
    localStorage.setItem('stayeo_user', JSON.stringify(updatedUser));
    set({ user: updatedUser });
  },

  // Toggle wishlist
  toggleWishlist: async (hotelId) => {
    try {
      const res = await api.post(`/auth/wishlist/${hotelId}`);
      const { wishlist } = res.data;
      const updatedUser = { ...get().user, wishlist };
      localStorage.setItem('stayeo_user', JSON.stringify(updatedUser));
      set({ user: updatedUser });
      return { success: true, wishlist };
    } catch (error) {
      return { success: false, message: error.response?.data?.message };
    }
  },

  // Check if hotel is in wishlist
  isInWishlist: (hotelId) => {
    const { user } = get();
    return user?.wishlist?.includes(hotelId) || false;
  },
}));
