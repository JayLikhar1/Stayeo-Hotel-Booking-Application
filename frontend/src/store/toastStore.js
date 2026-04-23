import { create } from 'zustand';

let toastId = 0;

export const useToastStore = create((set, get) => ({
  toasts: [],

  addToast: ({ type = 'info', title, message, duration = 4000 }) => {
    const id = ++toastId;
    const toast = { id, type, title, message, duration };

    set((state) => ({ toasts: [...state.toasts, toast] }));

    // Auto remove
    if (duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, duration);
    }

    return id;
  },

  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },

  // Convenience methods
  success: (message, title = 'Success') => {
    return get().addToast({ type: 'success', title, message });
  },

  error: (message, title = 'Error') => {
    return get().addToast({ type: 'error', title, message });
  },

  info: (message, title = 'Info') => {
    return get().addToast({ type: 'info', title, message });
  },

  warning: (message, title = 'Warning') => {
    return get().addToast({ type: 'warning', title, message });
  },
}));
