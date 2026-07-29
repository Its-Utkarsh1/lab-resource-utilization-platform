import api from "./api";

const notificationService = {
  getAll: async () => {
    const response = await api.get("/notifications");
    return response.data;
  },

  getUnread: async () => {
    const response = await api.get("/notifications/unread");
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get("/notifications/count");
    return response.data;
  },

  markRead: async (id) => {
    await api.put(`/notifications/${id}/read`);
  },

  markAllRead: async () => {
    await api.put("/notifications/read-all");
  },
};

export default notificationService;