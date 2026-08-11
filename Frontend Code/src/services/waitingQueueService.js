import api from "./api";

export const getMyWaitingQueue = async () => {
    const response = await api.get("/waiting-queue/my");
    return response.data;
};