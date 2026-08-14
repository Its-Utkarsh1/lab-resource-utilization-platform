import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { useCreateEquipment } from "../../hooks/useEquipment";

// Same token palette as the rest of the app:
// ink #14181C · paper #F6F5F1 · steel #5B6770 · amber #E8A33D · teal #1F7A6C · line #D8D3C7

const inputClass =
  "w-full rounded-sm border border-[#D8D3C7] px-4 py-2.5 text-[#14181C] placeholder-[#5B6770]/60 focus:outline-none focus:border-[#1F7A6C] focus:ring-1 focus:ring-[#1F7A6C] transition-colors";
const labelClass = "block text-xs font-mono tracking-widest text-[#5B6770] uppercase mb-2";

const Field = ({ label, span = "", children }) => (
  <div className={span}>
    <label className={labelClass}>{label}</label>
    {children}
  </div>
);

const CreateEquipmentPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const createEquipment = useCreateEquipment();

  const [formData, setFormData] = useState({
    institutionCode: "",
    labCode: "",
    equipmentName: "",
    equipmentCode: "",
    description: "",
    manufacturer: "",
    model: "",
    quantity: 1,
    hourlyRate: 0,
    status: "AVAILABLE",
    serviceIntervalDays: 180,
    lastServiceDate: new Date().toISOString().split("T")[0],
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const isSaving = createEquipment.isPending ?? createEquipment.isLoading ?? false;

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({ ...prev, institutionCode: user.institutionCode }));
    }
  }, [user]);

  // The preview URL is a blob: URL created by createObjectURL — it must be
  // explicitly revoked or the browser holds that memory until the tab
  // closes. Revoke the old one whenever it's replaced or on unmount.
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.type === "number" ? Number(e.target.value) : e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (image) data.append("image", image);

    createEquipment.mutate(data, {
      onSuccess: () => navigate(-1),
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-black text-[#14181C] tracking-tight">Add Equipment</h1>
          <p className="text-[#5B6770] mt-1">Register a new piece of equipment for booking.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-sm border border-[#D8D3C7] overflow-hidden">
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Institution Code">
                <input
                  className={inputClass}
                  name="institutionCode"
                  value={formData.institutionCode}
                  onChange={handleChange}
                  placeholder="e.g. KIT-VNS"
                  required
                />
              </Field>

              <Field label="Lab Code">
                <input
                  className={inputClass}
                  name="labCode"
                  value={formData.labCode}
                  onChange={handleChange}
                  placeholder="e.g. LAB-04"
                  required
                />
              </Field>

              <Field label="Equipment Name">
                <input
                  className={inputClass}
                  name="equipmentName"
                  value={formData.equipmentName}
                  onChange={handleChange}
                  placeholder="e.g. Digital Oscilloscope"
                  required
                />
              </Field>

              <Field label="Equipment Code">
                <input
                  className={inputClass}
                  name="equipmentCode"
                  value={formData.equipmentCode}
                  onChange={handleChange}
                  placeholder="e.g. EQ-1042"
                  required
                />
              </Field>

              <Field label="Description" span="md:col-span-2">
                <textarea
                  rows={3}
                  className={`${inputClass} resize-y`}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Specs, condition, or usage notes"
                />
              </Field>

              <Field label="Manufacturer">
                <input
                  className={inputClass}
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleChange}
                  placeholder="e.g. Dell"
                  required
                />
              </Field>

              <Field label="Model">
                <input
                  className={inputClass}
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="e.g. Precision 5820"
                  required
                />
              </Field>

              <Field label="Quantity">
                <input
                  type="number"
                  min="1"
                  required
                  className={inputClass}
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                />
              </Field>

              <Field label="Price / Hour (₹)">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  className={inputClass}
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                />
              </Field>

              <Field label="Service Interval (Days)">
                <input
                  type="number"
                  min="1"
                  required
                  className={inputClass}
                  name="serviceIntervalDays"
                  value={formData.serviceIntervalDays}
                  onChange={handleChange}
                />
              </Field>

              <Field label="Last Service Date">
                <input
                  type="date"
                  required
                  className={inputClass}
                  name="lastServiceDate"
                  value={formData.lastServiceDate}
                  onChange={handleChange}
                />
              </Field>

              <Field label="Status">
                <select className={inputClass} name="status" value={formData.status} onChange={handleChange}>
                  <option value="AVAILABLE">Available</option>
                  <option value="IN_USE">In Use</option>
                  <option value="UNDER_MAINTENANCE">Under Maintenance</option>
                  <option value="OUT_OF_SERVICE">Out of Service</option>
                </select>
              </Field>

              <Field label="Equipment Image" span="md:col-span-2">
                <input type="file" accept="image/*" onChange={handleImageChange} className={inputClass} />
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="mt-3 w-[220px] h-[160px] object-cover rounded-sm border border-[#D8D3C7]"
                  />
                )}
              </Field>
            </div>

            <div className="px-6 py-4 border-t border-[#D8D3C7] bg-[#F6F5F1] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={isSaving}
                className="px-5 py-2.5 rounded-sm border border-[#D8D3C7] text-[#14181C] font-mono text-sm uppercase tracking-wide hover:border-[#14181C]/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-sm bg-[#14181C] text-[#F6F5F1] font-mono text-sm uppercase tracking-wide hover:bg-[#2a2f35] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving && (
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                )}
                {isSaving ? "Saving..." : "Save Equipment"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateEquipmentPage;