import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import dashboardService from "../services/dashboardService";


const LabTechnicianDashboard = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    availableEquipment: 0,
    inUseEquipment: 0,
    underMaintenance: 0,
    outOfService: 0,
  });

  useEffect(() => {
    const loadDashboardStats = async () => {
      try {
        const response = await dashboardService.getTechnicianDashboard();
        setStats(response);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
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
          Lab Technician Dashboard
        </p>
      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <div className="bg-white rounded-xl shadow border p-6">
          <p className="text-sm text-slate-500">
            Available Equipment
          </p>

          <h2 className="text-4xl font-bold text-green-600 mt-3">
            {stats.availableEquipment}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow border p-6">
          <p className="text-sm text-slate-500">
            Equipment In Use
          </p>

          <h2 className="text-4xl font-bold text-blue-600 mt-3">
            {stats.inUseEquipment}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow border p-6">
          <p className="text-sm text-slate-500">
            Under Maintenance
          </p>

          <h2 className="text-4xl font-bold text-orange-600 mt-3">
            {stats.underMaintenance}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow border p-6">
          <p className="text-sm text-slate-500">
            Out of Service
          </p>

          <h2 className="text-4xl font-bold text-red-600 mt-3">
            {stats.outOfService}
          </h2>
        </div>

      </div>

      {/* Quick Actions */}

      <div className="bg-white rounded-xl shadow border p-6">

        <h2 className="text-xl font-semibold mb-5">
          Quick Actions
        </h2>

        <div className="grid grid-cols-2 gap-4">

          <Link
            to="/labs"
            className="bg-green-600 text-white rounded-xl p-5 text-center hover:bg-green-700"
          >
            Equipment
          </Link>

          <Link
            to="/maintenance"
            className="bg-orange-600 text-white rounded-xl p-5 text-center hover:bg-orange-700"
          >
            Maintenance
          </Link>

        </div>
      </div>


      <div className="grid lg:grid-cols-2 gap-6">

        {/* Equipment Status */}

        <div className="bg-white rounded-xl shadow border p-6">

          <h2 className="text-xl font-semibold mb-5">
            Equipment Status
          </h2>

          <div className="space-y-4">

            <div className="flex justify-between border-b pb-3">
              <span>Available</span>
              <span className="font-bold text-green-600">
                {stats.availableEquipment}
              </span>
            </div>

            <div className="flex justify-between border-b pb-3">
              <span>In Use</span>
              <span className="font-bold text-blue-600">
                {stats.inUseEquipment}
              </span>
            </div>

            <div className="flex justify-between border-b pb-3">
              <span>Under Maintenance</span>
              <span className="font-bold text-orange-600">
                {stats.underMaintenance}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Out of Service</span>
              <span className="font-bold text-red-600">
                {stats.outOfService}
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default LabTechnicianDashboard;