import { useQuery, useMutation, useQueryClient } from "react-query";
import bookingService from "../services/bookingService";
import toast from "react-hot-toast";

export const useBookings = (params = {}) => {
  return useQuery(["bookings", params], () =>
    bookingService.getAll(params)
  );
};

export const usePendingBookings = () => {
  return useQuery(
    "pending-bookings",
    bookingService.getPendingBookings
  );
};

export const useMyBookings = () => {
  return useQuery(
    "my-bookings",
    bookingService.getMyBookings
  );
};

export const useBookingById = (id) => {
  return useQuery(
    ["booking", id],
    () => bookingService.getByCode(id),
    {
      enabled: !!id,
    }
  );
};

export const useEstimateCost = (params) => {
  return useQuery(
    ["estimate-cost", params],
    () => bookingService.estimateCost(params),
    {
      enabled:
        !!params.institutionCode &&
        !!params.labCode &&
        !!params.equipmentCode &&
        !!params.startTime &&
        !!params.endTime &&
        params.quantity > 0,
      keepPreviousData: true,
    }
  );
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation(bookingService.create, {
    onSuccess: () => {
      queryClient.invalidateQueries("bookings");
      queryClient.invalidateQueries("my-bookings");
      queryClient.invalidateQueries("pending-bookings");
      toast.success("Booking created successfully");
    },
  });
};

export const useUpdateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ id, data }) => bookingService.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("bookings");
        queryClient.invalidateQueries("my-bookings");
        queryClient.invalidateQueries("pending-bookings");
        toast.success("Booking updated successfully");
      },
    }
  );
};

export const useApproveBooking = () => {
  const queryClient = useQueryClient();

  return useMutation(bookingService.approve, {
    onSuccess: () => {
      queryClient.invalidateQueries("bookings");
      queryClient.invalidateQueries("pending-bookings");
      queryClient.invalidateQueries("my-bookings");
      toast.success("Booking approved");
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation(bookingService.cancel, {
    onSuccess: () => {
      queryClient.invalidateQueries("bookings");
      queryClient.invalidateQueries("my-bookings");
      queryClient.invalidateQueries("pending-bookings");
      toast.success("Booking cancelled");
    },
  });
};

export const useManagerCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation(bookingService.managerCancel, {
    onSuccess: () => {
      queryClient.invalidateQueries("bookings");
      queryClient.invalidateQueries("pending-bookings");
      queryClient.invalidateQueries("my-bookings");
      toast.success("Booking cancelled");
    },
  });
};