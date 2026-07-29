import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  useInstitutionAdminDashboard,
  useWeeklyUtilization,
} from "../hooks/useDashboard";

const InstitutionAdminDashboard = () => {
  const { user } = useAuth();
  const {
    data: dashboard,
    isLoading: dashboardLoading,
  } = useInstitutionAdminDashboard();

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
          Institution Administrator Dashboard
        </p>
      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <div className="bg-white rounded-xl shadow border p-6">
          <p className="text-sm text-slate-500">Departments</p>
          <h2 className="text-4xl font-bold text-blue-600 mt-3">{dashboard?.totalDepartments}</h2>
        </div>

        <div className="bg-white rounded-xl shadow border p-6">
          <p className="text-sm text-slate-500">Users</p>
          <h2 className="text-4xl font-bold text-green-600 mt-3">{dashboard?.totalUsers}</h2>
        </div>

        <div className="bg-white rounded-xl shadow border p-6">
          <p className="text-sm text-slate-500">Equipment</p>
          <h2 className="text-4xl font-bold text-purple-600 mt-3">{dashboard?.totalEquipment}</h2>
        </div>

        <div className="bg-white rounded-xl shadow border p-6">
          <p className="text-sm text-slate-500">Monthly Bookings</p>
          <h2 className="text-4xl font-bold text-orange-600 mt-3">{dashboard?.monthlyBookings}</h2>
        </div>

      </div>

      {/* Quick Actions */}

      <div className="bg-white rounded-xl shadow border p-6">

        <h2 className="text-xl font-semibold mb-5">
          Quick Actions
        </h2>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">

          <Link
            to="/users"
            className="bg-green-600 text-white rounded-lg p-4 text-center hover:bg-green-700"
          >
            Manage Users
          </Link>

          <Link
            to="/labs"
            className="bg-blue-600 text-white rounded-lg p-4 text-center hover:bg-blue-700"
          >
            Manage Equipment
          </Link>

          <Link
            to="/analytics"
            className="bg-purple-600 text-white rounded-lg p-4 text-center hover:bg-purple-700"
          >
            Analytics
          </Link>

          <Link
            to="/sharing"
            className="bg-orange-600 text-white rounded-lg p-4 text-center hover:bg-orange-700"
          >
            Resource Sharing
          </Link>

        </div>

      </div>

      <div className="bg-white rounded-xl shadow border p-6">

        <h2 className="text-xl font-semibold mb-6">
          Weekly Utilization
        </h2>

        <div className="flex items-end justify-between h-56">

          {weeklyUtilization.map((value, index) => (

            <div
              key={index}
              className="flex flex-col items-center gap-2"
            >

              <div
                className="w-8 rounded-t-lg bg-green-500"
                style={{
                  height: `${Math.max(value * 12, 8)}px`,
                }}
              />

              <span className="text-xs">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
              </span>

              <span className="text-xs font-semibold">
                {value}
              </span>

            </div>

          ))}

        </div>

      </div>

      {/* Institution Summary */}

      <div className="grid lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-xl shadow border p-6">

          <h2 className="text-xl font-semibold mb-4">
            Institution Summary
          </h2>

          <ul className="space-y-3">

            <li className="flex justify-between">
              <span>Total Departments</span>
              <span className="font-semibold">{dashboard?.totalDepartments}</span>
            </li>

            <li className="flex justify-between">
              <span>Total Faculty</span>
              <span className="font-semibold">{dashboard?.totalFaculty}</span>
            </li>

            <li className="flex justify-between">
              <span>Total Researchers</span>
              <span className="font-semibold">{dashboard?.totalResearchers}</span>
            </li>

            <li className="flex justify-between">
              <span>Total Students</span>
              <span className="font-semibold">{dashboard?.totalStudents}</span>
            </li>

          </ul>

        </div>

        <div className="bg-white rounded-xl shadow border p-6">

          <h2 className="text-xl font-semibold mb-4">
            Equipment Overview
          </h2>

          <ul className="space-y-3">

            <li className="flex justify-between">
              <span>Available</span>
              <span className="font-semibold text-green-600">{dashboard?.availableEquipment}</span>
            </li>

            <li className="flex justify-between">
              <span>Booked</span>
              <span className="font-semibold text-blue-600">{dashboard?.bookedEquipment}</span>
            </li>

            <li className="flex justify-between">
              <span>Maintenance</span>
              <span className="font-semibold text-red-600">{dashboard?.maintenanceEquipment}</span>
            </li>

          </ul>

        </div>

      </div>

      {/* Recent Activity */}

      <div className="bg-white rounded-xl shadow border p-6">

        <h2 className="text-xl font-semibold mb-5">
          Recent Institution Activity
        </h2>

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="text-left py-3">Department</th>
              <th className="text-left py-3">Activity</th>
              <th className="text-left py-3">Status</th>

            </tr>

          </thead>

          <tbody>

            {dashboard?.recentActivities?.length > 0 ? (

              dashboard.recentActivities.map((activity, index) => (

                <tr
                  key={index}
                  className="border-b"
                >

                  <td className="py-3">
                    {activity.departmentName}
                  </td>

                  <td>
                    {activity.activity}
                  </td>

                  <td>

                    <span
                      className={
                        activity.status === "Completed"
                          ? "text-green-600"
                          : activity.status === "Running"
                            ? "text-amber-600"
                            : "text-blue-600"
                      }
                    >
                      {activity.status}
                    </span>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="3"
                  className="py-6 text-center text-slate-500"
                >
                  No recent activity found.
                </td>

              </tr>

            )}

          </tbody>
        </table>

      </div>

    </div>
  );
};

export default InstitutionAdminDashboard;