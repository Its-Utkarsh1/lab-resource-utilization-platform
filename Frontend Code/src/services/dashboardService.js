import api from "./api";

const dashboardService = {
  getWeeklyUtilization: async () => {
    const response = await api.get("/dashboard/weekly-utilization");
    return response.data;
  },

  getStudentDashboard: async () => {
    const response = await api.get("/dashboard/student");
    return response.data;
  },

  getResearcherDashboard: async () => {
    const response = await api.get("/dashboard/researcher");
    return response.data;
  },

  getFacultyDashboard: async () => {
    const response = await api.get("/dashboard/faculty");
    return response.data;
  },

  getTechnicianDashboard: async () => {
    const response = await api.get("/dashboard/technician");
    return response.data;
  },

  getLabManagerDashboard: async () => {
    const response = await api.get("/dashboard/lab-manager");
    return response.data;
  },

  getDepartmentHeadDashboard: async () => {
    const response = await api.get("/dashboard/department-head");
    return response.data;
  },

  getInstitutionAdminDashboard: async () => {
    const response = await api.get("/dashboard/institution-admin");
    return response.data;
  },

  getSystemAdminDashboard: async () => {
    const response = await api.get("/dashboard/system-admin");
    return response.data;
  },
};

export default dashboardService;