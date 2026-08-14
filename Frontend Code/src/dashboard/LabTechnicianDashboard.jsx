import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import dashboardService from "../services/dashboardService";
import StatCard from "../components/common/StatCard";
import LoadingSpinner from "../components/common/LoadingSpinner";

// NOTE: import paths for StatCard/LoadingSpinner assume they live in
// src/components/common/ — adjust if your project places shared
// components elsewhere.

const quickActions = [
  { to: "/labs", label: "Equipment", tag: "EQ", accent: "teal" },
  { to: "/maintenance", label: "Maintenance", tag: "MNT", accent: "amber" },
];

const LabTechnicianDashboard = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    availableEquipment: 0,
    inUseEquipment: 0,
    underMaintenance: 0,
    outOfService: 0,
  });

  useEffect(() => {
    let ignore = false;

    const loadDashboardStats = async () => {
      try {
        const response = await dashboardService.getTechnicianDashboard();
        if (!ignore) {
          setStats(response);
          setError(null);
        }
      } catch (err) {
        console.error(err);
        if (!ignore) setError("Couldn't load dashboard stats. Try refreshing the page.");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadDashboardStats();
    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
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
          Lab Technician Dashboard
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-sm p-4">
          {error}
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Available Equipment" value={stats.availableEquipment} color="teal" />
        <StatCard title="Equipment In Use" value={stats.inUseEquipment} color="steel" />
        <StatCard title="Under Maintenance" value={stats.underMaintenance} color="amber" />
        <StatCard title="Out of Service" value={stats.outOfService} color="red" />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-sm border border-[#D8D3C7] p-6">
        <h2 className="text-xl font-bold text-[#14181C] mb-5">Quick Actions</h2>

        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="border border-[#D8D3C7] rounded-sm p-5 flex items-center justify-center gap-3 hover:border-[#1F7A6C] transition-colors"
            >
              <span
                className={`w-8 h-8 rounded-sm flex items-center justify-center font-mono text-[10px] font-bold ${
                  action.accent === "amber" ? "bg-[#E8A33D]/10 text-[#E8A33D]" : "bg-[#1F7A6C]/10 text-[#1F7A6C]"
                }`}
              >
                {action.tag}
              </span>
              <span className="font-medium text-[#14181C]">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LabTechnicianDashboard;