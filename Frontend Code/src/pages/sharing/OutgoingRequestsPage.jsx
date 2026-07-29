import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
    useOutgoingRequests,
    useCancelSharing,
} from "../../hooks/useSharing";

const statusStyles = {
    PENDING: "bg-amber-50 text-amber-700",
    APPROVED: "bg-emerald-50 text-emerald-700",
    REJECTED: "bg-red-50 text-red-700",
    ACTIVE: "bg-blue-50 text-blue-700",
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

const OutgoingRequestsPage = () => {
    const { data: requests = [], isLoading } = useOutgoingRequests();

    const cancelMutation = useCancelSharing();

    const isRowBusy = (code) =>
        cancelMutation.isLoading && cancelMutation.variables === code;

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto px-4 py-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Outgoing Sharing Requests
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Track equipment you've requested from other institutions.
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
                                <span className="text-gray-400 text-xl">📤</span>
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">
                                No outgoing requests
                            </h3>
                            <p className="text-sm text-gray-500 mt-1 max-w-sm">
                                Requests you send for equipment from other institutions
                                will show up here.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                                        <th className="px-5 py-3">Sharing Code</th>
                                        <th className="px-5 py-3">Equipment</th>
                                        <th className="px-5 py-3">Owner Institution</th>
                                        <th className="px-5 py-3">Qty</th>
                                        <th className="px-5 py-3">Purpose</th>
                                        <th className="px-5 py-3">Duration</th>
                                        <th className="px-5 py-3">Status</th>
                                        <th className="px-5 py-3 text-right">Action</th>
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
                                                    {item.ownerInstitution}
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
                                                        <button
                                                            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                                                            onClick={() =>
                                                                cancelMutation.mutate(
                                                                    item.sharingCode
                                                                )
                                                            }
                                                            disabled={busy}
                                                        >
                                                            {busy ? "Cancelling..." : "Cancel"}
                                                        </button>
                                                    ) : (
                                                        <span className="text-xs text-gray-400">
                                                            —
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

export default OutgoingRequestsPage;