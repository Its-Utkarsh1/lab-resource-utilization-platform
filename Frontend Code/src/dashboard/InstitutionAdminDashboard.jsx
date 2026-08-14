import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useInstitutionAdminDashboard, useWeeklyUtilization } from "../hooks/useDashboard";
import StatCard from "../components/common/StatCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import WeeklyUtilizationChart from "../components/common/WeeklyUtilizationChart";

const quickActions = [
  { to: "/users", label: "Manage Users", tag: "USR", accent: "teal" },
  { to: "/labs", label: "Manage Equipment", tag: "EQ", accent: "amber" },
  { to: "/analytics", label: "Analytics", tag: "AN", accent: "teal" },
  { to: "/sharing", label: "Resource Sharing", tag: "SH", accent: "amber" },
];

const accentChip = {
  amber: "bg-[#E8A33D]/10 text-[#E8A33D]",
  teal: "bg-[#1F7A6C]/10 text-[#1F7A6C]",
};

const ACTIVITY_STATUS_STYLE = {
  Completed: "text-[#1F7A6C]",
  Running: "text-[#E8A33D]",
};

const InstitutionAdminDashboard = () => {
  const { user } = useAuth();
  const { data: dashboard, isLoading: dashboardLoading } = useInstitutionAdminDashboard();
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
          Institution Administrator Dashboard
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Departments" value={dashboard?.totalDepartments ?? 0} color="teal" />
        <StatCard title="Users" value={dashboard?.totalUsers ?? 0} color="amber" />
        <StatCard title="Equipment" value={dashboard?.totalEquipment ?? 0} color="teal" />
        <StatCard title="Monthly Bookings" value={dashboard?.monthlyBookings ?? 0} color="amber" />
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

      {/* Institution Summary & Equipment Overview */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-sm border border-[#D8D3C7] p-6">
          <h2 className="text-xl font-bold text-[#14181C] mb-4">Institution Summary</h2>

          <ul className="space-y-3">
            <li className="flex justify-between items-center border-b border-[#D8D3C7] pb-3">
              <span className="text-[#5B6770]">Total Departments</span>
              <span className="font-mono font-bold text-[#14181C]">{dashboard?.totalDepartments ?? 0}</span>
            </li>
            <li className="flex justify-between items-center border-b border-[#D8D3C7] pb-3">
              <span className="text-[#5B6770]">Total Faculty</span>
              <span className="font-mono font-bold text-[#14181C]">{dashboard?.totalFaculty ?? 0}</span>
            </li>
            <li className="flex justify-between items-center border-b border-[#D8D3C7] pb-3">
              <span className="text-[#5B6770]">Total Researchers</span>
              <span className="font-mono font-bold text-[#14181C]">{dashboard?.totalResearchers ?? 0}</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-[#5B6770]">Total Students</span>
              <span className="font-mono font-bold text-[#14181C]">{dashboard?.totalStudents ?? 0}</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-sm border border-[#D8D3C7] p-6">
          <h2 className="text-xl font-bold text-[#14181C] mb-4">Equipment Overview</h2>

          <ul className="space-y-3">
            <li className="flex justify-between items-center border-b border-[#D8D3C7] pb-3">
              <span className="text-[#5B6770]">Available</span>
              <span className="font-mono font-bold text-[#1F7A6C]">{dashboard?.availableEquipment ?? 0}</span>
            </li>
            <li className="flex justify-between items-center border-b border-[#D8D3C7] pb-3">
              <span className="text-[#5B6770]">Booked</span>
              <span className="font-mono font-bold text-[#5B6770]">{dashboard?.bookedEquipment ?? 0}</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-[#5B6770]">Maintenance</span>
              <span className="font-mono font-bold text-[#E8A33D]">{dashboard?.maintenanceEquipment ?? 0}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-sm border border-[#D8D3C7] p-6">
        <h2 className="text-xl font-bold text-[#14181C] mb-5">Recent Institution Activity</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[#D8D3C7]">
              <tr>
                <th className="text-left py-3 px-2 font-mono text-xs tracking-widest text-[#5B6770] uppercase">Department</th>
                <th className="text-left py-3 px-2 font-mono text-xs tracking-widest text-[#5B6770] uppercase">Activity</th>
                <th className="text-left py-3 px-2 font-mono text-xs tracking-widest text-[#5B6770] uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {dashboard?.recentActivities?.length > 0 ? (
                dashboard.recentActivities.map((activity, index) => (
                  <tr key={index} className="border-b border-[#D8D3C7] hover:bg-[#F6F5F1]">
                    <td className="py-3 px-2 text-[#14181C]">{activity.departmentName}</td>
                    <td className="py-3 px-2 text-[#5B6770]">{activity.activity}</td>
                    <td className="py-3 px-2">
                      <span className={`font-mono text-xs tracking-wide uppercase ${ACTIVITY_STATUS_STYLE[activity.status] || "text-[#5B6770]"}`}>
                        {activity.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-[#5B6770]">
                    No recent activity found.
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

export default InstitutionAdminDashboard;