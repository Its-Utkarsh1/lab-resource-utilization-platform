import { useAuth } from "../../context/AuthContext";
import {
  useEquipmentByCode,
  useUpdateEquipmentStatus,
} from "../../hooks/useEquipment";

import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import { Link, useParams, useSearchParams } from "react-router-dom";

const EquipmentDetailPage = () => {
  const { user } = useAuth();

  const { equipmentCode } = useParams();
  const [searchParams] = useSearchParams();

  const labCode = searchParams.get("lab");
  const updateStatusMutation = useUpdateEquipmentStatus();

  const {
    data: equipment,
    isLoading,
    error,
    refetch,
  } = useEquipmentByCode(
    user?.institutionCode,
    labCode,
    equipmentCode
  );

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  if (error || !equipment) {
    return (
      <DashboardLayout>
        <EmptyState
          icon="🔬"
          title="Equipment not found"
          description="Unable to load equipment details."
        />
      </DashboardLayout>
    );
  }

  const isLabManager =
    user?.role === "LAB_MANAGER" ||
    user?.roleName === "LAB_MANAGER" ||
    user?.role?.roleName === "LAB_MANAGER";

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow border p-8">

        <h1 className="text-3xl font-bold mb-8">
          {equipment.equipmentName}
        </h1>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* Image */}
          <div>

            {equipment.imageUrl ? (
              <img
                src={`http://localhost:8080${equipment.imageUrl}`}
                alt={equipment.equipmentName}
                className="w-full h-96 object-cover rounded-xl border"
              />
            ) : (
              <div className="w-full h-96 rounded-xl border flex items-center justify-center bg-slate-100 text-7xl">
                🧪
              </div>
            )}

          </div>

          {/* Details */}
          <div className="space-y-4">

            <div className="border rounded-lg p-4">
              <strong>Equipment Code:</strong> {equipment.equipmentCode}
            </div>

            <div className="border rounded-lg p-4">
              <strong>Model:</strong> {equipment.model}
            </div>

            <div className="border rounded-lg p-4">
              <strong>Status:</strong> {equipment.status}
            </div>

            <div className="border rounded-lg p-4">
              <strong>Price / Hour:</strong>{" "}
              <span className="text-2xl font-bold text-green-600">
                ₹ {equipment.hourlyRate}
              </span>
            </div>

            <div className="border rounded-lg p-4">
              <strong>Available Quantity:</strong>{" "}
              {equipment.availableQuantity}
            </div>

            <div className="border rounded-lg p-4">
              <strong>Lab:</strong> {equipment.lab}
            </div>

            <div className="border rounded-lg p-4">
              <strong>Department:</strong> {equipment.department}
            </div>

            <div className="border rounded-lg p-4">
              <strong>Institution:</strong> {equipment.institution}
            </div>

          </div>

        </div>

        <div className="mt-10">

          <h2 className="text-xl font-semibold mb-3">
            Description
          </h2>

          <p className="text-slate-600">
            {equipment.description || "No description available."}
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-3">
            Specifications
          </h2>

          <p className="text-slate-600">
            {equipment.specifications || "No specifications available."}
          </p>

        </div>

        <div className="mt-10 flex gap-4 flex-wrap">

          <Link
            to={`/equipment/${labCode}`}
            className="px-6 py-3 border rounded-lg hover:bg-gray-100"
          >
            Back
          </Link>

          {equipment.status === "AVAILABLE" && (
            <Link
              to={`/bookings/new?equipment=${equipment.equipmentCode}&lab=${labCode}`}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
            >
              Book Equipment
            </Link>
          )}

          {isLabManager &&
            equipment.status !== "UNDER_MAINTENANCE" && (
              <Link
                to={`/maintenance/new?equipment=${equipment.equipmentCode}&lab=${labCode}`}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg"
              >
                Schedule Maintenance
              </Link>
            )}

          {isLabManager &&
            equipment.status !== "AVAILABLE" &&
            equipment.status !== "IN_USE" && (
              <button
                onClick={() =>
                  updateStatusMutation.mutate(
                    {
                      equipmentCode: equipment.equipmentCode,
                      status: "AVAILABLE",
                    },
                    {
                      onSuccess: () => {
                        refetch();
                      },
                    }
                  )
                }
                disabled={updateStatusMutation.isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg"
              >
                {updateStatusMutation.isLoading
                  ? "Updating..."
                  : "Mark Available"}
              </button>
            )}

        </div>

      </div>
    </DashboardLayout>
  );
};

export default EquipmentDetailPage;