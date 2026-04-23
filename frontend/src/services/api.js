import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('stayeo_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('stayeo_token');
      localStorage.removeItem('stayeo_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ─── Hotel API ────────────────────────────────────────────────────────────────
export const hotelAPI = {
  getAll: (params) => api.get('/hotels', { params }),
  getById: (id) => api.get(`/hotels/${id}`),
  getFeatured: () => api.get('/hotels/featured'),
  getCities: () => api.get('/hotels/cities'),
  create: (data) => api.post('/hotels', data),
  update: (id, data) => api.put(`/hotels/${id}`, data),
  delete: (id) => api.delete(`/hotels/${id}`),
  addReview: (id, data) => api.post(`/hotels/${id}/reviews`, data),
  getStats: () => api.get('/hotels/stats'),
};

// ─── Booking API ──────────────────────────────────────────────────────────────
export const bookingAPI = {
  create: (data) => api.post('/bookings', data),
  getMyBookings: (params) => api.get('/bookings/my', { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  cancel: (id, data) => api.put(`/bookings/${id}/cancel`, data),
  getAll: (params) => api.get('/bookings', { params }),
  getAnalytics: () => api.get('/bookings/analytics'),
};

// ─── Payment API ──────────────────────────────────────────────────────────────
export const paymentAPI = {
  createOrder: (bookingId) => api.post('/payments/create-order', { bookingId }),
  verifyPayment: (data) => api.post('/payments/verify', data),
};

// ─── Auth API ─────────────────────────────────────────────────────────────────
export const authAPI = {
  register:       (data)    => api.post('/auth/register', data),
  login:          (data)    => api.post('/auth/login', data),
  getMe:          ()        => api.get('/auth/me'),
  updateProfile:  (data)    => api.put('/auth/profile', data),
  changePassword: (data)    => api.put('/auth/change-password', data),
  toggleWishlist: (hotelId) => api.post(`/auth/wishlist/${hotelId}`),
  getAllUsers:     ()        => api.get('/auth/users'),
};

// ─── Dashboard API ────────────────────────────────────────────────────────────
export const dashboardAPI = {
  get:                  ()           => api.get('/dashboard'),
  addToWallet:          (amount)     => api.post('/dashboard/wallet/add', { amount }),
  addPaymentMethod:     (data)       => api.post('/dashboard/payment-methods', data),
  deletePaymentMethod:  (id)         => api.delete(`/dashboard/payment-methods/${id}`),
  addDocument:          (data)       => api.post('/dashboard/documents', data),
  deleteDocument:       (id)         => api.delete(`/dashboard/documents/${id}`),
  updatePreferences:    (data)       => api.put('/dashboard/preferences', data),
  processRefund:        (bookingId)  => api.post(`/dashboard/refund/${bookingId}`),
  redeemPoints:         (points)     => api.post('/dashboard/loyalty/redeem', { points }),
  getInvoice:           (bookingId)  => api.get(`/dashboard/invoice/${bookingId}`),
};
