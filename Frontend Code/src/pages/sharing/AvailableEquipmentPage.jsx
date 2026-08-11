import React, { useMemo, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
    useAvailableEquipment,
    useAvailableInstitutions,
    useDepartments,
    useRequestEquipment,
} from "../../hooks/useSharing";

const emptyForm = {
    quantity: 1,
    purpose: "",
    startDate: "",
    endDate: "",
    remarks: "",
};

const AvailableEquipmentPage = () => {

    const [selectedInstitution, setSelectedInstitution] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [search, setSearch] = useState("");
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    const [formData, setFormData] = useState(emptyForm);
    const [formError, setFormError] = useState("");

    const {
        data: institutions = [],
        isLoading: institutionsLoading,
    } = useAvailableInstitutions();

    console.log("Institutions:", institutions);

    const { data: departments = [] } =
        useDepartments(selectedInstitution);

    const { data: equipment = [], isLoading } =
        useAvailableEquipment(
            selectedInstitution,
            selectedDepartment
        );

    const requestMutation = useRequestEquipment();

    const filteredEquipment = useMemo(() => {
        return equipment.filter((e) =>
            e.equipmentName
                .toLowerCase()
                .includes(search.trim().toLowerCase())
        );
    }, [equipment, search]);

    const openRequestModal = (item) => {
        setSelectedEquipment(item);
        setFormData(emptyForm);
        setFormError("");
    };

    const closeRequestModal = () => {
        setSelectedEquipment(null);
        setFormData(emptyForm);
        setFormError("");
    };

    const updateField = (field) => (e) =>
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormError("");

        if (!formData.startDate || !formData.endDate) {
            setFormError("Please select both a start and end date.");
            return;
        }
        if (new Date(formData.endDate) < new Date(formData.startDate)) {
            setFormError("End date cannot be before the start date.");
            return;
        }
        if (!formData.purpose.trim()) {
            setFormError("Please describe the purpose of this request.");
            return;
        }

        requestMutation.mutate(
            {
                equipmentCode: selectedEquipment.equipmentCode,
                ...formData,
                quantity: Number(formData.quantity),
            },
            {
                onSuccess: closeRequestModal,
                onError: (err) =>
                    setFormError(
                        err?.message || "Something went wrong. Please try again."
                    ),
            }
        );
    };

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto px-4 py-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Available Equipment
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Browse equipment shared by other institutions and submit a
                        request to borrow it.
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 mb-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Institution
                            </label>
                            <select
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                value={selectedInstitution}
                                onChange={(e) => {
                                    setSelectedInstitution(e.target.value);
                                    setSelectedDepartment("");
                                }}
                            >
                                <option value="">Select an institution</option>
                                {institutions.map((institution) => (
                                    <option
                                        key={institution.code}
                                        value={institution.code}
                                    >
                                        {institution.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Department
                            </label>

                            <select
                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                value={selectedDepartment}
                                onChange={(e) => setSelectedDepartment(e.target.value)}
                                disabled={!selectedInstitution}                            >
                                <option value="">Select Department</option>

                                {departments.map((department) => (
                                    <option
                                        key={department.name}
                                        value={department.name}
                                    >
                                        {department.name}
                                    </option>
                                ))}
                            </select>
                        </div>


                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Search equipment
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Centrifuge, Microscope..."
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-400"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                disabled={!selectedInstitution}
                            />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    {isLoading ? (
                        <div className="py-16 flex flex-col items-center justify-center text-gray-500">
                            <div className="h-8 w-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
                            <p className="text-sm">Loading equipment...</p>
                        </div>
                    ) : !selectedInstitution || !selectedDepartment ? (
                        <div className="py-16 flex flex-col items-center justify-center text-center px-6">
                            <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
                                <span className="text-emerald-600 text-xl">🏛️</span>
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">
                                Select Institution and Department
                            </h3>

                            <p className="text-sm text-gray-500 mt-1 max-w-sm">
                                Select an institution and then a department to view available equipment.
                            </p>
                        </div>
                    ) : filteredEquipment.length === 0 ? (
                        <div className="py-16 flex flex-col items-center justify-center text-center px-6">
                            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                                <span className="text-gray-400 text-xl">🔍</span>
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">
                                No equipment found
                            </h3>
                            <p className="text-sm text-gray-500 mt-1 max-w-sm">
                                {search
                                    ? `No equipment matches "${search}" at this institution.`
                                    : "This institution has no equipment listed as available right now."}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                                        <th className="px-5 py-3">Code</th>
                                        <th className="px-5 py-3">Equipment</th>
                                        <th className="px-5 py-3">Institution</th>
                                        <th className="px-5 py-3">Available Qty</th>
                                        <th className="px-5 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredEquipment.map((item) => (
                                        <tr
                                            key={item.equipmentCode}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-5 py-3 font-mono text-xs text-gray-500">
                                                {item.equipmentCode}
                                            </td>
                                            <td className="px-5 py-3 font-medium text-gray-900">
                                                {item.equipmentName}
                                            </td>
                                            <td className="px-5 py-3 text-gray-600">
                                                {item.ownerInstitution}
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                                                    {item.quantity} available
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-right">
                                                <button
                                                    className="inline-flex items-center rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 transition-colors"
                                                    onClick={() => openRequestModal(item)}
                                                >
                                                    Request
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Request Modal */}
            {selectedEquipment && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
                    onClick={closeRequestModal}
                >
                    <div
                        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <form onSubmit={handleSubmit}>
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                <div>
                                    <h2 className="text-base font-semibold text-gray-900">
                                        Request Equipment
                                    </h2>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {selectedEquipment.equipmentName} ·{" "}
                                        {selectedEquipment.ownerInstitution}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={closeRequestModal}
                                    className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                                    aria-label="Close"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
                                {formError && (
                                    <div className="rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-sm text-red-700">
                                        {formError}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Quantity
                                        <span className="text-gray-400 font-normal">
                                            {" "}
                                            (max {selectedEquipment.quantity})
                                        </span>
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max={selectedEquipment.quantity}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        value={formData.quantity}
                                        onChange={updateField("quantity")}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Purpose
                                    </label>
                                    <textarea
                                        rows={2}
                                        placeholder="What will this be used for?"
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        value={formData.purpose}
                                        onChange={updateField("purpose")}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            value={formData.startDate}
                                            onChange={updateField("startDate")}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            End Date
                                        </label>
                                        <input
                                            type="date"
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            value={formData.endDate}
                                            onChange={updateField("endDate")}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Remarks{" "}
                                        <span className="text-gray-400 font-normal">
                                            (optional)
                                        </span>
                                    </label>
                                    <textarea
                                        rows={2}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        value={formData.remarks}
                                        onChange={updateField("remarks")}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50">
                                <button
                                    type="button"
                                    className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                                    onClick={closeRequestModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={requestMutation.isLoading}
                                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                                >
                                    {requestMutation.isLoading
                                        ? "Submitting..."
                                        : "Submit Request"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default AvailableEquipmentPage;
