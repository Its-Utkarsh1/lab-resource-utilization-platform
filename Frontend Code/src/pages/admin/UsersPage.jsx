import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { ROLE_LABELS } from "../../utils/roles";
import { getInitials } from "../../utils/helpers";

import { useUsersByDepartment } from "../../hooks/useUsers";
import { useInstitutions } from "../../hooks/useInstitutions";
import { useDepartments } from "../../hooks/useDepartments";

// Same token palette as the rest of the app:
// ink #14181C · paper #F6F5F1 · steel #5B6770 · amber #E8A33D · teal #1F7A6C · line #D8D3C7

const selectClass =
  "w-full rounded-sm border border-[#D8D3C7] px-4 py-2.5 text-[#14181C] focus:outline-none focus:border-[#1F7A6C] focus:ring-1 focus:ring-[#1F7A6C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"

const UsersPage = () => {
  const [search, setSearch] = useState("");
  const [selectedInstitution, setSelectedInstitution] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const { user } = useAuth();

  const { data: institutions = [], isLoading: institutionLoading } = useInstitutions();
  const { data: departments = [], isLoading: departmentLoading } = useDepartments(selectedInstitution);
  const { data: users = [], isLoading: usersLoading } = useUsersByDepartment(selectedInstitution, selectedDepartment);

  // Only treat the users list as "loading" once both filters are actually
  // set — otherwise a disabled/not-yet-fired query can report isLoading
  // indefinitely and there'd be nothing to show a spinner *for*.
  const hasSelection = Boolean(selectedInstitution && selectedDepartment);

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return (u.fullName ?? "").toLowerCase().includes(q) || (u.email ?? "").toLowerCase().includes(q);
  });

  useEffect(() => {
    if (user?.role === "INSTITUTION_ADMIN" && user?.institutionCode) {
      setSelectedInstitution(user.institutionCode);
    }
  }, [user]);

  // Only the institutions list gates the whole page — the filters
  // themselves need it to render at all. Department/user loading is
  // handled inline below so the filter controls are never blocked.
  if (institutionLoading) {
    return (
      <DashboardLayout>
        <LoadingSpinner fullScreen text="Loading institutions..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#14181C] tracking-tight">User Management</h1>
        <p className="text-[#5B6770] mt-1">Select an institution and department to view users.</p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <select
          aria-label="Institution"
          value={selectedInstitution}
          onChange={(e) => {
            setSelectedInstitution(e.target.value);
            setSelectedDepartment("");
          }}
          disabled={user?.role === "INSTITUTION_ADMIN"}
          className={selectClass}
        >
          <option value="">Select Institution</option>
          {institutions.map((institution) => (
            <option key={institution.code} value={institution.code}>
              {institution.name}
            </option>
          ))}
        </select>

        <select
          aria-label="Department"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          disabled={!selectedInstitution || departmentLoading}
          className={selectClass}
        >
          <option value="">
            {departmentLoading ? "Loading departments..." : "Select Department"}
          </option>
          {departments.map((department) => (
            <option key={department.id} value={department.name}>
              {department.name}
            </option>
          ))}
        </select>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${selectClass} pl-10`}
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5B6770]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
        </svg>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-sm border border-[#D8D3C7] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F6F5F1] border-b border-[#D8D3C7]">
              <tr>
                <th className="text-left px-6 py-4 font-mono text-xs tracking-widest text-[#5B6770] uppercase">User</th>
                <th className="text-left px-6 py-4 font-mono text-xs tracking-widest text-[#5B6770] uppercase">Role</th>
                <th className="text-left px-6 py-4 font-mono text-xs tracking-widest text-[#5B6770] uppercase">Department</th>
                <th className="text-left px-6 py-4 font-mono text-xs tracking-widest text-[#5B6770] uppercase">Institution</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#D8D3C7]">
              {!hasSelection ? (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-[#5B6770]">
                    Select an institution and department.
                  </td>
                </tr>
              ) : usersLoading ? (
                <tr>
                  <td colSpan={4} className="py-10">
                    <LoadingSpinner text="Loading users..." />
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[#F6F5F1]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-sm bg-[#14181C] flex items-center justify-center text-xs font-mono font-bold text-[#E8A33D] shrink-0">
                          {getInitials(u.fullName)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-[#14181C]">{u.fullName}</p>
                          <p className="text-xs text-[#5B6770]">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#5B6770]">{ROLE_LABELS[u.role] || u.role}</td>
                    <td className="px-6 py-4 text-[#5B6770]">{u.department}</td>
                    <td className="px-6 py-4 text-[#5B6770]">{u.institution}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-[#5B6770]">
                    No users found.
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