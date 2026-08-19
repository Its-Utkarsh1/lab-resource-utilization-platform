import React, { useState } from "react";
import { useEquipment } from "../../hooks/useEquipment";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatusBadge from "../../components/common/StatusBadge";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import { useRole } from "../../hooks/useRole";
import { useAuth } from "../../context/AuthContext";
import { useParams, Link, useNavigate } from "react-router-dom";

// Same token palette as the rest of the app:
// ink #14181C · paper #F6F5F1 · steel #5B6770 · amber #E8A33D · teal #1F7A6C · line #D8D3C7

// NOTE: was hardcoded to `http://localhost:8080` — set VITE_API_BASE_URL
// in your .env (adjust if not on Vite).
const API_BASE_URL =
  import.meta.env?.VITE_API_BASE_URL ||
  "https://lab-resource-utilization-platform-1.onrender.com";
  
const CATEGORIES = ["ALL", "AVAILABLE", "IN_USE", "UNDER_MAINTENANCE", "OUT_OF_SERVICE"];

const categoryLabel = (cat) => (cat === "ALL" ? "All" : cat === "IN_USE" ? "In Use" : cat.replaceAll("_", " "));

const EquipmentImage = ({ item }) => {
  const [failed, setFailed] = useState(false);
  const src = item.imageUrl ? `${API_BASE_URL}${item.imageUrl}` : null;

  if (!src || failed) {
    return (
      <div className="w-full h-64 bg-[#F6F5F1] rounded-sm flex flex-col items-center justify-center text-center">
        <div className="text-5xl mb-2">🔬</div>
        <p className="text-xs text-[#5B6770] font-mono">No image available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-64 bg-[#F6F5F1] rounded-sm overflow-hidden flex items-center justify-center">
      <img
        src={src}
        alt={item.equipmentName || "Equipment"}
        className="max-w-full max-h-full object-contain p-3"
        onError={() => setFailed(true)}
      />
    </div>
  );
};

const EquipmentPage = () => {
  const { user } = useAuth();
  const { isManager } = useRole();
  const navigate = useNavigate();
  const { labCode } = useParams();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const { data: equipment = [], isLoading, error } = useEquipment(user?.institutionCode, labCode);

  const filteredEquipment = equipment.filter((item) => {
    const q = search.toLowerCase();
    const matchesSearch = item.equipmentName?.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q);
    const matchesStatus = filter === "ALL" || item.status === filter;
    return matchesSearch && matchesStatus;
  });

  if (error) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-sm p-4">
          Failed to load equipment.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#14181C] tracking-tight">Equipment</h1>
          <p className="text-[#5B6770] mt-1">Browse and manage laboratory equipment</p>
        </div>

        {isManager && (
          <button
            onClick={() => navigate("/equipment/create")}
            className="flex items-center gap-2 bg-[#14181C] hover:bg-[#2a2f35] text-white px-5 py-2.5 rounded-sm font-mono text-sm uppercase tracking-wide transition-colors shrink-0"
          >
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
            className="w-full rounded-sm border border-[#D8D3C7] pl-10 pr-4 py-2.5 text-[#14181C] placeholder-[#5B6770]/60 focus:outline-none focus:border-[#1F7A6C] focus:ring-1 focus:ring-[#1F7A6C] transition-colors"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5B6770]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
          </svg>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-sm text-sm font-medium whitespace-nowrap transition-colors ${
                filter === cat
                  ? "bg-[#14181C] text-white"
                  : "bg-white border border-[#D8D3C7] text-[#5B6770] hover:border-[#1F7A6C]/40"
              }`}
            >
              {categoryLabel(cat)}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : filteredEquipment.length === 0 ? (
        <EmptyState icon="🔬" title="No equipment found" description="Try adjusting your search or filters." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEquipment.map((item) => (
            <div
              key={item.equipmentCode}
              className="bg-white rounded-sm border border-[#D8D3C7] p-6 hover:border-[#1F7A6C]/40 transition-colors"
            >
              <div className="flex justify-end mb-3">
                <StatusBadge status={item.status} />
              </div>

              <div className="mb-5">
                <EquipmentImage item={item} />
              </div>

              <h3 className="font-bold text-[#14181C] mb-1">{item.equipmentName}</h3>
              <p className="text-sm text-[#5B6770] mb-3">{item.description || "No description available"}</p>

              <div className="flex items-center gap-4 text-xs text-[#5B6770] mb-4 font-mono">
                <span>{item.lab}</span>
                <span>{item.department}</span>
              </div>

              <div className="flex items-center gap-2">
                {item.status === "AVAILABLE" && (
                  <Link
                    to={`/bookings/new?equipment=${item.equipmentCode}&lab=${item.labCode}`}
                    className="flex-1 text-center py-2 bg-[#1F7A6C] text-white rounded-sm text-sm font-mono uppercase tracking-wide hover:bg-[#175f54] transition-colors"
                  >
                    Book Now
                  </Link>
                )}

                <Link
                  to={`/equipment/details/${item.equipmentCode}?lab=${item.labCode}`}
                  className="px-4 py-2 border border-[#D8D3C7] rounded-sm text-sm text-[#5B6770] hover:border-[#1F7A6C]/40 hover:text-[#1F7A6C] transition-colors"
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