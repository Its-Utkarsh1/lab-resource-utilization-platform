import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import toast from "react-hot-toast";
import {
  usePendingBookings,
  useApproveBooking,
  useManagerCancelBooking,
} from "../../hooks/useBookings";

// Same token palette as the rest of the app:
// ink #14181C · paper #F6F5F1 · steel #5B6770 · amber #E8A33D · teal #1F7A6C · line #D8D3C7

const ManageBookingsPage = () => {
  const { data: bookings = [], isLoading } = usePendingBookings();

  const approveMutation = useApproveBooking();
  const rejectMutation = useManagerCancelBooking();

  const handleApprove = (bookingCode) => {
    approveMutation.mutate(bookingCode, {
      onSuccess: () => toast.success("Booking approved"),
      onError: (err) => toast.error(err.response?.data?.message || "Failed to approve booking"),
    });
  };

  const handleReject = (bookingCode) => {
    if (window.confirm("Reject this booking?")) {
      rejectMutation.mutate(bookingCode, {
        onSuccess: () => toast.success("Booking rejected"),
        onError: (err) => toast.error(err.response?.data?.message || "Failed to reject booking"),
      });
    }
  };

  // These mutation hooks are shared across every row, so .isLoading alone
  // would disable ALL rows' buttons whenever ANY row is being processed.
  // Track the specific bookingCode in flight instead.
  const isApproving = (bookingCode) => approveMutation.isLoading && approveMutation.variables === bookingCode;
  const isRejecting = (bookingCode) => rejectMutation.isLoading && rejectMutation.variables === bookingCode;

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingSpinner fullScreen text="Loading pending requests..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-black text-[#14181C] tracking-tight mb-8">Pending Booking Requests</h1>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-sm border border-[#D8D3C7] p-8 text-center">
            <h2 className="text-xl font-bold text-[#14181C]">No Pending Requests</h2>
            <p className="text-[#5B6770] mt-2">There are no booking requests awaiting approval.</p>
          </div>
        ) : (
          <div className="bg-white rounded-sm border border-[#D8D3C7] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#F6F5F1] border-b border-[#D8D3C7]">
                  <tr>
                    <th className="text-left p-4 font-mono text-xs tracking-widest text-[#5B6770] uppercase">Booking Code</th>
                    <th className="text-left p-4 font-mono text-xs tracking-widest text-[#5B6770] uppercase">User</th>
                    <th className="text-left p-4 font-mono text-xs tracking-widest text-[#5B6770] uppercase">Equipment</th>
                    <th className="text-left p-4 font-mono text-xs tracking-widest text-[#5B6770] uppercase">Purpose</th>
                    <th className="text-left p-4 font-mono text-xs tracking-widest text-[#5B6770] uppercase">Qty</th>
                    <th className="text-left p-4 font-mono text-xs tracking-widest text-[#5B6770] uppercase">Start</th>
                    <th className="text-left p-4 font-mono text-xs tracking-widest text-[#5B6770] uppercase">End</th>
                    <th className="text-left p-4 font-mono text-xs tracking-widest text-[#5B6770] uppercase">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#D8D3C7]">
                  {bookings.map((booking) => {
                    const approving = isApproving(booking.bookingCode);
                    const rejecting = isRejecting(booking.bookingCode);
                    const anyBusy = approving || rejecting;

                    return (
                      <tr key={booking.bookingCode} className="hover:bg-[#F6F5F1]">
                        <td className="p-4 font-mono text-xs text-[#5B6770]">{booking.bookingCode}</td>
                        <td className="p-4 text-[#14181C]">{booking.bookedBy}</td>
                        <td className="p-4 text-[#14181C]">{booking.equipmentName}</td>
                        <td className="p-4 text-[#5B6770]">{booking.purpose}</td>
                        <td className="p-4 font-mono text-[#14181C]">{booking.quantity}</td>
                        <td className="p-4 font-mono text-xs text-[#5B6770]">
                          {new Date(booking.startTime).toLocaleString("en-IN")}
                        </td>
                        <td className="p-4 font-mono text-xs text-[#5B6770]">
                          {new Date(booking.endTime).toLocaleString("en-IN")}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(booking.bookingCode)}
                              disabled={anyBusy}
                              className="bg-[#1F7A6C] text-white px-3 py-1.5 rounded-sm text-xs font-mono uppercase tracking-wide hover:bg-[#175f54] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              {approving ? "Approving..." : "Approve"}
                            </button>
                            <button
                              onClick={() => handleReject(booking.bookingCode)}
                              disabled={anyBusy}
                              className="border border-red-200 text-red-600 px-3 py-1.5 rounded-sm text-xs font-mono uppercase tracking-wide hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              {rejecting ? "Rejecting..." : "Reject"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManageBookingsPage;