import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import StatusBadge from "../../components/common/StatusBadge";
import toast from "react-hot-toast";
import { useMyMaintenance, useStartMaintenance, useCompleteMaintenance } from "../../hooks/useMaintenance";

// Same token palette as the rest of the app:
// ink #14181C · paper #F6F5F1 · steel #5B6770 · amber #E8A33D · teal #1F7A6C · line #D8D3C7

const MyMaintenancePage = () => {
  const { data: maintenance = [], isLoading } = useMyMaintenance();
  const startMutation = useStartMaintenance();
  const completeMutation = useCompleteMaintenance();

  // Shared across every card — track which task is actually in flight
  // rather than trusting .isLoading alone (that would disable/relabel
  // every card's button at once).
  const isStarting = (id) => startMutation.isLoading && startMutation.variables === id;
  const isCompleting = (id) => completeMutation.isLoading && completeMutation.variables === id;

  const handleStart = (id) => {
    startMutation.mutate(id, {
      onError: (err) => toast.error(err.response?.data?.message || "Failed to start maintenance"),
    });
  };

  const handleComplete = (id) => {
    completeMutation.mutate(id, {
      onSuccess: () => toast.success("Maintenance marked complete"),
      onError: (err) => toast.error(err.response?.data?.message || "Failed to complete maintenance"),
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingSpinner fullScreen text="Loading your maintenance tasks..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black text-[#14181C] tracking-tight mb-8">My Maintenance</h1>

        {maintenance.length === 0 ? (
          <div className="bg-white rounded-sm border border-[#D8D3C7] p-8 text-center">
            <h2 className="text-xl font-bold text-[#14181C]">No Maintenance Assigned</h2>
            <p className="text-[#5B6770] mt-2">You don't have any maintenance tasks.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {maintenance.map((item) => {
              const starting = isStarting(item.id);
              const completing = isCompleting(item.id);

              return (
                <div key={item.id} className="bg-white rounded-sm border border-[#D8D3C7] p-6">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-[#14181C]">{item.equipmentName}</h2>

                      <dl className="text-sm text-[#5B6770] mt-2 space-y-0.5 font-mono">
                        <p>Equipment Code: {item.equipmentCode}</p>
                        <p>Type: {item.maintenanceType}</p>
                        <p>Scheduled: {new Date(item.scheduledDate).toLocaleDateString("en-IN")}</p>
                      </dl>

                      {item.description && <p className="text-[#5B6770] mt-3 text-sm">{item.description}</p>}
                    </div>

                    <StatusBadge status={item.status} />
                  </div>

                  <div className="mt-5 flex gap-3">
                    {item.status === "SCHEDULED" && (
                      <button
                        onClick={() => handleStart(item.id)}
                        disabled={starting}
                        className="bg-[#E8A33D] hover:bg-[#d4922f] text-white px-5 py-2 rounded-sm font-mono text-sm uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {starting ? "Starting..." : "Start Maintenance"}
                      </button>
                    )}

                    {item.status === "IN_PROGRESS" && (
                      <button
                        onClick={() => handleComplete(item.id)}
                        disabled={completing}
                        className="bg-[#1F7A6C] hover:bg-[#175f54] text-white px-5 py-2 rounded-sm font-mono text-sm uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {completing ? "Completing..." : "Complete Maintenance"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyMaintenancePage;