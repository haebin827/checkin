import http from '../http-common.js';

const AuthService = {
  login(data) {
    return http.post(`/auth/login`, data);
  },

  logout() {
    return http.post(`/auth/logout`);
  },

  getCurrentSession() {
    return http.get(`/auth`);
  },

  register(data, locationId) {
    return http.post(`/auth/register`, data, locationId);
  },

  validateRegistration(data) {
    return http.post(`/auth/validate-registration`, data);
  },

  sendOTPEmail(email) {
    return http.post(`/auth/opt-email`, { email: email });
  },

  googleLogin() {
    window.location.href = `${import.meta.env.VITE_APP_API_PORT_URL}/auth/google`;
  },

  kakaoLogin() {
    window.location.href = `${import.meta.env.VITE_APP_API_PORT_URL}/auth/kakao`;
  },

  findAccount(data) {
    return http.post(`/auth/find-account`, data);
  },

  verifyUsername(token) {
    return http.get(`/auth/verify-username?token=${token}`);
  },

  resetPassword(data) {
    return http.post(`/auth/reset-password`, data);
  },

  changePassword(data) {
    return http.post(`/auth/change-pw`, data);
  },

  updateAdditionalInfo(data) {
    return http.post(`/auth/update-info`, data);
  },

  async getUser(id) {
    if (!id) {
      throw new Error('User ID is required');
    }

    try {
      return await http.get(`/auth/user?id=${id}`);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw error;
    }
  },

  updateUser(data) {
    return http.post(`/auth/update`, data);
  },
};

export default AuthService;
