import React from "react";
import { useAuth } from "../../context/AuthContext";
import {
  useEquipmentDetail,
  useUpdateEquipmentStatus,
  useDeleteEquipment,
} from "../../hooks/useEquipment";
import toast from "react-hot-toast";

import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import StatusBadge from "../../components/common/StatusBadge";
import { Link, useParams, useSearchParams, useNavigate } from "react-router-dom";

// Same token palette as the rest of the app:
// ink #14181C · paper #F6F5F1 · steel #5B6770 · amber #E8A33D · teal #1F7A6C · line #D8D3C7

// NOTE: was hardcoded to `http://localhost:8080` — set VITE_API_BASE_URL
// in your .env (adjust if not on Vite).
const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || "";

const EquipmentDetailImage = ({ equipment }) => {
  const [failed, setFailed] = React.useState(false);
  const src = equipment.imageUrl ? `${API_BASE_URL}${equipment.imageUrl}` : null;

  if (!src || failed) {
    return (
      <div className="w-full h-96 rounded-sm border border-[#D8D3C7] flex flex-col items-center justify-center bg-[#F6F5F1] text-center">
        <div className="text-7xl mb-2">🧪</div>
        <p className="text-xs text-[#5B6770] font-mono">No image available</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={equipment.equipmentName}
      className="w-full h-96 object-cover rounded-sm border border-[#D8D3C7]"
      onError={() => setFailed(true)}
    />
  );
};

const DetailField = ({ label, value, accent }) => (
  <div className="border border-[#D8D3C7] rounded-sm p-4">
    <p className="text-xs font-mono tracking-widest text-[#5B6770] uppercase mb-1">{label}</p>
    <p className={`font-medium ${accent || "text-[#14181C]"}`}>{value}</p>
  </div>
);

const EquipmentDetailPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const deleteMutation = useDeleteEquipment();

  const { equipmentCode } = useParams();
  const [searchParams] = useSearchParams();

  const labCode = searchParams.get("lab");
  const updateStatusMutation = useUpdateEquipmentStatus();

  const { data: equipment, isLoading, error, refetch } = useEquipmentDetail(
    user?.institutionCode,
    labCode,
    equipmentCode
  );

  const isUpdatingStatus = updateStatusMutation.isPending ?? updateStatusMutation.isLoading ?? false;
  const isDeleting = deleteMutation.isPending ?? deleteMutation.isLoading ?? false;

  const handleDelete = () => {
    if (!window.confirm("Deactivate this equipment? It will no longer appear in the inventory or be available for booking.")) {
      return;
    }

    deleteMutation.mutate(
      { institutionCode: user.institutionCode, labCode, equipmentCode },
      {
        onSuccess: () => navigate(`/equipment/${labCode}`),
        onError: (err) => toast.error(err.response?.data?.message || "Failed to deactivate equipment"),
      }
    );
  };

  const handleMarkAvailable = () => {
    updateStatusMutation.mutate(
      { equipmentCode: equipment.equipmentCode, status: "AVAILABLE" },
      {
        onSuccess: () => {
          toast.success("Equipment marked available");
          refetch();
        },
        onError: (err) => toast.error(err.response?.data?.message || "Failed to update status"),
      }
    );
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingSpinner fullScreen text="Loading equipment..." />
      </DashboardLayout>
    );
  }

  if (error || !equipment) {
    return (
      <DashboardLayout>
        <EmptyState icon="🔬" title="Equipment not found" description="Unable to load equipment details." />
      </DashboardLayout>
    );
  }

  // NOTE: simplified from a three-way check (`user?.role`,
  // `user?.roleName`, `user?.role?.roleName`) to match the flat string
  // role shape used everywhere else in the app. If some code path
  // actually returns a nested role object, this could hide the
  // Maintenance/Deactivate/Mark Available actions from a real lab
  // manager — worth confirming before relying on this.
  const isLabManager = user?.role === "LAB_MANAGER";

  const dueInAccent =
    equipment.serviceDueInDays < 0
      ? "text-red-600"
      : equipment.serviceDueInDays <= 7
        ? "text-[#E8A33D]"
        : "text-[#1F7A6C]";

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto bg-white rounded-sm border border-[#D8D3C7] p-8">
        <div className="flex items-start justify-between gap-4 mb-8">
          <h1 className="text-3xl font-black text-[#14181C] tracking-tight">{equipment.equipmentName}</h1>
          <StatusBadge status={equipment.status} />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image */}
          <div>
            <EquipmentDetailImage equipment={equipment} />
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <DetailField label="Equipment Code" value={equipment.equipmentCode} />
            <DetailField label="Model" value={equipment.model} />
            <DetailField label="Price / Hour" value={`₹${equipment.hourlyRate}`} accent="text-[#1F7A6C] text-lg font-mono font-bold" />
            <DetailField label="Available Quantity" value={equipment.availableQuantity} />
            <DetailField label="Lab" value={equipment.lab} />
            <DetailField label="Department" value={equipment.department} />
            <DetailField label="Institution" value={equipment.institution} />
            <DetailField label="Service Interval" value={`${equipment.serviceIntervalDays} Days`} />
            <DetailField label="Last Service Date" value={equipment.lastServiceDate || "-"} />
            <DetailField label="Next Service Date" value={equipment.nextServiceDate || "-"} />
            <DetailField
              label="Service Due In"
              value={equipment.serviceDueInDays != null ? `${equipment.serviceDueInDays} Days` : "-"}
              accent={`font-mono font-bold ${dueInAccent}`}
            />
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-bold text-[#14181C] mb-3">Description</h2>
          <p className="text-[#5B6770]">{equipment.description || "No description available."}</p>

          <h2 className="text-xl font-bold text-[#14181C] mt-8 mb-3">Specifications</h2>
          <p className="text-[#5B6770]">{equipment.specifications || "No specifications available."}</p>
        </div>

        <div className="mt-10 flex gap-3 flex-wrap">
          <Link
            to={`/equipment/${labCode}`}
            className="px-6 py-3 rounded-sm border border-[#D8D3C7] text-[#14181C] font-mono text-sm uppercase tracking-wide hover:border-[#14181C]/40 transition-colors"
          >
            Back
          </Link>

          {equipment.status === "AVAILABLE" && (
            <Link
              to={`/bookings/new?equipment=${equipment.equipmentCode}&lab=${labCode}`}
              className="bg-[#14181C] hover:bg-[#2a2f35] text-white px-6 py-3 rounded-sm font-mono text-sm uppercase tracking-wide transition-colors"
            >
              Book Equipment
            </Link>
          )}

          {isLabManager && equipment.status !== "UNDER_MAINTENANCE" && (
            <Link
              to={`/maintenance/new?equipment=${equipment.equipmentCode}&lab=${labCode}`}
              className="border border-[#E8A33D]/40 text-[#E8A33D] hover:bg-[#E8A33D]/10 px-6 py-3 rounded-sm font-mono text-sm uppercase tracking-wide transition-colors"
            >
              Schedule Maintenance
            </Link>
          )}

          {isLabManager && equipment.status !== "AVAILABLE" && equipment.status !== "IN_USE" && (
            <button
              onClick={handleMarkAvailable}
              disabled={isUpdatingStatus}
              className="bg-[#1F7A6C] hover:bg-[#175f54] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-sm font-mono text-sm uppercase tracking-wide transition-colors"
            >
              {isUpdatingStatus ? "Updating..." : "Mark Available"}
            </button>
          )}

          {isLabManager && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-sm font-mono text-sm uppercase tracking-wide transition-colors"
            >
              {isDeleting ? "Deactivating..." : "Deactivate Equipment"}
            </button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EquipmentDetailPage;