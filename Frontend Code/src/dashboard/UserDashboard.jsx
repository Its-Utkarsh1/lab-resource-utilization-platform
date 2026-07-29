import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  useStudentDashboard,
} from "../hooks/useDashboard";
import {
  useMyBookings,
  useCancelBooking,
} from "../hooks/useBookings";

const StudentDashboard = () => {

  const { user } = useAuth();

  const cancelMutation = useCancelBooking();

  const handleCancel = (bookingCode) => {
    if (window.confirm("Cancel this booking?")) {
      cancelMutation.mutate(bookingCode);
    }
  };

  const {
    data: dashboard,
    isLoading: dashboardLoading,
  } = useStudentDashboard();

  const {
    data: myBookings = [],
    isLoading: bookingsLoading,
  } = useMyBookings();

  const activeBookings = myBookings.filter(
    (booking) =>
      booking.status === "PENDING" ||
      booking.status === "APPROVED"
  );

  if (dashboardLoading || bookingsLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div className="bg-white rounded-xl shadow border p-6">
        <h1 className="text-3xl font-bold">
          Welcome, {user.fullName}
        </h1>

        <p className="text-gray-500 mt-2">
          {user.role.replaceAll("_", " ")}
        </p>

        <p className="text-sm text-gray-500 mt-1">
          {user.departmentName}
        </p>
      </div>

      {/* STATISTICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        <div className="bg-white rounded-xl shadow border p-6">
          <p className="text-slate-500 text-sm">Total Bookings</p>
          <h2 className="text-3xl font-bold mt-2">{dashboard?.totalBookings}</h2>
        </div>

        <div className="bg-white rounded-xl shadow border p-6">
          <p className="text-slate-500 text-sm">Completed Bookings</p>
          <h2 className="text-3xl font-bold mt-2">{dashboard?.completedBookings}</h2>
        </div>

        <div className="bg-white rounded-xl shadow border p-6">
          <p className="text-slate-500 text-sm">Cancelled Bookings</p>
          <h2 className="text-3xl font-bold mt-2">{dashboard?.cancelledBookings}</h2>
        </div>

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* LEFT COLUMN */}
        <div className="xl:col-span-2 space-y-6">

          {/* My Bookings */}
          <div className="bg-white rounded-xl shadow border p-6">

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">My Bookings</h2>
              <Link to="/bookings" className="text-green-600 hover:underline">
                View All →
              </Link>
            </div>

            {activeBookings.length > 0 ? (
              <div className="h-[500px] overflow-y-auto pr-2 space-y-4">
                {activeBookings.map((booking) => (
                  <div
                    key={booking.bookingCode}
                    className="border rounded-xl p-5 flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-semibold text-lg">{booking.equipmentName}</h3>
                      <p className="text-sm text-slate-500 mt-2">
                        {new Date(booking.startTime).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                      <p className="text-sm text-slate-500">
                        {new Date(booking.endTime).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                      <span className="inline-block mt-3 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                        {booking.status}
                      </span>
                    </div>

                    {(booking.status === "PENDING" ||
                      booking.status === "APPROVED") && (
                        <button
                          onClick={() => handleCancel(booking.bookingCode)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                        >
                          Cancel
                        </button>
                      )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold">No Bookings</h3>
                <p className="text-slate-500 mt-2">Browse labs and reserve equipment.</p>
                <Link
                  to="/labs"
                  className="mt-5 inline-block bg-green-600 text-white px-5 py-3 rounded-lg"
                >
                  Browse Labs
                </Link>
              </div>
            )}

          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="xl:col-span-1 space-y-6">

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow border p-6">
            <h2 className="text-xl font-semibold mb-5">Quick Actions</h2>

            <div className="space-y-4">
              <Link
                to="/labs"
                className="border rounded-xl p-4 flex gap-4 items-center hover:border-green-500 transition"
              >
                <span className="text-3xl">🧪</span>
                <div>
                  <h3 className="font-semibold">Browse Labs</h3>
                  <p className="text-sm text-slate-500">View available laboratories</p>
                </div>
              </Link>

              <Link
                to="/bookings"
                className="border rounded-xl p-4 flex gap-4 items-center hover:border-blue-500 transition"
              >
                <span className="text-3xl">📅</span>
                <div>
                  <h3 className="font-semibold">My Bookings</h3>
                  <p className="text-sm text-slate-500">View and manage bookings</p>
                </div>
              </Link>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default StudentDashboard;