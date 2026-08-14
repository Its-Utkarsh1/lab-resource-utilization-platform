import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useMyWaitingQueue } from "../hooks/useWaitingQueue";
import { useStudentDashboard } from "../hooks/useDashboard";
import { useMyBookings, useCancelBooking } from "../hooks/useBookings";

// Same token palette as the rest of the app:
// ink #14181C · paper #F6F5F1 · steel #5B6770 · amber #E8A33D · teal #1F7A6C · line #D8D3C7

const STATUS_STYLES = {
  PENDING: "bg-[#E8A33D]/10 text-[#E8A33D]",
  APPROVED: "bg-[#1F7A6C]/10 text-[#1F7A6C]",
  COMPLETED: "bg-[#1F7A6C]/10 text-[#1F7A6C]",
  CANCELLED: "bg-[#5B6770]/10 text-[#5B6770]",
  REJECTED: "bg-red-50 text-red-600",
};
const statusBadgeClass = (status) =>
  `inline-block px-3 py-1 rounded-sm text-xs font-mono tracking-wide uppercase ${
    STATUS_STYLES[status] || "bg-[#5B6770]/10 text-[#5B6770]"
  }`;

const STATUS_DOT = {
  PENDING: "bg-[#E8A33D]",
  APPROVED: "bg-[#1F7A6C]",
  COMPLETED: "bg-[#1F7A6C]",
  CANCELLED: "bg-[#5B6770]",
  REJECTED: "bg-red-500",
};

const STAT_ACCENTS = ["#E8A33D", "#1F7A6C", "#E8A33D", "#1F7A6C"];

const StudentDashboard = () => {
  const { user } = useAuth();
  const cancelMutation = useCancelBooking();

  const handleCancel = (bookingCode) => {
    if (window.confirm("Cancel this booking?")) {
      cancelMutation.mutate(bookingCode);
    }
  };

  const { data: dashboard, isLoading: dashboardLoading } = useStudentDashboard();
  const { data: myBookings = [], isLoading: bookingsLoading } = useMyBookings();
  const { data: waitingQueue = [], isLoading: waitingQueueLoading } = useMyWaitingQueue();

  const activeBookings = myBookings.filter(
    (booking) => booking.status === "PENDING" || booking.status === "APPROVED"
  );

  if (dashboardLoading || bookingsLoading || waitingQueueLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-3">
        <div className="h-8 w-8 border-2 border-[#1F7A6C] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-mono tracking-wide text-[#5B6770] uppercase">Loading dashboard...</p>
      </div>
    );
  }

  const stats = [
    { label: "Active Bookings", value: activeBookings.length },
    { label: "Total Bookings", value: dashboard?.totalBookings ?? 0 },
    { label: "Completed", value: dashboard?.completedBookings ?? 0 },
    { label: "Cancelled", value: dashboard?.cancelledBookings ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-sm border border-[#D8D3C7] border-l-2 border-l-[#1F7A6C] p-6">
        <h1 className="text-3xl font-black text-[#14181C] tracking-tight">
          Welcome, {user?.fullName ?? "there"}
        </h1>
        <p className="text-[#5B6770] mt-2 font-mono text-xs tracking-widest uppercase">
          {user?.role?.replaceAll("_", " ")}
        </p>
        {user?.departmentName && (
          <p className="text-sm text-[#5B6770] mt-1">{user.departmentName}</p>
        )}
      </div>

      {/* STATISTICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="bg-white rounded-sm border border-[#D8D3C7] border-t-2 p-6"
            style={{ borderTopColor: STAT_ACCENTS[i % STAT_ACCENTS.length] }}
          >
            <p className="text-[#5B6770] text-xs font-mono tracking-widest uppercase">{stat.label}</p>
            <h2
              className="text-3xl font-mono font-bold mt-2"
              style={{ color: STAT_ACCENTS[i % STAT_ACCENTS.length] }}
            >
              {stat.value}
            </h2>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="xl:col-span-2 space-y-6">
          {/* My Bookings */}
          <div className="bg-white rounded-sm border border-[#D8D3C7] p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#14181C]">My Bookings</h2>
              <Link to="/bookings" className="text-[#1F7A6C] hover:text-[#175f54] text-sm font-mono uppercase tracking-wide">
                View All →
              </Link>
            </div>

            {activeBookings.length > 0 ? (
              <div className="h-[500px] overflow-y-auto pr-2 -mr-2 space-y-4">
                {activeBookings.map((booking) => (
                  <div
                    key={booking.bookingCode}
                    className="border border-[#D8D3C7] rounded-sm p-5 flex justify-between items-center gap-4"
                  >
                    <div>
                      <h3 className="font-bold text-lg text-[#14181C] flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[booking.status] || "bg-[#5B6770]"}`} />
                        {booking.equipmentName}
                      </h3>
                      <p className="text-sm text-[#5B6770] mt-2 font-mono">
                        {new Date(booking.startTime).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                      <p className="text-sm text-[#5B6770] font-mono">
                        {new Date(booking.endTime).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                      <span className={`mt-3 ${statusBadgeClass(booking.status)}`}>{booking.status}</span>
                    </div>

                    {(booking.status === "PENDING" || booking.status === "APPROVED") && (
                      <button
                        onClick={() => handleCancel(booking.bookingCode)}
                        disabled={cancelMutation.isLoading}
                        className="shrink-0 border border-red-200 text-red-600 px-4 py-2 rounded-sm text-sm font-mono uppercase tracking-wide hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-bold text-[#14181C]">No Bookings</h3>
                <p className="text-[#5B6770] mt-2">Browse labs and reserve equipment.</p>
                <Link
                  to="/labs"
                  className="mt-5 inline-block bg-[#14181C] text-[#F6F5F1] px-5 py-3 rounded-sm font-mono text-sm uppercase tracking-wide hover:bg-[#2a2f35] transition-colors"
                >
                  Browse Labs
                </Link>
              </div>
            )}
          </div>

          <div className="bg-white rounded-sm border border-[#D8D3C7] p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#14181C]">My Waiting Queue</h2>
            </div>

            {waitingQueue.length > 0 ? (
              <div className="space-y-4">
                {waitingQueue.map((queue) => (
                  <div key={queue.id} className="border border-[#D8D3C7] rounded-sm p-4">
                    <h3 className="font-bold text-[#14181C] flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[queue.status] || "bg-[#E8A33D]"}`} />
                      {queue.equipmentName}
                    </h3>
                    <p className="text-sm text-[#5B6770] font-mono mt-1">
                      Equipment Code: {queue.equipmentCode}
                    </p>
                    <p className="text-sm text-[#5B6770] font-mono">Position: {queue.position}</p>
                    <span className={`mt-2 ${statusBadgeClass(queue.status)}`}>{queue.status}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#5B6770]">You are not in any waiting queue.</p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="xl:col-span-1 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-sm border border-[#D8D3C7] p-6">
            <h2 className="text-xl font-bold text-[#14181C] mb-5">Quick Actions</h2>

            <div className="space-y-3">
              <Link
                to="/labs"
                className="border border-[#D8D3C7] rounded-sm p-4 flex gap-4 items-center hover:border-[#1F7A6C] transition-colors"
              >
                <span className="w-9 h-9 rounded-sm bg-[#1F7A6C]/10 text-[#1F7A6C] flex items-center justify-center font-mono text-xs font-bold shrink-0">
                  EQ
                </span>
                <div>
                  <h3 className="font-bold text-[#14181C]">Browse Labs</h3>
                  <p className="text-sm text-[#5B6770]">View available laboratories</p>
                </div>
              </Link>

              <Link
                to="/bookings"
                className="border border-[#D8D3C7] rounded-sm p-4 flex gap-4 items-center hover:border-[#E8A33D] transition-colors"
              >
                <span className="w-9 h-9 rounded-sm bg-[#E8A33D]/10 text-[#E8A33D] flex items-center justify-center font-mono text-xs font-bold shrink-0">
                  SC
                </span>
                <div>
                  <h3 className="font-bold text-[#14181C]">My Bookings</h3>
                  <p className="text-sm text-[#5B6770]">View and manage bookings</p>
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