import React, { useState } from "react";
import { useEquipment } from "../../hooks/useEquipment";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatusBadge from "../../components/common/StatusBadge";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import { useRole } from "../../hooks/useRole";
import { useAuth } from "../../context/AuthContext";
import { useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";

const EquipmentPage = () => {
  const { user } = useAuth();
  const { isManager } = useRole();


  const navigate = useNavigate();
  const handleAddEquipment = () => {
    navigate("/equipment/create");
  };

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  console.log(user);

  const { labCode } = useParams();

  const {
    data: equipment = [],
    isLoading,
    error,
  } = useEquipment(
    user?.institutionCode,
    labCode
  );

  const categories = [
    "ALL",
    "AVAILABLE",
    "IN_USE",
    "UNDER_MAINTENANCE",
    "OUT_OF_SERVICE",
  ];

  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch =
      item.equipmentName
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      item.description
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      filter === "ALL" || item.status === filter;

    return matchesSearch && matchesStatus;
  });

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-red-500">
          Failed to load equipment.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Equipment
          </h1>
          <p className="text-slate-600">
            Browse and manage laboratory equipment
          </p>
        </div>

        {isManager && (
          <button
            onClick={handleAddEquipment}
            className="btn-primary flex items-center gap-2">
            <span>+</span>
            Add Equipment
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search equipment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />

          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            🔍
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${filter === cat
                ? "bg-green-500 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:border-green-300"
                }`}
            >
              {
                cat === "ALL"
                  ? "All"
                  : cat === "IN_USE"
                    ? "In Use"
                    : cat.replaceAll("_", " ")
              }
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner className="py-16" />
      ) : filteredEquipment.length === 0 ? (
        <EmptyState
          icon="🔬"
          title="No equipment found"
          description="Try adjusting your search or filters."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEquipment.map((item) => (
            <div
              key={item.equipmentCode}
              className="card p-6 hover:border-green-200 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl group-hover:bg-green-50 transition-colors">
                  {"🧪"}
                </div>

                <StatusBadge status={item.status} />
              </div>

              <h3 className="font-bold text-slate-900 mb-1">
                {item.equipmentName}
              </h3>

              <p className="text-sm text-slate-500 mb-3">
                {item.description || "No description available"}
              </p>

              <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                <span>📍 {item.lab}</span>
                <span>🏛️ {item.department}</span>
              </div>

              <div className="flex items-center gap-2">
                {item.status === "AVAILABLE" && (
                  <Link
                    to={`/bookings/new?equipment=${item.equipmentCode}&lab=${item.labCode}`}
                    className="flex-1 text-center py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600"
                  >
                    Book Now
                  </Link>
                )}

                <Link
                  to={`/equipment/details/${item.equipmentCode}?lab=${item.labCode}`}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:border-green-300 hover:text-green-600"
                >
                  Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default EquipmentPage;