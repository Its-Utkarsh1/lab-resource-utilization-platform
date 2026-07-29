import api from "./api";

const analyticsService = {
  getSystemAnalytics: async () => {
    const { data } = await api.get("/analytics/system");
    return data;
  },

  getInstitutionAnalytics: async () => {
    const { data } = await api.get("/analytics/institution");
    return data;
  },

  getLabAnalytics: async () => {
    const { data } = await api.get("/analytics/lab");
    return data;
  },

  getRevenueByEquipment: async () => {
    const { data } = await api.get("/analytics/revenue/equipment");
    return data;
  },

  getRevenueByLab: async () => {
    const { data } = await api.get("/analytics/revenue/lab");
    return data;
  },

  getEquipmentUsage: async () => {
    const { data } = await api.get("/analytics/equipment/usage");
    return data;
  },

  getTopEquipment: async () => {
    const { data } = await api.get("/analytics/equipment/top");
    return data;
  },

  getLeastEquipment: async () => {
    const { data } = await api.get("/analytics/equipment/least");
    return data;
  },

  getMonthlyBookings: async () => {
    const { data } = await api.get("/analytics/bookings/monthly");
    return data;
  },

  getBookingTrend: async () => {
    const { data } = await api.get("/analytics/bookings/trend");
    return data;
  },

  getWaitingQueueAnalytics: async () => {
    const { data } = await api.get("/analytics/waiting-queue");
    return data;
  },
};

export default analyticsService;