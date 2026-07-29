import React, { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatusBadge from "../../components/common/StatusBadge";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import { useAuth } from "../../context/AuthContext";
import {
  useMaintenance,
  useStartMaintenance,
  useCompleteMaintenance,
} from "../../hooks/useMaintenance";

const MaintenancePage = () => {
  const [activeTab, setActiveTab] = useState("ALL");

  const { user } = useAuth();

  const isLabTechnician = user?.role === "LAB_TECHNICIAN";

  const {
    data: maintenanceTasks = [],
    isLoading,
  } = useMaintenance();

  const startMutation = useStartMaintenance();
  const completeMutation = useCompleteMaintenance();

  const filteredTasks =
    activeTab === "ALL"
      ? maintenanceTasks
      : activeTab === "UPCOMING"
      ? maintenanceTasks.filter((t) => t.status === "SCHEDULED")
      : activeTab === "IN_PROGRESS"
      ? maintenanceTasks.filter((t) => t.status === "IN_PROGRESS")
      : activeTab === "COMPLETED"
      ? maintenanceTasks.filter((t) => t.status === "COMPLETED")
      : maintenanceTasks;

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  if (maintenanceTasks.length === 0) {
    return (
      <DashboardLayout>
        <EmptyState
          title="No Maintenance Found"
          description="No maintenance tasks have been scheduled yet."
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Maintenance
          </h1>
          <p className="text-slate-600">
            Track and manage equipment maintenance workflows
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6 border-b border-slate-200">
        {["ALL", "UPCOMING", "IN_PROGRESS", "COMPLETED"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? "border-green-500 text-green-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-6 py-4">Equipment</th>
                <th className="text-left px-6 py-4">Type</th>
                <th className="text-left px-6 py-4">Scheduled</th>
                <th className="text-left px-6 py-4">Technician</th>
                <th className="text-left px-6 py-4">Status</th>

                {isLabTechnician && (
                  <th className="text-left px-6 py-4">
                    Action
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredTasks.map((task) => (
                <tr
                  key={task.id}
                  className="hover:bg-slate-50"
                >
                  <td className="px-6 py-4 font-medium">
                    {task.equipmentName}
                  </td>

                  <td className="px-6 py-4">
                    {task.maintenanceType}
                  </td>

                  <td className="px-6 py-4">
                    {task.scheduledDate}
                  </td>

                  <td className="px-6 py-4">
                    {task.technicianName}
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge status={task.status} />
                  </td>

                  {isLabTechnician && (
                    <td className="px-6 py-4">

                      {task.status === "SCHEDULED" && (
                        <button
                          onClick={() => startMutation.mutate(task.id)}
                          disabled={startMutation.isLoading}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                        >
                          Start
                        </button>
                      )}

                      {task.status === "IN_PROGRESS" && (
                        <button
                          onClick={() => completeMutation.mutate(task.id)}
                          disabled={completeMutation.isLoading}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                        >
                          Complete
                        </button>
                      )}

                      {task.status === "COMPLETED" && (
                        <span className="text-green-600 font-semibold">
                          Completed
                        </span>
                      )}

                    </td>
                  )}
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MaintenancePage;