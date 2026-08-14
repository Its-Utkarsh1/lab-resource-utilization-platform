import React, { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatusBadge from "../../components/common/StatusBadge";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useMaintenance, useStartMaintenance, useCompleteMaintenance } from "../../hooks/useMaintenance";

// Same token palette as the rest of the app:
// ink #14181C · paper #F6F5F1 · steel #5B6770 · amber #E8A33D · teal #1F7A6C · line #D8D3C7

const TABS = ["ALL", "UPCOMING", "IN_PROGRESS", "COMPLETED"];
const TAB_STATUS = { UPCOMING: "SCHEDULED", IN_PROGRESS: "IN_PROGRESS", COMPLETED: "COMPLETED" };

const MaintenancePage = () => {
  const [activeTab, setActiveTab] = useState("ALL");
  const { user } = useAuth();
  const isLabTechnician = user?.role === "LAB_TECHNICIAN";

  const { data: maintenanceTasks = [], isLoading } = useMaintenance();
  const startMutation = useStartMaintenance();
  const completeMutation = useCompleteMaintenance();

  const isStarting = (id) => startMutation.isLoading && startMutation.variables === id;
  const isCompleting = (id) => completeMutation.isLoading && completeMutation.variables === id;

  const filteredTasks =
    activeTab === "ALL" ? maintenanceTasks : maintenanceTasks.filter((t) => t.status === TAB_STATUS[activeTab]);

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
        <LoadingSpinner fullScreen text="Loading maintenance tasks..." />
      </DashboardLayout>
    );
  }

  if (maintenanceTasks.length === 0) {
    return (
      <DashboardLayout>
        <EmptyState icon="🔧" title="No Maintenance Found" description="No maintenance tasks have been scheduled yet." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#14181C] tracking-tight">Maintenance</h1>
        <p className="text-[#5B6770] mt-1">Track and manage equipment maintenance workflows</p>
      </div>

      <div className="flex items-center gap-2 mb-6 border-b border-[#D8D3C7]">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-mono uppercase tracking-wide border-b-2 transition-colors ${
              activeTab === tab
                ? "border-[#1F7A6C] text-[#1F7A6C]"
                : "border-transparent text-[#5B6770] hover:text-[#14181C]"
            }`}
          >
            {tab.replaceAll("_", " ")}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-sm border border-[#D8D3C7] overflow-hidden">
        {filteredTasks.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-bold text-[#14181C] mb-1">No tasks in this view</p>
            <p className="text-sm text-[#5B6770]">Try a different tab, or check back later.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F6F5F1] border-b border-[#D8D3C7]">
                <tr>
                  <th className="text-left px-6 py-4 font-mono text-xs tracking-widest text-[#5B6770] uppercase">Equipment</th>
                  <th className="text-left px-6 py-4 font-mono text-xs tracking-widest text-[#5B6770] uppercase">Type</th>
                  <th className="text-left px-6 py-4 font-mono text-xs tracking-widest text-[#5B6770] uppercase">Scheduled</th>
                  <th className="text-left px-6 py-4 font-mono text-xs tracking-widest text-[#5B6770] uppercase">Technician</th>
                  <th className="text-left px-6 py-4 font-mono text-xs tracking-widest text-[#5B6770] uppercase">Status</th>
                  {isLabTechnician && (
                    <th className="text-left px-6 py-4 font-mono text-xs tracking-widest text-[#5B6770] uppercase">Action</th>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-[#D8D3C7]">
                {filteredTasks.map((task) => {
                  const starting = isStarting(task.id);
                  const completing = isCompleting(task.id);

                  return (
                    <tr key={task.id} className="hover:bg-[#F6F5F1]">
                      <td className="px-6 py-4 font-medium text-[#14181C]">{task.equipmentName}</td>
                      <td className="px-6 py-4 text-[#5B6770]">{task.maintenanceType}</td>
                      <td className="px-6 py-4 font-mono text-xs text-[#5B6770]">{task.scheduledDate}</td>
                      <td className="px-6 py-4 text-[#5B6770]">{task.technicianName}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={task.status} />
                      </td>

                      {isLabTechnician && (
                        <td className="px-6 py-4">
                          {task.status === "SCHEDULED" && (
                            <button
                              onClick={() => handleStart(task.id)}
                              disabled={starting}
                              className="bg-[#E8A33D] hover:bg-[#d4922f] text-white px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              {starting ? "Starting..." : "Start"}
                            </button>
                          )}

                          {task.status === "IN_PROGRESS" && (
                            <button
                              onClick={() => handleComplete(task.id)}
                              disabled={completing}
                              className="bg-[#1F7A6C] hover:bg-[#175f54] text-white px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              {completing ? "Completing..." : "Complete"}
                            </button>
                          )}

                          {task.status === "COMPLETED" && (
                            <span className="text-[#1F7A6C] font-mono text-xs uppercase tracking-wide">Completed</span>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MaintenancePage;