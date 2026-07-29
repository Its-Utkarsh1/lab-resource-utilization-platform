import api from "./api";

const bookingService = {
  // POST /api/bookings
  create: async (data) => {
    const response = await api.post("/bookings", data);
    return response.data;
  },

  // GET /api/bookings
  getAll: async (params = {}) => {
    const response = await api.get("/bookings", { params });
    return response.data;
  },

  // GET /api/bookings/pending
  getPendingBookings: async () => {
    const response = await api.get("/bookings/pending");
    return response.data;
  },

  estimateCost: async (params) => {
    const response = await api.get("/bookings/estimate-cost", {
      params,
    });

    return response.data;
  },

  // GET /api/bookings/my-bookings
  getMyBookings: async () => {
    const response = await api.get("/bookings/my-bookings");
    return response.data;
  },

  // GET /api/bookings/{bookingCode}
  getByCode: async (bookingCode) => {
    const response = await api.get(`/bookings/${bookingCode}`);
    return response.data;
  },

  // PUT /api/bookings/{bookingCode}
  update: async (bookingCode, data) => {
    const response = await api.put(`/bookings/${bookingCode}`, data);
    return response.data;
  },

  // PUT /api/bookings/{bookingCode}/approve
  approve: async (bookingCode) => {
    const response = await api.patch(
      `/bookings/${bookingCode}/manager/approve`
    );
    return response.data;
  },

  // PUT /api/bookings/{bookingCode}/cancel
  cancel: async (bookingCode) => {
    const response = await api.put(
      `/bookings/${bookingCode}/cancel`
    );
    return response.data;
  },

  // PATCH /api/bookings/{bookingCode}/manager/cancel
  managerCancel: async (bookingCode) => {
    const response = await api.patch(
      `/bookings/${bookingCode}/manager/cancel`
    );
    return response.data;
  },

  // GET /api/bookings/calendar
  getCalendar: async (params) => {
    const response = await api.get("/bookings/calendar", {
      params,
    });
    return response.data;
  },
};

export default bookingService;