import React, { useMemo, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useSharingHistory } from "../../hooks/useSharing";

const statusStyles = {
    COMPLETED: "bg-emerald-50 text-emerald-700",
    REJECTED: "bg-red-50 text-red-700",
    CANCELLED: "bg-gray-100 text-gray-600",
    ACTIVE: "bg-blue-50 text-blue-700",
};

const StatusBadge = ({ status }) => (
    <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            statusStyles[status] || "bg-blue-50 text-blue-700"
        }`}
    >
        {status}
    </span>
);

const SharingHistoryPage = () => {
    const { data: history = [], isLoading } = useSharingHistory();

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const statuses = useMemo(
        () => [...new Set(history.map((h) => h.status))],
        [history]
    );

    const filteredHistory = useMemo(() => {
        const term = search.trim().toLowerCase();
        return history.filter((item) => {
            const matchesStatus = !statusFilter || item.status === statusFilter;
            const matchesSearch =
                !term ||
                item.equipmentName?.toLowerCase().includes(term) ||
                item.sharingCode?.toLowerCase().includes(term);
            return matchesStatus && matchesSearch;
        });
    }, [history, search, statusFilter]);

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto px-4 py-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Sharing History
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        A record of every completed, rejected, or cancelled sharing
                        request.
                    </p>
                </div>

                {/* Filters */}
                {!isLoading && history.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 mb-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Search
                                </label>
                                <input
                                    type="text"
                                    placeholder="Search by equipment or sharing code..."
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
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
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    {isLoading ? (
                        <div className="py-16 flex flex-col items-center justify-center text-gray-500">
                            <div className="h-8 w-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
                            <p className="text-sm">Loading history...</p>
                        </div>
                    ) : history.length === 0 ? (
                        <div className="py-16 flex flex-col items-center justify-center text-center px-6">
                            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                                <span className="text-gray-400 text-xl">🗂️</span>
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">
                                No sharing history
                            </h3>
                            <p className="text-sm text-gray-500 mt-1 max-w-sm">
                                Past sharing requests will appear here once they've been
                                completed, rejected, or cancelled.
                            </p>
                        </div>
                    ) : filteredHistory.length === 0 ? (
                        <div className="py-16 flex flex-col items-center justify-center text-center px-6">
                            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                                <span className="text-gray-400 text-xl">🔍</span>
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">
                                No matching records
                            </h3>
                            <p className="text-sm text-gray-500 mt-1 max-w-sm">
                                Try a different search term or status filter.
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
                                        <th className="px-5 py-3">Request Institution</th>
                                        <th className="px-5 py-3">Requested By</th>
                                        <th className="px-5 py-3">Qty</th>
                                        <th className="px-5 py-3">Duration</th>
                                        <th className="px-5 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredHistory.map((item) => (
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
                                                {item.requestInstitution}
                                            </td>
                                            <td className="px-5 py-3 text-gray-600">
                                                {item.requestedBy}
                                            </td>
                                            <td className="px-5 py-3 text-gray-600">
                                                {item.quantity}
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