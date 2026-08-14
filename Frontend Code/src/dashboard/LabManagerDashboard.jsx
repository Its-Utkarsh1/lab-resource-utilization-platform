import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useLabManagerDashboard, useWeeklyUtilization } from "../hooks/useDashboard";
import StatCard from "../components/common/StatCard";
import StatusBadge from "../components/common/StatusBadge";
import LoadingSpinner from "../components/common/LoadingSpinner";
import WeeklyUtilizationChart from "../components/common/WeeklyUtilizationChart";

// NOTE: import paths for the shared components assume src/components/common/
// — adjust if your project places them elsewhere.

const quickActions = [
  { to: "/equipment/create", label: "Add Equipment", tag: "EQ", accent: "teal" },
  { to: "/labs", label: "Manage Equipment", tag: "LAB", accent: "teal" },
  { to: "/bookings/manage", label: "Manage Bookings", tag: "BK", accent: "amber" },
  { to: "/maintenance", label: "Schedule Maintenance", tag: "MNT", accent: "amber" },
  { to: "/analytics", label: "View Analytics", tag: "AN", accent: "teal" },
];

const accentChip = {
  amber: "bg-[#E8A33D]/10 text-[#E8A33D]",
  teal: "bg-[#1F7A6C]/10 text-[#1F7A6C]",
};

const LabManagerDashboard = () => {
  const { user } = useAuth();
  const { data: dashboard, isLoading: dashboardLoading } = useLabManagerDashboard();
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
          Lab Manager Dashboard
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Equipment" value={dashboard?.totalEquipment ?? 0} color="teal" />
        <StatCard title="Equipment In Use" value={dashboard?.equipmentInUse ?? 0} color="steel" />
        <StatCard title="Maintenance Due" value={dashboard?.maintenanceDue ?? 0} color="amber" />
        <StatCard
          title="Utilization Rate"
          value={dashboard?.utilizationRate != null ? `${dashboard.utilizationRate.toFixed(2)}%` : "0.00%"}
          color="teal"
        />
      </div>

      {/* Weekly Utilization */}
      <div className="bg-white rounded-sm border border-[#D8D3C7] p-6">
        <h2 className="text-xl font-bold text-[#14181C] mb-5">Weekly Utilization</h2>
        <WeeklyUtilizationChart data={weeklyUtilization} />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-sm border border-[#D8D3C7] p-6">
        <h2 className="text-xl font-bold text-[#14181C] mb-5">Quick Actions</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
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

      {/* Equipment Status & Booking Requests */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-sm border border-[#D8D3C7] p-6">
          <h2 className="text-xl font-bold text-[#14181C] mb-4">Equipment Status</h2>

          <ul className="space-y-3">
            <li className="flex justify-between items-center border-b border-[#D8D3C7] pb-3">
              <span className="text-[#5B6770]">Available</span>
              <span className="font-mono font-bold text-[#1F7A6C]">{dashboard?.availableEquipment ?? 0}</span>
            </li>
            <li className="flex justify-between items-center border-b border-[#D8D3C7] pb-3">
              <span className="text-[#5B6770]">In Use</span>
              <span className="font-mono font-bold text-[#5B6770]">{dashboard?.equipmentInUse ?? 0}</span>
            </li>
            <li className="flex justify-between items-center border-b border-[#D8D3C7] pb-3">
              <span className="text-[#5B6770]">Maintenance</span>
              <span className="font-mono font-bold text-[#E8A33D]">{dashboard?.maintenanceEquipment ?? 0}</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-[#5B6770]">Out of Service</span>
              <span className="font-mono font-bold text-red-600">{dashboard?.outOfServiceEquipment ?? 0}</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-sm border border-[#D8D3C7] p-6">
          <h2 className="text-xl font-bold text-[#14181C] mb-4">Booking Requests</h2>

          <ul className="space-y-3">
            <li className="flex justify-between items-center border-b border-[#D8D3C7] pb-3">
              <span className="text-[#5B6770]">Pending Approval</span>
              <span className="font-mono font-bold text-[#E8A33D]">{dashboard?.pendingBookings ?? 0}</span>
            </li>
            <li className="flex justify-between items-center border-b border-[#D8D3C7] pb-3">
              <span className="text-[#5B6770]">Approved Today</span>
              <span className="font-mono font-bold text-[#1F7A6C]">{dashboard?.approvedToday ?? 0}</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-[#5B6770]">Rejected</span>
              <span className="font-mono font-bold text-red-600">{dashboard?.rejectedBookings ?? 0}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Maintenance Schedule */}
      <div className="bg-white rounded-sm border border-[#D8D3C7] p-6">
        <h2 className="text-xl font-bold text-[#14181C] mb-5">Today's Maintenance</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[#D8D3C7]">
              <tr>
                <th className="text-left py-3 px-2 font-mono text-xs tracking-widest text-[#5B6770] uppercase">Equipment</th>
                <th className="text-left py-3 px-2 font-mono text-xs tracking-widest text-[#5B6770] uppercase">Technician</th>
                <th className="text-left py-3 px-2 font-mono text-xs tracking-widest text-[#5B6770] uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {dashboard?.todayMaintenance?.length > 0 ? (
                dashboard.todayMaintenance.map((item, index) => (
                  <tr key={index} className="border-b border-[#D8D3C7] hover:bg-[#F6F5F1]">
                    <td className="py-3 px-2 text-[#14181C]">{item.equipmentName}</td>
                    <td className="py-3 px-2 text-[#5B6770]">{item.technicianName}</td>
                    <td className="py-3 px-2">
                      <StatusBadge status={item.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-[#5B6770]">
                    No maintenance scheduled.
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

export default LabManagerDashboard;