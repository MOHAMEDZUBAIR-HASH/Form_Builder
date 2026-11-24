import api from './api';

// Admin Login
export const adminLogin = (credentials) => {
  return api.post('/auth/login', credentials, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// Admin Register
export const adminRegister = (data) => {
  return api.post('/auth/register', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// Logout Admin (Clears HttpOnly Cookie & Session)
export const logoutAdmin = () => {
  return api.post('/auth/logout');
};

// Get Current Authenticated Admin Profile
export const getAdminProfile = () => {
  return api.get('/auth/me');
};

// Export backward-compatible object format
export const authService = {
  login: adminLogin,
  register: adminRegister,
  logout: logoutAdmin,
  getMe: getAdminProfile,
};

export default authService;
