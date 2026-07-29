import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  useDepartmentHeadDashboard,
  useWeeklyUtilization,
} from "../hooks/useDashboard";

const DepartmentHeadDashboard = () => {
  const { user } = useAuth();

  const {
    data: dashboard,
    isLoading: dashboardLoading,
  } = useDepartmentHeadDashboard();

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

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold text-slate-900">
            Welcome back, {user?.fullName?.split(" ")[0]}
          </h1>

          <p className="text-slate-600 mt-1">
            Department Head Dashboard
          </p>

        </div>

      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <div className="bg-white rounded-xl shadow border p-6">

          <p className="text-sm text-slate-500">
            Total Labs
          </p>

          <h2 className="text-4xl font-bold text-green-600 mt-3">
            {dashboard?.totalLabs}
          </h2>

        </div>

        <div className="bg-white rounded-xl shadow border p-6">

          <p className="text-sm text-slate-500">
            Total Equipment
          </p>

          <h2 className="text-4xl font-bold text-blue-600 mt-3">
            {dashboard?.totalEquipment}
          </h2>

        </div>

        <div className="bg-white rounded-xl shadow border p-6">

          <p className="text-sm text-slate-500">
            Active Bookings
          </p>

          <h2 className="text-4xl font-bold text-amber-600 mt-3">
            {dashboard?.activeBookings}
          </h2>

        </div>

        <div className="bg-white rounded-xl shadow border p-6">

          <p className="text-sm text-slate-500">
            Department Users
          </p>

          <h2 className="text-4xl font-bold text-purple-600 mt-3">
            {dashboard?.departmentUsers}
          </h2>

        </div>

      </div>

      <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
        {JSON.stringify(dashboard, null, 2)}
      </pre>
      {/* Quick Actions */}

      <div className="bg-white rounded-xl shadow border p-6">

        <h2 className="text-xl font-semibold mb-5">
          Quick Actions
        </h2>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">

          <Link
            to="/equipment"
            className="bg-green-600 text-white rounded-lg p-4 text-center hover:bg-green-700 transition"
          >
            Manage Equipment
          </Link>

          <Link
            to="/bookings"
            className="bg-blue-600 text-white rounded-lg p-4 text-center hover:bg-blue-700 transition"
          >
            View Bookings
          </Link>

          <Link
            to="/analytics"
            className="bg-purple-600 text-white rounded-lg p-4 text-center hover:bg-purple-700 transition"
          >
            Analytics
          </Link>

          <Link
            to="/sharing"
            className="bg-orange-600 text-white rounded-lg p-4 text-center hover:bg-orange-700 transition"
          >
            Resource Sharing
          </Link>

        </div>

      </div>

      {/* Weekly Utilization */}

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

              <span className="text-xs text-slate-500">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
              </span>

              <span className="text-xs font-semibold">
                {value}
              </span>

            </div>

          ))}

        </div>

      </div>

      {/* Department Overview */}

      <div className="grid lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-xl shadow border p-6">

          <h2 className="text-xl font-semibold mb-4">
            Department Summary
          </h2>

          <ul className="space-y-4">

            <li className="flex justify-between">
              <span>Total Labs</span>
              <span className="font-semibold">
                {dashboard?.totalLabs}
              </span>
            </li>

            <li className="flex justify-between">
              <span>Total Equipment</span>
              <span className="font-semibold">
                {dashboard?.totalEquipment}
              </span>
            </li>

            <li className="flex justify-between">
              <span>Department Users</span>
              <span className="font-semibold">
                {dashboard?.departmentUsers}
              </span>
            </li>

            <li className="flex justify-between">
              <span>Active Bookings</span>
              <span className="font-semibold">
                {dashboard?.activeBookings}
              </span>
            </li>

          </ul>

        </div>

        <div className="bg-white rounded-xl shadow border p-6">

          <h2 className="text-xl font-semibold mb-4">
            Weekly Booking Hours
          </h2>

          <div className="flex items-end justify-between h-48">

            {weeklyUtilization.map((value, index) => (

              <div
                key={index}
                className="flex flex-col items-center"
              >

                <div
                  className="w-6 rounded bg-blue-500"
                  style={{
                    height: `${Math.max(value * 12, 8)}px`,
                  }}
                />

                <span className="text-xs mt-2">
                  {["M", "T", "W", "T", "F", "S", "S"][index]}
                </span>

              </div>

            ))}

          </div>

        </div>

      </div>
      {/* Recent Bookings */}

      <div className="bg-white rounded-xl shadow border p-6">

        <h2 className="text-xl font-semibold mb-5">
          Recent Department Bookings
        </h2>

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="text-left py-3">
                Equipment
              </th>

              <th className="text-left py-3">
                User
              </th>

              <th className="text-left py-3">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {dashboard?.recentBookings?.length > 0 ? (

              dashboard.recentBookings.map((booking, index) => (

                <tr
                  key={index}
                  className="border-b"
                >

                  <td className="py-3">
                    {booking.equipmentName}
                  </td>

                  <td>
                    {booking.bookedBy}
                  </td>

                  <td>
                    <span
                      className={
                        booking.status === "APPROVED"
                          ? "text-green-600"
                          : booking.status === "PENDING"
                            ? "text-amber-600"
                            : booking.status === "REJECTED"
                              ? "text-red-600"
                              : "text-blue-600"
                      }
                    >
                      {booking.status}
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
                  No recent bookings found.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default DepartmentHeadDashboard;