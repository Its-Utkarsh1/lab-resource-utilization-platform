import React from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import { useAuth } from "../../context/AuthContext";
import { useLabsByDepartment } from "../../hooks/useLab";

const LabPage = () => {
  const { user } = useAuth();

  console.log(user);

const {
  data: labs = [],
  isLoading,
  error,
} = useLabsByDepartment(
  user?.institutionCode,
  user?.departmentName
);

console.log(labs);
console.log(error);

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-red-500">
          Failed to load labs.
        </div>
      </DashboardLayout>
    );
  }

  if (labs.length === 0) {
    return (
      <DashboardLayout>
        <EmptyState
          icon="🧪"
          title="No Labs Found"
          description="No labs are available in your department."
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Laboratories
        </h1>

        <p className="text-slate-600">
          {user?.departmentName}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {labs.map((lab) => (

          <Link
            key={lab.labCode}
            to={`/equipment/${lab.labCode}`}
            className="bg-white rounded-xl shadow border p-6 hover:border-green-500 transition"
          >
            <div className="text-5xl mb-4">
              🧪
            </div>

            <h2 className="text-xl font-bold">
              {lab.labName}
            </h2>

            <p className="text-slate-500 mt-2">
              {lab.labCode}
            </p>

            <p className="mt-6 text-green-600 font-medium">
              View Equipment →
            </p>

          </Link>

        ))}

      </div>

    </DashboardLayout>
  );
};

export default LabPage;