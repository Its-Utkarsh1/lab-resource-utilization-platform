import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { useCreateLab } from "../../hooks/useLab";

// Same token palette as the rest of the app:
// ink #14181C · paper #F6F5F1 · steel #5B6770 · amber #E8A33D · teal #1F7A6C · line #D8D3C7

const inputClass =
  "w-full rounded-sm border border-[#D8D3C7] px-4 py-2.5 text-[#14181C] placeholder-[#5B6770]/60 focus:outline-none focus:border-[#1F7A6C] focus:ring-1 focus:ring-[#1F7A6C] transition-colors";
const readOnlyClass = "w-full rounded-sm border border-[#D8D3C7] px-4 py-2.5 text-[#5B6770] bg-[#F6F5F1]";
const labelClass = "block font-medium text-[#14181C] mb-2";

const CreateLabPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const createLabMutation = useCreateLab();

  const [formData, setFormData] = useState({
    institutionName: user?.institutionName || "",
    institutionCode: user?.institutionCode || "",
    departmentName: user?.departmentName || "",
    managerEmail: user?.email || "",
    labName: "",
    labCode: "",
    location: "",
    userCapacity: 1,
    status: "AVAILABLE",
  });

  // The read-only fields above are seeded from `user` at mount, but if
  // `user` from context/useAuth resolves asynchronously (as it does
  // elsewhere in this app), a mount that beats that resolution would
  // leave them permanently blank with nothing to re-sync them. Sync
  // whenever `user` actually arrives or changes.
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        institutionName: user.institutionName || "",
        institutionCode: user.institutionCode || "",
        departmentName: user.departmentName || "",
        managerEmail: user.email || "",
      }));
    }
  }, [user]);

  const isSaving = createLabMutation.isPending ?? createLabMutation.isLoading ?? false;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "userCapacity" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createLabMutation.mutate(formData, {
      onSuccess: () => navigate("/labs"),
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto bg-white rounded-sm border border-[#D8D3C7] p-8">
        <h1 className="text-3xl font-black text-[#14181C] tracking-tight mb-8">Create Laboratory</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={labelClass}>Institution Name</label>
            <input type="text" name="institutionName" value={formData.institutionName} readOnly className={readOnlyClass} />
          </div>

          <div>
            <label className={labelClass}>Institution Code</label>
            <input type="text" name="institutionCode" value={formData.institutionCode} readOnly className={readOnlyClass} />
          </div>

          <div>
            <label className={labelClass}>Department</label>
            <input type="text" name="departmentName" value={formData.departmentName} readOnly className={readOnlyClass} />
          </div>

          <div>
            <label className={labelClass}>Lab Manager Email</label>
            <input type="email" name="managerEmail" value={formData.managerEmail} readOnly className={readOnlyClass} />
          </div>

          <div>
            <label className={labelClass}>Lab Name</label>
            <input
              type="text"
              name="labName"
              value={formData.labName}
              onChange={handleChange}
              placeholder="Programming Lab"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Lab Code</label>
            <input
              type="text"
              name="labCode"
              value={formData.labCode}
              onChange={handleChange}
              placeholder="CSLAB001"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Block A - First Floor"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>User Capacity</label>
            <input
              type="number"
              name="userCapacity"
              value={formData.userCapacity}
              onChange={handleChange}
              min="1"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className={inputClass}>
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="OCCUPIED">OCCUPIED</option>
              <option value="MAINTENANCE">MAINTENANCE</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-[#14181C] hover:bg-[#2a2f35] text-white px-6 py-3 rounded-sm font-mono text-sm uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? "Creating..." : "Create Lab"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/labs")}
              disabled={isSaving}
              className="border border-[#D8D3C7] px-6 py-3 rounded-sm font-mono text-sm uppercase tracking-wide text-[#14181C] hover:border-[#14181C]/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateLabPage;