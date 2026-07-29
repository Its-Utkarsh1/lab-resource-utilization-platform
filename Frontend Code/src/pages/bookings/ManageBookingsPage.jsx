import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  usePendingBookings,
  useApproveBooking,
  useManagerCancelBooking,
} from "../../hooks/useBookings";

const ManageBookingsPage = () => {
  const {
    data: bookings = [],
    isLoading,
  } = usePendingBookings();

  const approveMutation = useApproveBooking();
  const rejectMutation = useManagerCancelBooking();

  const handleApprove = (bookingCode) => {
    approveMutation.mutate(bookingCode);
  };

  const handleReject = (bookingCode) => {
    if (window.confirm("Reject this booking?")) {
      rejectMutation.mutate(bookingCode);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen">
          Loading...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold mb-8">
          Pending Booking Requests
        </h1>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <h2 className="text-xl font-semibold">
              No Pending Requests
            </h2>

            <p className="text-slate-500 mt-2">
              There are no booking requests awaiting approval.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">

            <table className="w-full">

              <thead className="bg-slate-100">
                <tr>
                  <th className="text-left p-4">Booking Code</th>
                  <th className="text-left p-4">User</th>
                  <th className="text-left p-4">Equipment</th>
                  <th className="text-left p-4">Purpose</th>
                  <th className="text-left p-4">Quantity</th>
                  <th className="text-left p-4">Start</th>
                  <th className="text-left p-4">End</th>
                  <th className="text-left p-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((booking) => (
                  <tr
                    key={booking.bookingCode}
                    className="border-t"
                  >
                    <td className="p-4">{booking.bookingCode}</td>
                    <td className="p-4">{booking.bookedBy}</td>
                    <td className="p-4">{booking.equipmentName}</td>
                    <td className="p-4">{booking.purpose}</td>
                    <td className="p-4">{booking.quantity}</td>

                    <td className="p-4">
                      {new Date(
                        booking.startTime
                      ).toLocaleString("en-IN")}
                    </td>

                    <td className="p-4">
                      {new Date(
                        booking.endTime
                      ).toLocaleString("en-IN")}
                    </td>

                    <td className="p-4 flex gap-2">

                      <button
                        onClick={() =>
                          handleApprove(
                            booking.bookingCode
                          )
                        }
                        disabled={approveMutation.isLoading}
                        className="bg-green-600 text-white px-4 py-2 rounded"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          handleReject(
                            booking.bookingCode
                          )
                        }
                        disabled={rejectMutation.isLoading}
                        className="bg-red-600 text-white px-4 py-2 rounded"
                      >
                        Reject
                      </button>

                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default ManageBookingsPage;