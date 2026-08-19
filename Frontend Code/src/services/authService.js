import api from './api'

const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  verifyEmail: async (data) => {
    const response = await api.post('/auth/verify-email', data)
    return response.data
  },

  resendOtp: async (data) => {
    const response = await api.post('/auth/resend-otp', data)
    return response.data
  },

  forgotPassword: async (data) => {
    const response = await api.post('/auth/forgot-password', data)
    return response.data
  },

  resetPassword: async (data) => {
    const response = await api.post('/auth/reset-password', data)
    return response.data
  },

  refreshToken: async (token) => {
    const response = await api.post('/auth/refresh-token', {
      refreshToken: token,
    })
    return response.data
  },

  getCurrentUser: async (token) => {
    if (token) {
      console.log(
        'authService.getCurrentUser using token:',
        token?.slice?.(0, 20) + '...'
      )

      const response = await api.get('/auth/me', {
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