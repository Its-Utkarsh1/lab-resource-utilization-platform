import api from "./api";

const equipmentService = {
  create: async (data) => {
    const response = await api.post("/equipment", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  getDepartmentEquipment: async (institutionCode, departmentName) => {
    const response = await api.get("/equipment/department", {
      params: {
        institutionCode,
        departmentName,
      },
    });
    return response.data;
  },

  getByCode: async (institutionCode, labCode, equipmentCode) => {
    const response = await api.get(
      `/equipment/${institutionCode}/${labCode}/${equipmentCode}`
    );
    return response.data;
  },

  getByLab: async (institutionCode, labCode) => {
    const response = await api.get(
      `/equipment/${institutionCode}/${labCode}`
    );
    return response.data;
  },

  updateStatus: async (equipmentCode, status) => {
    const response = await api.patch(
      `/equipment/${equipmentCode}/status`,
      null,
      {
        params: { status },
      }
    );

    return response.data;
  },

  update: async (data) => {
    const response = await api.put("/equipment", data);
    return response.data;
  },

  delete: async (institutionCode, labCode, equipmentCode) => {
    const response = await api.delete(
      `/equipment/${institutionCode}/${labCode}/${equipmentCode}`
    );
    return response.data;
  },
};

export default equipmentService;