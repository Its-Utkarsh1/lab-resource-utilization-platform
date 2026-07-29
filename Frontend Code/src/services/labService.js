import api from "./api";

const labService = {
  create: async (data) => {
    const response = await api.post("/labs", data);
    return response.data;
  },

  getByCode: async (institutionCode, labCode) => {
    const response = await api.get(`/labs/${institutionCode}/${labCode}`);
    return response.data;
  },

  getByInstitution: async (institutionCode) => {
    const response = await api.get(`/labs/${institutionCode}`);
    return response.data;
  },

  getByDepartment: async (institutionCode, departmentName) => {
    const response = await api.get("/labs/department", {
      params: {
        institutionCode,
        departmentName,
      },
    });

    return response.data;
  },

  update: async (data) => {
    const response = await api.put("/labs", data);
    return response.data;
  },

  delete: async (institutionCode, labCode) => {
    const response = await api.delete(
      `/labs/${institutionCode}/${labCode}`
    );
    return response.data;
  },
};

export default labService;