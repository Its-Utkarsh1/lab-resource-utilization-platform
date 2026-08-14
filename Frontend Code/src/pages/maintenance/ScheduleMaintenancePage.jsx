import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useLabTechnicians } from "../../hooks/useUsers";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useCreateMaintenance } from "../../hooks/useMaintenance";

// Same token palette as the rest of the app:
// ink #14181C · paper #F6F5F1 · steel #5B6770 · amber #E8A33D · teal #1F7A6C · line #D8D3C7

const inputClass =
  "w-full rounded-sm border border-[#D8D3C7] p-3 text-[#14181C] focus:outline-none focus:border-[#1F7A6C] focus:ring-1 focus:ring-[#1F7A6C] transition-colors";
const readOnlyClass = "w-full rounded-sm border border-[#D8D3C7] p-3 text-[#5B6770] bg-[#F6F5F1]";
const labelClass = "block mb-2 font-medium text-[#14181C]";

const MAINTENANCE_TYPES = [
  { value: "PREVENTIVE", label: "Preventive" },
  { value: "CORRECTIVE", label: "Repair" },
  { value: "CALIBRATION", label: "Calibration" },
];

const today = () => new Date().toISOString().split("T")[0];

const ScheduleMaintenancePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const equipmentCode = searchParams.get("equipment");
  const labCode = searchParams.get("lab");

  const createMaintenance = useCreateMaintenance();
  const { data: technicians = [] } = useLabTechnicians();
  const isScheduling = createMaintenance.isPending ?? createMaintenance.isLoading ?? false;

  const [form, setForm] = useState({
    equipmentCode: equipmentCode || "",
    labCode: labCode || "",
    maintenanceType: "",
    scheduledDate: "",
    technicianEmail: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMaintenance.mutate(form, {
      onSuccess: () => {
        toast.success("Maintenance scheduled");
        navigate(`/equipment/${equipmentCode}?lab=${labCode}`, { replace: true });
      },
      onError: (err) => toast.error(err.response?.data?.message || "Failed to schedule maintenance"),
    });
  };

  if (!equipmentCode || !labCode) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto bg-white rounded-sm border border-[#D8D3C7] p-10 text-center">
          <h2 className="text-xl font-bold text-[#14181C] mb-2">No equipment selected</h2>
          <p className="text-[#5B6770]">
            This page needs an equipment and lab reference to schedule maintenance. Go back and choose equipment first.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto bg-white rounded-sm border border-[#D8D3C7] p-8">
        <h1 className="text-3xl font-black text-[#14181C] tracking-tight mb-8">Schedule Maintenance</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Equipment Code</label>
              <input type="text" value={form.equipmentCode} readOnly className={readOnlyClass} />
            </div>
            <div>
              <label className={labelClass}>Lab Code</label>
              <input type="text" value={form.labCode} readOnly className={readOnlyClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Maintenance Type</label>
            <select name="maintenanceType" value={form.maintenanceType} onChange={handleChange} required className={inputClass}>
              <option value="">Select Maintenance Type</option>
              {MAINTENANCE_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Scheduled Date</label>
            <input
              type="date"
              name="scheduledDate"
              min={today()}
              value={form.scheduledDate}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Technician</label>
            <select name="technicianEmail" value={form.technicianEmail} onChange={handleChange} required className={inputClass}>
              <option value="">Select Technician</option>
              {technicians.map((technician) => (
                <option key={technician.id} value={technician.email}>
                  {technician.fullName} ({technician.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              rows={4}
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={isScheduling}
              className="px-6 py-3 rounded-sm border border-[#D8D3C7] text-[#14181C] font-mono text-sm uppercase tracking-wide hover:border-[#14181C]/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isScheduling}
              className="bg-[#E8A33D] hover:bg-[#d4922f] text-white px-6 py-3 rounded-sm font-mono text-sm uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isScheduling ? "Scheduling..." : "Schedule Maintenance"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ScheduleMaintenancePage;