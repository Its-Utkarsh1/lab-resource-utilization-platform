import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useDepartmentHeadDashboard, useWeeklyUtilization } from "../hooks/useDashboard";
import StatCard from "../components/common/StatCard";
import StatusBadge from "../components/common/StatusBadge";
import LoadingSpinner from "../components/common/LoadingSpinner";
import WeeklyUtilizationChart from "../components/common/WeeklyUtilizationChart";

const quickActions = [
  { to: "/equipment", label: "Manage Equipment", tag: "EQ", accent: "teal" },
  { to: "/bookings", label: "View Bookings", tag: "BK", accent: "amber" },
  { to: "/analytics", label: "Analytics", tag: "AN", accent: "teal" },
  { to: "/sharing", label: "Resource Sharing", tag: "SH", accent: "amber" },
];

const accentChip = {
  amber: "bg-[#E8A33D]/10 text-[#E8A33D]",
  teal: "bg-[#1F7A6C]/10 text-[#1F7A6C]",
};

const DepartmentHeadDashboard = () => {
  const { user } = useAuth();
  const { data: dashboard, isLoading: dashboardLoading } = useDepartmentHeadDashboard();
  const { data: weeklyData, isLoading: weeklyLoading } = useWeeklyUtilization();

  const weeklyUtilization = weeklyData?.utilization ?? [0, 0, 0, 0, 0, 0, 0];

  if (dashboardLoading || weeklyLoading) {
    return <LoadingSpinner fullScreen text="Loading dashboard..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-sm border border-[#D8D3C7] border-l-2 border-l-[#1F7A6C] p-6">
        <h1 className="text-3xl font-black text-[#14181C] tracking-tight">
          Welcome back, {user?.fullName?.split(" ")[0] ?? "there"}
        </h1>
        <p className="text-[#5B6770] mt-1 font-mono text-xs tracking-widest uppercase">
          Department Head Dashboard
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Labs" value={dashboard?.totalLabs ?? 0} color="teal" />
        <StatCard title="Total Equipment" value={dashboard?.totalEquipment ?? 0} color="amber" />
        <StatCard title="Active Bookings" value={dashboard?.activeBookings ?? 0} color="teal" />
        <StatCard title="Department Users" value={dashboard?.departmentUsers ?? 0} color="amber" />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-sm border border-[#D8D3C7] p-6">
        <h2 className="text-xl font-bold text-[#14181C] mb-5">Quick Actions</h2>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="border border-[#D8D3C7] rounded-sm p-4 flex flex-col items-center text-center gap-2 hover:border-[#1F7A6C] transition-colors"
            >
              <span className={`w-9 h-9 rounded-sm flex items-center justify-center font-mono text-[10px] font-bold ${accentChip[action.accent]}`}>
                {action.tag}
              </span>
              <span className="text-sm font-medium text-[#14181C]">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Weekly Utilization */}
      <div className="bg-white rounded-sm border border-[#D8D3C7] p-6">
        <h2 className="text-xl font-bold text-[#14181C] mb-5">Weekly Utilization</h2>
        <WeeklyUtilizationChart data={weeklyUtilization} />
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-sm border border-[#D8D3C7] p-6">
        <h2 className="text-xl font-bold text-[#14181C] mb-5">Recent Department Bookings</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[#D8D3C7]">
              <tr>
                <th className="text-left py-3 px-2 font-mono text-xs tracking-widest text-[#5B6770] uppercase">Equipment</th>
                <th className="text-left py-3 px-2 font-mono text-xs tracking-widest text-[#5B6770] uppercase">User</th>
                <th className="text-left py-3 px-2 font-mono text-xs tracking-widest text-[#5B6770] uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {dashboard?.recentBookings?.length > 0 ? (
                dashboard.recentBookings.map((booking, index) => (
                  <tr key={index} className="border-b border-[#D8D3C7] hover:bg-[#F6F5F1]">
                    <td className="py-3 px-2 text-[#14181C]">{booking.equipmentName}</td>
                    <td className="py-3 px-2 text-[#5B6770]">{booking.bookedBy}</td>
                    <td className="py-3 px-2">
                      <StatusBadge status={booking.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-[#5B6770]">
                    No recent bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DepartmentHeadDashboard;