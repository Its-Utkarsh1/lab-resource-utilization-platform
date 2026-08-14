import React from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import StatusBadge from "../../components/common/StatusBadge";
import { useMyBookings, useCancelBooking } from "../../hooks/useBookings";

// Same token palette as the rest of the app:
// ink #14181C · paper #F6F5F1 · steel #5B6770 · amber #E8A33D · teal #1F7A6C · line #D8D3C7

// NOTE: was previously hardcoded to `http://localhost:8080`, which only
// works on a local machine. Reads from an env var instead — set
// VITE_API_BASE_URL in your .env (adjust the var name/access pattern if
// your build tool isn't Vite, e.g. process.env.REACT_APP_API_BASE_URL).
const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || "";

const CANCELLABLE_STATUSES = ["PENDING", "APPROVED"];

const MyBookingsPage = () => {
  const { data: myBookings = [], isLoading } = useMyBookings();
  const cancelMutation = useCancelBooking();

  // Shared across every row — track which specific booking is in flight
  // rather than trusting .isPending alone (that would show "Cancelling..."
  // on every row at once).
  const isCancelling = (bookingCode) => cancelMutation.isPending && cancelMutation.variables === bookingCode;

  const handleCancel = (bookingCode) => {
    if (window.confirm("Cancel this booking?")) {
      cancelMutation.mutate(bookingCode);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingSpinner fullScreen text="Loading your bookings..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-black text-[#14181C] tracking-tight">My Bookings</h1>
          <Link
            to="/labs"
            className="bg-[#14181C] text-[#F6F5F1] px-5 py-2.5 rounded-sm font-mono text-sm uppercase tracking-wide hover:bg-[#2a2f35] transition-colors shrink-0"
          >
            Browse Labs
          </Link>
        </div>

        {myBookings.length === 0 ? (
          <div className="bg-white rounded-sm border border-[#D8D3C7] p-10 text-center">
            <h2 className="text-2xl font-bold text-[#14181C]">No Bookings Found</h2>
            <p className="text-[#5B6770] mt-2">You have not booked any equipment yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {myBookings.map((booking) => {
              const cancelling = isCancelling(booking.bookingCode);
              return (
                <div
                  key={booking.bookingCode}
                  className="bg-white rounded-sm border border-[#D8D3C7] p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 min-w-0">
                    <img
                      src={
                        booking.equipmentImage
                          ? `${API_BASE_URL}${booking.equipmentImage}`
                          : "/images/default-equipment.png"
                      }
                      alt={booking.equipmentName}
                      className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-sm border border-[#D8D3C7] shrink-0"
                    />

                    <div className="min-w-0">
                      <h2 className="text-xl font-bold text-[#14181C]">{booking.equipmentName}</h2>

                      <dl className="text-sm text-[#5B6770] mt-2 space-y-0.5 font-mono">
                        <p><span className="text-[#14181C] font-medium">Code:</span> {booking.bookingCode}</p>
                        <p><span className="text-[#14181C] font-medium">Purpose:</span> {booking.purpose}</p>
                        <p><span className="text-[#14181C] font-medium">Qty:</span> {booking.quantity}</p>
                        <p><span className="text-[#14181C] font-medium">Start:</span> {new Date(booking.startTime).toLocaleString("en-IN")}</p>
                        <p><span className="text-[#14181C] font-medium">End:</span> {new Date(booking.endTime).toLocaleString("en-IN")}</p>
                      </dl>

                      <div className="mt-3">
                        <StatusBadge status={booking.status} />
                      </div>
                    </div>
                  </div>

                  {CANCELLABLE_STATUSES.includes(booking.status) && (
                    <button
                      onClick={() => handleCancel(booking.bookingCode)}
                      disabled={cancelling}
                      className="shrink-0 border border-red-200 text-red-600 px-5 py-2.5 rounded-sm font-mono text-sm uppercase tracking-wide hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {cancelling ? "Cancelling..." : "Cancel Booking"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyBookingsPage;