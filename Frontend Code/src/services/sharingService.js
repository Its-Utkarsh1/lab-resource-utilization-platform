import api from "./api";

const sharingService = {
  // Get institutions except logged-in user's institution
  getAvailableInstitutions: async () => {
    const response = await api.get("/sharing/institutions");
    return response.data;
  },

  // Available equipment
  getAvailableEquipment: async (
    institutionCode,
    departmentName
  ) => {
    const response = await api.get("/sharing/available", {
      params: {
        institutionCode,
        departmentName,
      },
    });
    return response.data;
  },

  // Request equipment
  requestEquipment: async (data) => {
    const response = await api.post("/sharing/request", data);
    return response.data;
  },

  // Incoming requests
  getIncomingRequests: async () => {
    const response = await api.get("/sharing/incoming");
    return response.data;
  },

  // Outgoing requests
  getOutgoingRequests: async () => {
    const response = await api.get("/sharing/outgoing");
    return response.data;
  },

  // Sharing history
  getSharingHistory: async () => {
    const response = await api.get("/sharing/history");
    return response.data;
  },

  // Get sharing by code
  getSharingByCode: async (sharingCode) => {
    const response = await api.get(`/sharing/${sharingCode}`);
    return response.data;
  },

  // Approve request
  approveRequest: async (sharingCode) => {
    const response = await api.put(`/sharing/${sharingCode}/approve`);
    return response.data;
  },

  // Reject request
  rejectRequest: async (sharingCode) => {
    const response = await api.put(`/sharing/${sharingCode}/reject`);
    return response.data;
  },

  // Start sharing
  startSharing: async (sharingCode) => {
    const response = await api.put(`/sharing/${sharingCode}/start`);
    return response.data;
  },

  getDepartments: async (institutionCode) => {
    const response = await api.get(
      `/sharing/departments?institutionCode=${institutionCode}`
    );
    return response.data;
  },

  // Complete sharing
  completeSharing: async (sharingCode) => {
    const response = await api.put(`/sharing/${sharingCode}/complete`);
    return response.data;
  },

  // Cancel request
  cancelSharing: async (sharingCode) => {
    const response = await api.put(`/sharing/${sharingCode}/cancel`);
    return response.data;
  },
};

export default sharingService;