import api from "./api";

const userService = {
  // POST /api/users
  create: async (data) => {
    const response = await api.post("/users", data);
    return response.data;
  },

  // GET /api/users/{email}
  getByEmail: async (email) => {
    const response = await api.get(`/users/${email}`);
    return response.data;
  },

  // GET /api/users/institutionCode/{institutionCode}
  getByInstitution: async (institutionCode) => {
    const response = await api.get(
      `/users/institutionCode/${institutionCode}`
    );
    return response.data;
  },

  getUsersByDepartment: async (institutionCode, departmentName) => {
  const response = await api.get(
    `/users/${institutionCode}/${encodeURIComponent(departmentName)}`
  );
  return response.data;
},

  // PUT /api/users
  update: async (data) => {
    const response = await api.put("/users", data);
    return response.data;
  },

  // GET /api/users/lab-technicians
  getLabTechnicians: async () => {
    const response = await api.get("/users/lab-technicians");
    return response.data;
  },

  // DELETE /api/users/{email}
  delete: async (email) => {
    const response = await api.delete(`/users/${email}`);
    return response.data;
  },
};

export default userService;