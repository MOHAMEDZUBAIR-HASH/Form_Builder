import axios from 'axios';
import { store } from '../redux/store';
import { logoutUser } from '../redux/slices/authSlice';

/**
 * Enterprise Axios Client
 * Relies 100% on HttpOnly SameSite secure cookies (Zero tokens stored in JavaScript/localStorage)
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: true, // Automatically sends and receives HttpOnly cookies with all requests
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Response interceptor: Handles 401 Session Expired & Network Errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🔴 1️⃣ Handle 401 (Session expired) - Auto logout from Redux store
    if (error.response?.status === 401) {
      store.dispatch(logoutUser());
    }

    // 🌐 2️⃣ Handle Network Error (Server down)
    if (!error.response && !axios.isCancel(error)) {
      window.dispatchEvent(new Event('network-error'));
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected network error occurred.';

    return Promise.reject({
      ...error,
      customMessage: message,
      fieldErrors: error.response?.data?.errors || null,
      status: error.response?.status,
    });
  }
);

api.defaults.xsrfCookieName = 'XSRF-TOKEN';
api.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';

export default api;
