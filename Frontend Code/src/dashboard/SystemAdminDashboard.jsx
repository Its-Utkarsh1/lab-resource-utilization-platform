import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  useSystemAdminDashboard,
  useWeeklyUtilization,
} from "../hooks/useDashboard";

// Same token palette as the rest of the app:
// ink #14181C · paper #F6F5F1 · steel #5B6770 · amber #E8A33D · teal #1F7A6C · line #D8D3C7

const STAT_ACCENTS = ["#E8A33D", "#1F7A6C", "#E8A33D", "#1F7A6C", "#E8A33D"];

const quickActions = [
  { to: "/institutions/create", label: "Create Institution", tag: "INST" },
  { to: "/departments/create", label: "Create Department", tag: "DEPT" },
  { to: "/labs/create", label: "Create Lab", tag: "LAB" },
  { to: "/labs", label: "Manage Equipment", tag: "EQ" },
  { to: "/maintenance", label: "Maintenance", tag: "MNT" },
];

const ACTIVITY_STATUS_STYLE = {
  Completed: "text-[#1F7A6C]",
  Running: "text-[#E8A33D]",
};

const WeeklyUtilizationChart = ({ data }) => {
  const max = Math.max(...data, 1);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="flex items-end gap-3 h-40">
      {data.map((value, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
          <span className="font-mono text-xs text-[#5B6770]">{value}%</span>
          <div className="w-full bg-[#F6F5F1] rounded-sm relative h-full flex items-end overflow-hidden">
            <div
              className="w-full bg-[#1F7A6C] rounded-sm transition-all"
              style={{ height: `${(value / max) * 100}%` }}
            />
          </div>
          <span className="font-mono text-[10px] tracking-widest text-[#5B6770] uppercase">
            {days[i] ?? i + 1}
          </span>
        </div>
      ))}
    </div>
  );
};

const SystemAdminDashboard = () => {
  const { user } = useAuth();

  const { data: dashboard, isLoading: dashboardLoading } = useSystemAdminDashboard();
  const { data: weeklyData, isLoading: weeklyLoading } = useWeeklyUtilization();

  const weeklyUtilization = weeklyData?.utilization ?? [0, 0, 0, 0, 0, 0, 0];

  if (dashboardLoading || weeklyLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-3">
        <div className="h-8 w-8 border-2 border-[#1F7A6C] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-mono tracking-wide text-[#5B6770] uppercase">Loading dashboard...</p>
      </div>
    );
  }

  const stats = [
    { label: "Institutions", value: dashboard?.totalInstitutions },
    { label: "Departments", value: dashboard?.totalDepartments },
    { label: "Labs", value: dashboard?.totalLabs },
    { label: "Equipment", value: dashboard?.totalEquipment },
    { label: "Users", value: dashboard?.totalUsers },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-sm border border-[#D8D3C7] border-l-2 border-l-[#E8A33D] p-6">
        <h1 className="text-3xl font-black text-[#14181C] tracking-tight">
          Welcome back, {user?.fullName?.split(" ")[0] ?? "Admin"}
        </h1>
        <p className="text-[#5B6770] mt-1 font-mono text-xs tracking-widest uppercase">
          System Administrator Dashboard
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
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
              {stat.value ?? 0}
            </h2>
          </div>
        ))}
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
              <span className="w-9 h-9 rounded-sm bg-[#1F7A6C]/10 text-[#1F7A6C] flex items-center justify-center font-mono text-[10px] font-bold">
                {action.tag}
              </span>
              <span className="text-sm font-medium text-[#14181C]">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-sm border border-[#D8D3C7] p-6">
        <h2 className="text-xl font-bold text-[#14181C] mb-5">Recent Platform Activity</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[#D8D3C7]">
              <tr>
                <th className="text-left py-3 px-4 font-mono text-xs tracking-widest text-[#5B6770] uppercase">Institution</th>
                <th className="text-left py-3 px-4 font-mono text-xs tracking-widest text-[#5B6770] uppercase">Activity</th>
                <th className="text-left py-3 px-4 font-mono text-xs tracking-widest text-[#5B6770] uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {dashboard?.recentActivities?.length > 0 ? (
                dashboard.recentActivities.map((activity, index) => (
                  <tr key={index} className="border-b border-[#D8D3C7] hover:bg-[#F6F5F1]">
                    <td className="py-4 px-4 text-[#14181C]">{activity.institutionName}</td>
                    <td className="py-4 px-4 text-[#5B6770]">{activity.activity}</td>
                    <td className="py-4 px-4">
                      <span className={`font-mono text-xs tracking-wide uppercase ${ACTIVITY_STATUS_STYLE[activity.status] || "text-[#5B6770]"}`}>
                        {activity.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-[#5B6770]">
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

export default SystemAdminDashboard;