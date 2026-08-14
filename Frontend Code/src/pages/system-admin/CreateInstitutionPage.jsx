import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useCreateInstitution } from "../../hooks/useInstitutions";

// Same token palette as the rest of the app:
// ink #14181C · paper #F6F5F1 · steel #5B6770 · amber #E8A33D · teal #1F7A6C · line #D8D3C7

const inputClass =
  "w-full rounded-sm border border-[#D8D3C7] px-4 py-2.5 text-[#14181C] focus:outline-none focus:border-[#1F7A6C] focus:ring-1 focus:ring-[#1F7A6C] transition-colors";
const labelClass = "block mb-2 font-medium text-[#14181C]";

const CreateInstitutionPage = () => {
  const navigate = useNavigate();
  const createInstitution = useCreateInstitution();
  const isSaving = createInstitution.isPending ?? createInstitution.isLoading ?? false;

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    email: "",
    phoneNumber: "",
    website: "",
    address: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createInstitution.mutate(formData, {
      onSuccess: () => {
        toast.success("Institution created");
        navigate("/dashboard");
      },
      onError: (err) => toast.error(err.response?.data?.message || "Failed to create institution"),
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-sm border border-[#D8D3C7] p-8">
          <h1 className="text-3xl font-black text-[#14181C] tracking-tight mb-2">Create Institution</h1>
          <p className="text-[#5B6770] mb-8">Register a new institution in the platform.</p>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Institution Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Institution Code</label>
              <input type="text" name="code" value={formData.code} onChange={handleChange} required className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} required className={inputClass} />
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={isSaving}
                className="px-6 py-3 rounded-sm border border-[#D8D3C7] text-[#14181C] font-mono text-sm uppercase tracking-wide hover:border-[#14181C]/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-3 rounded-sm bg-[#14181C] text-white font-mono text-sm uppercase tracking-wide hover:bg-[#2a2f35] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? "Creating..." : "Create Institution"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateInstitutionPage;