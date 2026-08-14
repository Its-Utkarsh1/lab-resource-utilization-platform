import api from './api'
import axios from 'axios'

const authService = {
  // POST /api/auth/login
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  // POST /api/auth/register (YOU NEED TO ADD THIS IN BACKEND)
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  // POST /api/auth/verify-email
  verifyEmail: async (data) => {
    const response = await api.post('/auth/verify-email', data)
    return response.data
  },

  // POST /api/auth/resend-otp
  resendOtp: async (data) => {
    const response = await api.post('/auth/resend-otp', data)
    return response.data
  },

  // POST /api/auth/forgot-password
  forgotPassword: async (data) => {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
  },

  // POST /api/auth/reset-password
  resetPassword: async (data) => {
    const response = await api.post('/auth/reset-password', data)
    return response.data
  },

  // POST /api/auth/refresh-token
  refreshToken: async (token) => {
    const response = await api.post('/auth/refresh-token', { refreshToken: token })
    return response.data
  },

  // GET /api/auth/me (supports optional token for regToken flows)
  getCurrentUser: async (token) => {
    if (token) {
      console.log('authService.getCurrentUser using token:', token?.slice?.(0,20) + '...');
      const base = api.defaults.baseURL || 'http://localhost:8080/api'
      const response = await axios.get(`${base}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    }

    const response = await api.get('/auth/me')
    return response.data
  },
}

export default authService
