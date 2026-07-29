import api from './api'

const departmentService = {
  // POST /api/departments
  create: async (data) => {
    const response = await api.post('/departments', data)
    return response.data
  },

  // POST /api/departments/search
  getByName: async (data) => {
    const response = await api.post('/departments/search', data)
    return response.data
  },

  // GET /api/departments/{institutionCode}
  getByInstitution: async (institutionCode) => {
    const response = await api.get(`/departments/${institutionCode}`)
    return response.data
  },

  // PUT /api/departments/{newName}
  update: async (request, newName) => {
    const response = await api.put(`/departments/${newName}`, request)
    return response.data
  },

  // DELETE /api/departments
  delete: async (data) => {
    const response = await api.delete('/departments', { data })
    return response.data
  },
}

export default departmentService
