import { useQuery, useMutation, useQueryClient } from "react-query";
import notificationService from "../services/notificationService";

export const useNotifications = () =>
  useQuery(["notifications"], notificationService.getAll);

export const useUnreadNotifications = () =>
  useQuery(["unreadNotifications"], notificationService.getUnread);

export const useUnreadCount = () =>
  useQuery(["notificationCount"], notificationService.getUnreadCount);

export const useMarkRead = () => {
  const queryClient = useQueryClient();

  return useMutation(notificationService.markRead, {
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      queryClient.invalidateQueries(["notificationCount"]);
      queryClient.invalidateQueries(["unreadNotifications"]);
    },
  });
};

export const useMarkAllRead = () => {
  const queryClient = useQueryClient();

  return useMutation(notificationService.markAllRead, {
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      queryClient.invalidateQueries(["notificationCount"]);
      queryClient.invalidateQueries(["unreadNotifications"]);
    },
  });
};