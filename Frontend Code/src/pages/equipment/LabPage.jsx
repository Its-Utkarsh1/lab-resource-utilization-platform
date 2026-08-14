import React from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import { useAuth } from "../../context/AuthContext";
import { useLabsByDepartment } from "../../hooks/useLab";

// Same token palette as the rest of the app:
// ink #14181C · paper #F6F5F1 · steel #5B6770 · amber #E8A33D · teal #1F7A6C · line #D8D3C7

// Same beaker glyph used in the app's logo (DashboardLayout / Login /
// Register), reused here so lab cards share the app's icon language
// instead of a generic emoji.
const BeakerIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

const LabPage = () => {
  const { user } = useAuth();

  // NOTE: simplified from a three-way check (`user?.role?.roleName`,
  // `user?.roleName`, `user?.role`) to match the flat string role shape
  // confirmed elsewhere in the app. Same caveat as EquipmentDetailPage —
  // worth confirming no code path actually returns a nested role object
  // before relying on this.
  const canCreateLab = ["SYSTEM_ADMIN", "INSTITUTION_ADMIN"].includes(user?.role);

  const { data: labs = [], isLoading, error } = useLabsByDepartment(user?.institutionCode, user?.departmentName);

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingSpinner fullScreen text="Loading laboratories..." />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-sm p-4 text-center">
          Failed to load labs.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#14181C] tracking-tight">Laboratories</h1>
          <p className="text-[#5B6770] mt-1">{user?.departmentName}</p>
        </div>

        {canCreateLab && (
          <Link
            to="/labs/create"
            className="bg-[#14181C] hover:bg-[#2a2f35] text-white px-5 py-2.5 rounded-sm font-mono text-sm uppercase tracking-wide transition-colors shrink-0"
          >
            + Add Lab
          </Link>
        )}
      </div>

      {labs.length === 0 ? (
        <EmptyState icon="🧪" title="No Labs Found" description="No labs are available in your department." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {labs.map((lab) => (
            <Link
              key={lab.labCode}
              to={`/equipment/${lab.labCode}`}
              className="bg-white rounded-sm border border-[#D8D3C7] p-6 hover:border-[#1F7A6C]/40 transition-colors"
            >
              <div className="w-12 h-12 border border-[#D8D3C7] rounded-sm flex items-center justify-center mb-4">
                <BeakerIcon className="w-6 h-6 text-[#1F7A6C]" />
              </div>

              <h2 className="text-xl font-bold text-[#14181C]">{lab.labName}</h2>
              <p className="text-[#5B6770] font-mono text-sm mt-1">{lab.labCode}</p>

              <p className="mt-6 text-[#1F7A6C] font-medium text-sm">View Equipment →</p>
            </Link>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default LabPage;