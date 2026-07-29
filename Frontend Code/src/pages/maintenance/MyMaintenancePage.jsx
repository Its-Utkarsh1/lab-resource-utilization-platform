import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  useMyMaintenance,
  useStartMaintenance,
  useCompleteMaintenance,
} from "../../hooks/useMaintenance";

const MyMaintenancePage = () => {
  const {
    data: maintenance = [],
    isLoading,
  } = useMyMaintenance();

  const startMutation = useStartMaintenance();
  const completeMutation = useCompleteMaintenance();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen">
          Loading...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mb-8">
          My Maintenance
        </h1>

        {maintenance.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <h2 className="text-xl font-semibold">
              No Maintenance Assigned
            </h2>

            <p className="text-slate-500 mt-2">
              You don't have any maintenance tasks.
            </p>
          </div>
        ) : (
          <div className="space-y-6">

            {maintenance.map((item) => (

              <div
                key={item.id}
                className="bg-white rounded-xl shadow border p-6"
              >

                <div className="flex justify-between items-start">

                  <div>

                    <h2 className="text-2xl font-bold">
                      {item.equipmentName}
                    </h2>

                    <p className="text-slate-500 mt-2">
                      Equipment Code: {item.equipmentCode}
                    </p>

                    <p className="text-slate-500">
                      Type: {item.maintenanceType}
                    </p>

                    <p className="text-slate-500">
                      Scheduled:
                      {" "}
                      {new Date(item.scheduledDate).toLocaleDateString("en-IN")}
                    </p>

                    <p className="text-slate-500 mt-2">
                      {item.description}
                    </p>

                  </div>

                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold
                      ${
                        item.status === "SCHEDULED"
                          ? "bg-yellow-100 text-yellow-700"
                          : item.status === "IN_PROGRESS"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                  >
                    {item.status}
                  </span>

                </div>

                <div className="mt-6 flex gap-3">

                  {item.status === "SCHEDULED" && (
                    <button
                      onClick={() => startMutation.mutate(item.id)}
                      disabled={startMutation.isLoading}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg disabled:bg-gray-400"
                    >
                      {startMutation.isLoading
                        ? "Starting..."
                        : "Start Maintenance"}
                    </button>
                  )}

                  {item.status === "IN_PROGRESS" && (
                    <button
                      onClick={() => completeMutation.mutate(item.id)}
                      disabled={completeMutation.isLoading}
                      className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg disabled:bg-gray-400"
                    >
                      {completeMutation.isLoading
                        ? "Completing..."
                        : "Complete Maintenance"}
                    </button>
                  )}

                </div>

              </div>

            ))}

          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default MyMaintenancePage;