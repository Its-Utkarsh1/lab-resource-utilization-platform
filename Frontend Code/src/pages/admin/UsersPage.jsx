import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { ROLE_LABELS } from "../../utils/roles";

import { useUsersByDepartment } from "../../hooks/useUsers";
import { useInstitutions } from "../../hooks/useInstitutions";
import { useDepartments } from "../../hooks/useDepartments";

const UsersPage = () => {
  const [search, setSearch] = useState("");
  const [selectedInstitution, setSelectedInstitution] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const { user } = useAuth();

  const {
    data: institutions = [],
    isLoading: institutionLoading,
  } = useInstitutions();

  const {
    data: departments = [],
    isLoading: departmentLoading,
  } = useDepartments(selectedInstitution);

  const {
    data: users = [],
    isLoading: usersLoading,
  } = useUsersByDepartment(
    selectedInstitution,
    selectedDepartment
  );

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (
      user?.role === "INSTITUTION_ADMIN" &&
      user?.institutionCode
    ) {
      setSelectedInstitution(user.institutionCode);
    }
  }, [user]);

  if (institutionLoading || departmentLoading || usersLoading) {
    return (
      <DashboardLayout>
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            User Management
          </h1>

          <p className="text-slate-600">
            Select an institution and department to view users.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <select
          value={selectedInstitution}
          onChange={(e) => {
            setSelectedInstitution(e.target.value);
            setSelectedDepartment("");
          }}
          disabled={user?.role === "INSTITUTION_ADMIN"}
          className="input-field"
        >
          <option value="">Select Institution</option>

          {institutions.map((institution) => (
            <option
              key={institution.code}
              value={institution.code}
            >
              {institution.name}
            </option>
          ))}
        </select>

        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          disabled={!selectedInstitution}
          className="input-field"
        >
          <option value="">Select Department</option>

          {departments.map((department) => (
            <option
              key={department.id}
              value={department.name}
            >
              {department.name}
            </option>
          ))}
        </select>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10 max-w-md"
        />

        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          🔍
        </span>
      </div>

      {/* Users Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-6 py-4">User</th>
                <th className="text-left px-6 py-4">Role</th>
                <th className="text-left px-6 py-4">Department</th>
                <th className="text-left px-6 py-4">Institution</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-sm font-bold text-white">
                          {user.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>

                        <div>
                          <p className="font-medium text-slate-900">
                            {user.fullName}
                          </p>

                          <p className="text-xs text-slate-500">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {ROLE_LABELS[user.role] || user.role}
                    </td>

                    <td className="px-6 py-4">
                      {user.department}
                    </td>

                    <td className="px-6 py-4">
                      {user.institution}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-10 text-slate-500"
                  >
                    {selectedDepartment
                      ? "No users found."
                      : "Select an institution and department."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UsersPage;