import React, { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import {
  useAvailableEquipment,
  useAvailableInstitutions,
  useDepartments,
  useRequestEquipment,
} from "../../hooks/useSharing";

// Same token palette as the rest of the app:
// ink #14181C · paper #F6F5F1 · steel #5B6770 · amber #E8A33D · teal #1F7A6C · line #D8D3C7

const inputClass =
  "w-full rounded-sm border border-[#D8D3C7] px-3 py-2 text-sm text-[#14181C] placeholder-[#5B6770]/60 focus:outline-none focus:border-[#1F7A6C] focus:ring-1 focus:ring-[#1F7A6C] transition-colors disabled:bg-[#F6F5F1] disabled:text-[#5B6770]/60";
const labelClass = "block text-sm font-medium text-[#14181C] mb-1";

const emptyForm = { quantity: 1, purpose: "", startDate: "", endDate: "", remarks: "" };
const today = () => new Date().toISOString().split("T")[0];

const AvailableEquipmentPage = () => {
  const [selectedInstitution, setSelectedInstitution] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [search, setSearch] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  const { data: institutions = [], isLoading: institutionsLoading } = useAvailableInstitutions();
  const { data: departments = [] } = useDepartments(selectedInstitution);
  const { data: equipment = [], isLoading } = useAvailableEquipment(selectedInstitution, selectedDepartment);
  const requestMutation = useRequestEquipment();
  const isSubmitting = requestMutation.isPending ?? requestMutation.isLoading ?? false;

  const filteredEquipment = useMemo(() => {
    const q = search.trim().toLowerCase();
    return equipment.filter((e) => (e.equipmentName ?? "").toLowerCase().includes(q));
  }, [equipment, search]);

  const openRequestModal = (item) => {
    setSelectedEquipment(item);
    setFormData(emptyForm);
    setFormError("");
  };

  const closeRequestModal = () => {
    setSelectedEquipment(null);
    setFormData(emptyForm);
    setFormError("");
  };

  // Close on Escape, same as clicking the backdrop.
  useEffect(() => {
    if (!selectedEquipment) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeRequestModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedEquipment]);

  const updateField = (field) => (e) => setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    const quantity = Number(formData.quantity);
    if (!Number.isInteger(quantity) || quantity < 1) {
      setFormError("Quantity must be a whole number of at least 1.");
      return;
    }
    if (quantity > selectedEquipment.quantity) {
      setFormError(`Only ${selectedEquipment.quantity} unit(s) available.`);
      return;
    }
    if (!formData.startDate || !formData.endDate) {
      setFormError("Please select both a start and end date.");
      return;
    }
    if (new Date(formData.startDate) < new Date(today())) {
      setFormError("Start date cannot be in the past.");
      return;
    }
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setFormError("End date cannot be before the start date.");
      return;
    }
    if (!formData.purpose.trim()) {
      setFormError("Please describe the purpose of this request.");
      return;
    }

    requestMutation.mutate(
      { equipmentCode: selectedEquipment.equipmentCode, ...formData, quantity },
      {
        onSuccess: closeRequestModal,
        onError: (err) => setFormError(err?.message || "Something went wrong. Please try again."),
      }
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-black text-[#14181C] tracking-tight">Available Equipment</h1>
          <p className="text-sm text-[#5B6770] mt-1">
            Browse equipment shared by other institutions and submit a request to borrow it.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white border border-[#D8D3C7] rounded-sm p-5 mb-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className={labelClass}>Institution</label>
              <select
                className={inputClass}
                value={selectedInstitution}
                onChange={(e) => {
                  setSelectedInstitution(e.target.value);
                  setSelectedDepartment("");
                }}
                disabled={institutionsLoading}
              >
                <option value="">{institutionsLoading ? "Loading..." : "Select an institution"}</option>
                {institutions.map((institution) => (
                  <option key={institution.code} value={institution.code}>
                    {institution.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Department</label>
              <select
                className={inputClass}
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                disabled={!selectedInstitution}
              >
                <option value="">Select Department</option>
                {departments.map((department) => (
                  <option key={department.name} value={department.name}>
                    {department.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Search equipment</label>
              <input
                type="text"
                placeholder="e.g. Centrifuge, Microscope..."
                className={inputClass}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                disabled={!selectedInstitution}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white border border-[#D8D3C7] rounded-sm overflow-hidden">
          {isLoading ? (
            <LoadingSpinner text="Loading equipment..." />
          ) : !selectedInstitution || !selectedDepartment ? (
            <EmptyState
              icon="🏛️"
              title="Select Institution and Department"
              description="Select an institution and then a department to view available equipment."
            />
          ) : filteredEquipment.length === 0 ? (
            <EmptyState
              icon="🔍"
              title="No equipment found"
              description={
                search
                  ? `No equipment matches "${search}" at this institution.`
                  : "This institution has no equipment listed as available right now."
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#F6F5F1] border-b border-[#D8D3C7]">
                  <tr>
                    <th className="text-left px-5 py-3 font-mono text-xs tracking-widest text-[#5B6770] uppercase">Code</th>
                    <th className="text-left px-5 py-3 font-mono text-xs tracking-widest text-[#5B6770] uppercase">Equipment</th>
                    <th className="text-left px-5 py-3 font-mono text-xs tracking-widest text-[#5B6770] uppercase">Institution</th>
                    <th className="text-left px-5 py-3 font-mono text-xs tracking-widest text-[#5B6770] uppercase">Available Qty</th>
                    <th className="text-right px-5 py-3 font-mono text-xs tracking-widest text-[#5B6770] uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8D3C7]">
                  {filteredEquipment.map((item) => (
                    <tr key={item.equipmentCode} className="hover:bg-[#F6F5F1] transition-colors">
                      <td className="px-5 py-3 font-mono text-xs text-[#5B6770]">{item.equipmentCode}</td>
                      <td className="px-5 py-3 font-medium text-[#14181C]">{item.equipmentName}</td>
                      <td className="px-5 py-3 text-[#5B6770]">{item.ownerInstitution}</td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-mono uppercase tracking-wide bg-[#1F7A6C]/10 text-[#1F7A6C]">
                          {item.quantity} available
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          className="inline-flex items-center rounded-sm bg-[#14181C] px-3 py-1.5 text-xs font-mono uppercase tracking-wide text-white hover:bg-[#2a2f35] transition-colors"
                          onClick={() => openRequestModal(item)}
                        >
                          Request
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Request Modal */}
      {selectedEquipment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          onClick={closeRequestModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="request-equipment-title"
            className="w-full max-w-md bg-white rounded-sm shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#D8D3C7]">
                <div>
                  <h2 id="request-equipment-title" className="text-base font-bold text-[#14181C]">
                    Request Equipment
                  </h2>
                  <p className="text-xs text-[#5B6770] mt-0.5">
                    {selectedEquipment.equipmentName} · {selectedEquipment.ownerInstitution}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeRequestModal}
                  className="text-[#5B6770] hover:text-[#14181C] text-xl leading-none"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
                {formError && (
                  <div className="rounded-sm bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                    {formError}
                  </div>
                )}

                <div>
                  <label className={labelClass}>
                    Quantity <span className="text-[#5B6770] font-normal">(max {selectedEquipment.quantity})</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={selectedEquipment.quantity}
                    required
                    className={inputClass}
                    value={formData.quantity}
                    onChange={updateField("quantity")}
                  />
                </div>

                <div>
                  <label className={labelClass}>Purpose</label>
                  <textarea
                    rows={2}
                    placeholder="What will this be used for?"
                    className={inputClass}
                    value={formData.purpose}
                    onChange={updateField("purpose")}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Start Date</label>
                    <input
                      type="date"
                      min={today()}
                      className={inputClass}
                      value={formData.startDate}
                      onChange={updateField("startDate")}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>End Date</label>
                    <input
                      type="date"
                      min={formData.startDate || today()}
                      className={inputClass}
                      value={formData.endDate}
                      onChange={updateField("endDate")}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>
                    Remarks <span className="text-[#5B6770] font-normal">(optional)</span>
                  </label>
                  <textarea rows={2} className={inputClass} value={formData.remarks} onChange={updateField("remarks")} />
                </div>
              </div>

              <div className="flex justify-end gap-2 px-6 py-4 border-t border-[#D8D3C7] bg-[#F6F5F1]">
                <button
                  type="button"
                  className="rounded-sm px-4 py-2 text-sm font-mono uppercase tracking-wide text-[#14181C] hover:bg-[#D8D3C7]/40 transition-colors"
                  onClick={closeRequestModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-sm bg-[#14181C] px-4 py-2 text-sm font-mono uppercase tracking-wide text-white hover:bg-[#2a2f35] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AvailableEquipmentPage;