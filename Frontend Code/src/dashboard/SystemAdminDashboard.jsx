import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  useSystemAdminDashboard,
  useWeeklyUtilization,
} from "../hooks/useDashboard";

const SystemAdminDashboard = () => {
  const { user } = useAuth();

  const {
    data: dashboard,
    isLoading: dashboardLoading,
  } = useSystemAdminDashboard();

  const {
    data: weeklyData,
    isLoading: weeklyLoading,
  } = useWeeklyUtilization();

  const weeklyUtilization =
    weeklyData?.utilization ?? [0, 0, 0, 0, 0, 0, 0];

  if (dashboardLoading || weeklyLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome back, {user?.fullName?.split(" ")[0]}
        </h1>

        <p className="text-slate-600 mt-1">
          System Administrator Dashboard
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <div className="bg-white rounded-xl shadow border p-6">
          <p className="text-sm text-slate-500">Institutions</p>
          <h2 className="text-4xl font-bold text-blue-600 mt-3">
            {dashboard?.totalInstitutions}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow border p-6">
          <p className="text-sm text-slate-500">Departments</p>
          <h2 className="text-4xl font-bold text-emerald-600 mt-3">
            {dashboard?.totalDepartments}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow border p-6">
          <p className="text-sm text-slate-500">Labs</p>
          <h2 className="text-4xl font-bold text-purple-600 mt-3">
            {dashboard?.totalLabs}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow border p-6">
          <p className="text-sm text-slate-500">Users</p>
          <h2 className="text-4xl font-bold text-green-600 mt-3">
            {dashboard?.totalUsers}
          </h2>
        </div>

      </div>


      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow border p-6">

        <h2 className="text-xl font-semibold mb-5">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">

          <Link
            to="/institutions/create"
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg p-4 text-center font-medium transition"
          >
            Create Institution
          </Link>

          <Link
            to="/departments/create"
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg p-4 text-center font-medium transition"
          >
            Create Department
          </Link>

          <Link
            to="/labs/create"
            className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg p-4 text-center font-medium transition"
          >
            Create Lab
          </Link>

          <Link
            to="/labs"
            className="bg-orange-600 hover:bg-orange-700 text-white rounded-lg p-4 text-center font-medium transition"
          >
            Manage Equipment
          </Link>

          <Link
            to="/maintenance"
            className="bg-green-600 hover:bg-green-700 text-white rounded-lg p-4 text-center font-medium transition"
          >
            Maintenance
          </Link>

        </div>

      </div>

      {/* Platform Overview */}
      <div className="bg-white rounded-xl shadow border p-6">

        <h2 className="text-xl font-semibold mb-5">
          Platform Overview
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">

          <div className="text-center">
            <p className="text-slate-500 text-sm">Institutions</p>
            <h3 className="text-3xl font-bold text-blue-600 mt-2">
              {dashboard?.totalInstitutions}
            </h3>
          </div>

          <div className="text-center">
            <p className="text-slate-500 text-sm">Departments</p>
            <h3 className="text-3xl font-bold text-emerald-600 mt-2">
              {dashboard?.totalDepartments}
            </h3>
          </div>

          <div className="text-center">
            <p className="text-slate-500 text-sm">Labs</p>
            <h3 className="text-3xl font-bold text-purple-600 mt-2">
              {dashboard?.totalLabs}
            </h3>
          </div>

          <div className="text-center">
            <p className="text-slate-500 text-sm">Equipment</p>
            <h3 className="text-3xl font-bold text-orange-600 mt-2">
              {dashboard?.totalEquipment}
            </h3>
          </div>

          <div className="text-center">
            <p className="text-slate-500 text-sm">Users</p>
            <h3 className="text-3xl font-bold text-green-600 mt-2">
              {dashboard?.totalUsers}
            </h3>
          </div>

        </div>

      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow border p-6">

        <h2 className="text-xl font-semibold mb-5">
          Recent Platform Activity
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="border-b bg-slate-50">

              <tr>
                <th className="text-left py-3 px-4">Institution</th>
                <th className="text-left py-3 px-4">Activity</th>
                <th className="text-left py-3 px-4">Status</th>
              </tr>

            </thead>

            <tbody>

              {dashboard?.recentActivities?.length > 0 ? (

                dashboard.recentActivities.map((activity, index) => (

                  <tr
                    key={index}
                    className="border-b hover:bg-slate-50"
                  >

                    <td className="py-4 px-4">
                      {activity.institutionName}
                    </td>

                    <td className="py-4 px-4">
                      {activity.activity}
                    </td>

                    <td className="py-4 px-4">

                      <span
                        className={`font-medium ${activity.status === "Completed"
                          ? "text-green-600"
                          : activity.status === "Running"
                            ? "text-amber-600"
                            : "text-blue-600"
                          }`}
                      >
                        {activity.status}
                      </span>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan={3}
                    className="text-center py-8 text-slate-500"
                  >
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