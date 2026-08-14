import React, { useMemo, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import StatusBadge from "../../components/common/StatusBadge";
import { useSharingHistory } from "../../hooks/useSharing";

// Same token palette as the rest of the app:
// ink #14181C · paper #F6F5F1 · steel #5B6770 · amber #E8A33D · teal #1F7A6C · line #D8D3C7

const inputClass =
  "w-full rounded-sm border border-[#D8D3C7] px-3 py-2 text-sm text-[#14181C] placeholder-[#5B6770]/60 focus:outline-none focus:border-[#1F7A6C] focus:ring-1 focus:ring-[#1F7A6C] transition-colors";
const labelClass = "block text-sm font-medium text-[#14181C] mb-1";

const SharingHistoryPage = () => {
  const { data: history = [], isLoading } = useSharingHistory();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const statuses = useMemo(() => [...new Set(history.map((h) => h.status))], [history]);

  const filteredHistory = useMemo(() => {
    const term = search.trim().toLowerCase();
    return history.filter((item) => {
      const matchesStatus = !statusFilter || item.status === statusFilter;
      const matchesSearch =
        !term || item.equipmentName?.toLowerCase().includes(term) || item.sharingCode?.toLowerCase().includes(term);
      return matchesStatus && matchesSearch;
    });
  }, [history, search, statusFilter]);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-black text-[#14181C] tracking-tight">Sharing History</h1>
          <p className="text-sm text-[#5B6770] mt-1">
            A record of every completed, rejected, or cancelled sharing request.
          </p>
        </div>

        {/* Filters */}
        {!isLoading && history.length > 0 && (
          <div className="bg-white border border-[#D8D3C7] rounded-sm p-5 mb-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Search</label>
                <input
                  type="text"
                  placeholder="Search by equipment or sharing code..."
                  className={inputClass}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Status</label>
                <select className={inputClass} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="">All statuses</option>
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="bg-white border border-[#D8D3C7] rounded-sm overflow-hidden">
          {isLoading ? (
            <LoadingSpinner text="Loading history..." />
          ) : history.length === 0 ? (
            <EmptyState
              icon="🗂️"
              title="No sharing history"
              description="Past sharing requests will appear here once they've been completed, rejected, or cancelled."
            />
          ) : filteredHistory.length === 0 ? (
            <EmptyState icon="🔍" title="No matching records" description="Try a different search term or status filter." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#F6F5F1] border-b border-[#D8D3C7]">
                  <tr>
                    <th className="text-left px-5 py-3 font-mono text-xs tracking-widest text-[#5B6770] uppercase">Sharing Code</th>
                    <th className="text-left px-5 py-3 font-mono text-xs tracking-widest text-[#5B6770] uppercase">Equipment</th>
                    <th className="text-left px-5 py-3 font-mono text-xs tracking-widest text-[#5B6770] uppercase">Owner Institution</th>
                    <th className="text-left px-5 py-3 font-mono text-xs tracking-widest text-[#5B6770] uppercase">Request Institution</th>
                    <th className="text-left px-5 py-3 font-mono text-xs tracking-widest text-[#5B6770] uppercase">Requested By</th>
                    <th className="text-left px-5 py-3 font-mono text-xs tracking-widest text-[#5B6770] uppercase">Qty</th>
                    <th className="text-left px-5 py-3 font-mono text-xs tracking-widest text-[#5B6770] uppercase">Duration</th>
                    <th className="text-left px-5 py-3 font-mono text-xs tracking-widest text-[#5B6770] uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8D3C7]">
                  {filteredHistory.map((item) => (
                    <tr key={item.sharingCode} className="hover:bg-[#F6F5F1] transition-colors align-top">
                      <td className="px-5 py-3 font-mono text-xs text-[#5B6770] whitespace-nowrap">{item.sharingCode}</td>
                      <td className="px-5 py-3 font-medium text-[#14181C]">{item.equipmentName}</td>
                      <td className="px-5 py-3 text-[#5B6770]">{item.ownerInstitution}</td>
                      <td className="px-5 py-3 text-[#5B6770]">{item.requestInstitution}</td>
                      <td className="px-5 py-3 text-[#5B6770]">{item.requestedBy}</td>
                      <td className="px-5 py-3 font-mono text-[#5B6770]">{item.quantity}</td>
                      <td className="px-5 py-3 text-[#5B6770] font-mono text-xs whitespace-nowrap">
                        <div>{item.startDate}</div>
                        <div className="text-[#5B6770]/70">to {item.endDate}</div>
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={item.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SharingHistoryPage;