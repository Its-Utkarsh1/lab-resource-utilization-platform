import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import {
  useLabManagerDashboard,
  useWeeklyUtilization,
} from "../hooks/useDashboard";

const LabManagerDashboard = () => {
  const { user } = useAuth();
  const {
    data: dashboard,
    isLoading: dashboardLoading,
  } = useLabManagerDashboard();

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
          Lab Manager Dashboard
        </p>
      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <div className="bg-white rounded-xl shadow border p-6">
          <p className="text-sm text-slate-500">Total Equipment</p>
          <h2 className="text-4xl font-bold text-green-600 mt-3">{dashboard?.totalEquipment}</h2>
        </div>

        <div className="bg-white rounded-xl shadow border p-6">
          <p className="text-sm text-slate-500">Equipment In Use</p>
          <h2 className="text-4xl font-bold text-blue-600 mt-3">{dashboard?.equipmentInUse}</h2>
        </div>

        <div className="bg-white rounded-xl shadow border p-6">
          <p className="text-sm text-slate-500">Maintenance Due</p>
          <h2 className="text-4xl font-bold text-red-600 mt-3">{dashboard?.maintenanceDue}</h2>
        </div>

        <div className="bg-white rounded-xl shadow border p-6">
          <p className="text-sm text-slate-500">Utilization Rate</p>
          <h2 className="text-4xl font-bold text-purple-600 mt-3">
            {dashboard?.utilizationRate != null
              ? `${dashboard.utilizationRate.toFixed(2)}%`
              : "0.00%"}
          </h2>
        </div>

      </div>


      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow border p-6">

        <h2 className="text-xl font-semibold mb-5">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">

          <Link
            to="/equipment/create"
            className="bg-green-600 hover:bg-green-700 text-white rounded-lg p-4 text-center font-medium transition"
          >
            Add Equipment
          </Link>

          <Link
            to="/labs"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-4 text-center font-medium transition"
          >
            Manage Equipment
          </Link>

          <Link
            to="/bookings/manage"
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg p-4 text-center font-medium transition"
          >
            Manage Bookings
          </Link>

          <Link
            to="/maintenance"
            className="bg-orange-600 hover:bg-orange-700 text-white rounded-lg p-4 text-center font-medium transition"
          >
            Schedule Maintenance
          </Link>

          <Link
            to="/analytics"
            className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg p-4 text-center font-medium transition"
          >
            View Analytics
          </Link>

        </div>

      </div>

      {/* Equipment Status */}

      <div className="grid lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-xl shadow border p-6">

          <h2 className="text-xl font-semibold mb-4">
            Equipment Status
          </h2>

          <ul className="space-y-3">

            <li className="flex justify-between">
              <span>Available</span>
              <span className="text-green-600 font-semibold">{dashboard?.availableEquipment}</span>
            </li>

            <li className="flex justify-between">
              <span>In Use</span>
              <span className="text-blue-600 font-semibold">
                {dashboard?.equipmentInUse}
              </span>
            </li>

            <li className="flex justify-between">
              <span>Maintenance</span>
              <span className="text-red-600 font-semibold">{dashboard?.maintenanceEquipment}</span>
            </li>

            <li className="flex justify-between">
              <span>Out of Service</span>
              <span className="text-slate-600 font-semibold">{dashboard?.outOfServiceEquipment}</span>
            </li>

          </ul>

        </div>

        <div className="bg-white rounded-xl shadow border p-6">

          <h2 className="text-xl font-semibold mb-4">
            Booking Requests
          </h2>

          <ul className="space-y-3">

            <li className="flex justify-between">
              <span>Pending Approval</span>
              <span className="font-semibold text-amber-600">{dashboard?.pendingBookings}</span>
            </li>

            <li className="flex justify-between">
              <span>Approved Today</span>
              <span className="font-semibold text-green-600">{dashboard?.approvedToday}</span>
            </li>

            <li className="flex justify-between">
              <span>Rejected</span>
              <span className="font-semibold text-red-600">{dashboard?.rejectedBookings}</span>
            </li>

          </ul>

        </div>

      </div>

      {/* Maintenance Schedule */}

      <div className="bg-white rounded-xl shadow border p-6">

        <h2 className="text-xl font-semibold mb-5">
          Today's Maintenance
        </h2>

        <table className="w-full">

          <thead>

            <tr className="border-b">
              <th className="text-left py-3">Equipment</th>
              <th className="text-left py-3">Technician</th>
              <th className="text-left py-3">Status</th>
            </tr>

          </thead>

          <tbody>

            {dashboard?.todayMaintenance?.length > 0 ? (

              dashboard.todayMaintenance.map((item, index) => (

                <tr
                  key={index}
                  className="border-b"
                >

                  <td className="py-3">
                    {item.equipmentName}
                  </td>

                  <td>
                    {item.technicianName}
                  </td>

                  <td>{item.status}</td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="3"
                  className="py-6 text-center text-slate-500"
                >
                  No maintenance scheduled.
                </td>

              </tr>

            )}

          </tbody>
        </table>

      </div>

    </div>
  );
};

export default LabManagerDashboard;