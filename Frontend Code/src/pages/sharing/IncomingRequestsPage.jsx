import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
    useIncomingRequests,
    useApproveSharing,
    useRejectSharing,
} from "../../hooks/useSharing";

const statusStyles = {
    PENDING: "bg-amber-50 text-amber-700",
    APPROVED: "bg-emerald-50 text-emerald-700",
    REJECTED: "bg-red-50 text-red-700",
};

const StatusBadge = ({ status }) => (
    <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            statusStyles[status] || "bg-gray-100 text-gray-600"
        }`}
    >
        {status}
    </span>
);

const IncomingRequestsPage = () => {
    const { data: requests = [], isLoading } = useIncomingRequests();

    const approveMutation = useApproveSharing();
    const rejectMutation = useRejectSharing();

    const isRowBusy = (code) =>
        (approveMutation.isLoading && approveMutation.variables === code) ||
        (rejectMutation.isLoading && rejectMutation.variables === code);

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto px-4 py-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Incoming Sharing Requests
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Review and respond to equipment requests from other
                        institutions.
                    </p>
                </div>

                {/* Content */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    {isLoading ? (
                        <div className="py-16 flex flex-col items-center justify-center text-gray-500">
                            <div className="h-8 w-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
                            <p className="text-sm">Loading requests...</p>
                        </div>
                    ) : requests.length === 0 ? (
                        <div className="py-16 flex flex-col items-center justify-center text-center px-6">
                            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                                <span className="text-gray-400 text-xl">📭</span>
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">
                                No incoming requests
                            </h3>
                            <p className="text-sm text-gray-500 mt-1 max-w-sm">
                                When another institution requests your equipment, it will
                                show up here.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                                        <th className="px-5 py-3">Sharing Code</th>
                                        <th className="px-5 py-3">Equipment</th>
                                        <th className="px-5 py-3">Requested By</th>
                                        <th className="px-5 py-3">Institution</th>
                                        <th className="px-5 py-3">Qty</th>
                                        <th className="px-5 py-3">Purpose</th>
                                        <th className="px-5 py-3">Duration</th>
                                        <th className="px-5 py-3">Status</th>
                                        <th className="px-5 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {requests.map((item) => {
                                        const busy = isRowBusy(item.sharingCode);
                                        return (
                                            <tr
                                                key={item.sharingCode}
                                                className="hover:bg-gray-50 transition-colors align-top"
                                            >
                                                <td className="px-5 py-3 font-mono text-xs text-gray-500 whitespace-nowrap">
                                                    {item.sharingCode}
                                                </td>
                                                <td className="px-5 py-3 font-medium text-gray-900">
                                                    {item.equipmentName}
                                                </td>
                                                <td className="px-5 py-3 text-gray-600">
                                                    {item.requestedBy}
                                                </td>
                                                <td className="px-5 py-3 text-gray-600">
                                                    {item.requestInstitution}
                                                </td>
                                                <td className="px-5 py-3 text-gray-600">
                                                    {item.quantity}
                                                </td>
                                                <td className="px-5 py-3 text-gray-600 max-w-[220px]">
                                                    <span className="line-clamp-2">
                                                        {item.purpose}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3 text-gray-600 whitespace-nowrap">
                                                    <div>{item.startDate}</div>
                                                    <div className="text-gray-400">
                                                        to {item.endDate}
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <StatusBadge status={item.status} />
                                                </td>
                                                <td className="px-5 py-3 text-right">
                                                    {item.status === "PENDING" ? (
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                                                                onClick={() =>
                                                                    approveMutation.mutate(
                                                                        item.sharingCode
                                                                    )
                                                                }
                                                                disabled={busy}
                                                            >
                                                                {approveMutation.isLoading &&
                                                                approveMutation.variables ===
                                                                    item.sharingCode
                                                                    ? "Approving..."
                                                                    : "Approve"}
                                                            </button>

                                                            <button
                                                                className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                                                                onClick={() =>
                                                                    rejectMutation.mutate(
                                                                        item.sharingCode
                                                                    )
                                                                }
                                                                disabled={busy}
                                                            >
                                                                {rejectMutation.isLoading &&
                                                                rejectMutation.variables ===
                                                                    item.sharingCode
                                                                    ? "Rejecting..."
                                                                    : "Reject"}
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-gray-400">
                                                            No action needed
                                                        </span>
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

export default IncomingRequestsPage;