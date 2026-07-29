import api from './api'

const maintenanceService = {
  // POST /api/maintenance
  create: async (data) => {
    const response = await api.post('/maintenance', data)
    return response.data
  },

  // GET /api/maintenance
  getAll: async (params = {}) => {
    const response = await api.get('/maintenance', { params })
    return response.data
  },

  // GET /api/maintenance/{id}
  getById: async (id) => {
    const response = await api.get(`/maintenance/${id}`)
    return response.data
  },

  // GET /api/maintenance/my-maintenance
  getMyMaintenance: async () => {
    const response = await api.get("/maintenance/my-maintenance");
    return response.data;
  },

  // PUT /api/maintenance/{id}/start
  start: async (id) => {
    const response = await api.put(`/maintenance/${id}/start`);
    return response.data;
  },

  // PUT /api/maintenance/{id}
  update: async (id, data) => {
    const response = await api.put(`/maintenance/${id}`, data)
    return response.data
  },

  // PUT /api/maintenance/{id}/complete
  complete: async (id) => {
    const response = await api.put(`/maintenance/${id}/complete`)
    return response.data
  },

  // GET /api/maintenance/upcoming
  getUpcoming: async () => {
    const response = await api.get('/maintenance/upcoming')
    return response.data
  },
}

export default maintenanceService
