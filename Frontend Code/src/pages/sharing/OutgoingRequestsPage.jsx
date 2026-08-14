import React from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import StatusBadge from "../../components/common/StatusBadge";
import { useOutgoingRequests, useCancelSharing } from "../../hooks/useSharing";

// Same token palette as the rest of the app:
// ink #14181C · paper #F6F5F1 · steel #5B6770 · amber #E8A33D · teal #1F7A6C · line #D8D3C7

const OutgoingRequestsPage = () => {
  const { data: requests = [], isLoading } = useOutgoingRequests();
  const cancelMutation = useCancelSharing();

  const isRowBusy = (code) => cancelMutation.isLoading && cancelMutation.variables === code;

  const handleCancel = (code) => {
    cancelMutation.mutate(code, {
      onSuccess: () => toast.success("Request cancelled"),
      onError: (err) => toast.error(err.response?.data?.message || "Failed to cancel request"),
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-black text-[#14181C] tracking-tight">Outgoing Sharing Requests</h1>
          <p className="text-sm text-[#5B6770] mt-1">Track equipment you've requested from other institutions.</p>
        </div>

        {/* Content */}
        <div className="bg-white border border-[#D8D3C7] rounded-sm overflow-hidden">
          {isLoading ? (
            <LoadingSpinner text="Loading requests..." />
          ) : requests.length === 0 ? (
            <EmptyState
              icon="📤"
              title="No outgoing requests"
              description="Requests you send for equipment from other institutions will show up here."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#F6F5F1] border-b border-[#D8D3C7]">
                  <tr>
                    <th className="text-left px-5 py-3 font-mono text-xs tracking-widest text-[#5B6770] uppercase">Sharing Code</th>
                    <th className="text-left px-5 py-3 font-mono text-xs tracking-widest text-[#5B6770] uppercase">Equipment</th>
                    <th className="text-left px-5 py-3 font-mono text-xs tracking-widest text-[#5B6770] uppercase">Owner Institution</th>
                    <th className="text-left px-5 py-3 font-mono text-xs tracking-widest text-[#5B6770] uppercase">Qty</th>
                    <th className="text-left px-5 py-3 font-mono text-xs tracking-widest text-[#5B6770] uppercase">Purpose</th>
                    <th className="text-left px-5 py-3 font-mono text-xs tracking-widest text-[#5B6770] uppercase">Duration</th>
                    <th className="text-left px-5 py-3 font-mono text-xs tracking-widest text-[#5B6770] uppercase">Status</th>
                    <th className="text-right px-5 py-3 font-mono text-xs tracking-widest text-[#5B6770] uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8D3C7]">
                  {requests.map((item) => {
                    const busy = isRowBusy(item.sharingCode);
                    return (
                      <tr key={item.sharingCode} className="hover:bg-[#F6F5F1] transition-colors align-top">
                        <td className="px-5 py-3 font-mono text-xs text-[#5B6770] whitespace-nowrap">{item.sharingCode}</td>
                        <td className="px-5 py-3 font-medium text-[#14181C]">{item.equipmentName}</td>
                        <td className="px-5 py-3 text-[#5B6770]">{item.ownerInstitution}</td>
                        <td className="px-5 py-3 font-mono text-[#5B6770]">{item.quantity}</td>
                        <td className="px-5 py-3 text-[#5B6770] max-w-[220px]">
                          <span className="line-clamp-2">{item.purpose}</span>
                        </td>
                        <td className="px-5 py-3 text-[#5B6770] font-mono text-xs whitespace-nowrap">
                          <div>{item.startDate}</div>
                          <div className="text-[#5B6770]/70">to {item.endDate}</div>
                        </td>
                        <td className="px-5 py-3">
                          <StatusBadge status={item.status} />
                        </td>
                        <td className="px-5 py-3 text-right">
                          {item.status === "PENDING" ? (
                            <button
                              className="rounded-sm border border-red-200 px-3 py-1.5 text-xs font-mono uppercase tracking-wide text-red-600 hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                              onClick={() => handleCancel(item.sharingCode)}
                              disabled={busy}
                            >
                              {busy ? "Cancelling..." : "Cancel"}
                            </button>
                          ) : (
                            <span className="text-xs text-[#5B6770]/70">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OutgoingRequestsPage;