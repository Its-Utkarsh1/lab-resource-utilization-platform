import React from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  useMyBookings,
  useCancelBooking,
} from "../../hooks/useBookings";

const MyBookingsPage = () => {
  const {
    data: myBookings = [],
    isLoading,
  } = useMyBookings();

  const cancelMutation = useCancelBooking();

  const handleCancel = (bookingCode) => {
    if (window.confirm("Cancel this booking?")) {
      cancelMutation.mutate(bookingCode);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen text-xl">
          Loading...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            My Bookings
          </h1>

          <Link
            to="/labs"
            className="bg-green-600 text-white px-5 py-2 rounded-lg"
          >
            Browse Labs
          </Link>
        </div>

        {myBookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-10 text-center">
            <h2 className="text-2xl font-semibold">
              No Bookings Found
            </h2>

            <p className="text-slate-500 mt-2">
              You have not booked any equipment yet.
            </p>
          </div>
        ) : (
          <div className="space-y-5">

            {myBookings.map((booking) => (

              <div
                key={booking.bookingCode}
                className="bg-white rounded-xl shadow border p-6 flex justify-between items-center"
              >

                <div>

                  <h2 className="text-xl font-semibold">
                    {booking.equipmentName}
                  </h2>

                  <p className="text-sm text-slate-500 mt-2">
                    Booking Code :
                    {" "}
                    {booking.bookingCode}
                  </p>

                  <p className="text-sm text-slate-500">
                    Purpose :
                    {" "}
                    {booking.purpose}
                  </p>

                  <p className="text-sm text-slate-500">
                    Quantity :
                    {" "}
                    {booking.quantity}
                  </p>

                  <p className="text-sm text-slate-500">
                    Start :
                    {" "}
                    {new Date(booking.startTime).toLocaleString("en-IN")}
                  </p>

                  <p className="text-sm text-slate-500">
                    End :
                    {" "}
                    {new Date(booking.endTime).toLocaleString("en-IN")}
                  </p>

                  <span className="inline-block mt-3 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    {booking.status}
                  </span>

                </div>

                {booking.status === "PENDING" && (
                  <button
                    onClick={() => handleCancel(booking.bookingCode)}
                    disabled={cancelMutation.isPending}
                    className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400"
                  >
                    {cancelMutation.isPending
                      ? "Cancelling..."
                      : "Cancel Booking"}
                  </button>
                )}

              </div>

            ))}

          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default MyBookingsPage;