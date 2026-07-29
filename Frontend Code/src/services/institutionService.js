import api from './api'

const institutionService = {
  // POST /api/institutions
  create: async (data) => {
    const response = await api.post('/institutions', data)
    return response.data
  },

  // GET /api/institutions/{instituteCode}
  getByCode: async (instituteCode) => {
    const response = await api.get(`/institutions/${instituteCode}`)
    return response.data
  },

  // GET /api/institutions
  getAll: async () => {
    const response = await api.get('/institutions')
    return response.data
  },

  // PUT /api/institutions
  update: async (data) => {
    const response = await api.put('/institutions', data)
    return response.data
  },

  // DELETE /api/institutions/{instituteCode}
  delete: async (instituteCode) => {
    const response = await api.delete(`/institutions/${instituteCode}`)
    return response.data
  },
}

export default institutionService
