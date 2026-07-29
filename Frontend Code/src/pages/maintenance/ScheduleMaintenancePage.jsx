import { useState } from "react";
import {
    useNavigate,
    useSearchParams,
} from "react-router-dom";
import { useLabTechnicians } from "../../hooks/useUsers";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useCreateMaintenance } from "../../hooks/useMaintenance";

const ScheduleMaintenancePage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const equipmentCode = searchParams.get("equipment");
    const labCode = searchParams.get("lab");

    const createMaintenance = useCreateMaintenance();
    const { data: technicians = [] } = useLabTechnicians();

    const maintenanceTypes = [
        {
            value: "PREVENTIVE",
            label: "Preventive",
        },
        {
            value: "CORRECTIVE",
            label: "Repair",
        },
        {
            value: "CALIBRATION",
            label: "Calibration",
        },
    ];

    const [form, setForm] = useState({
        equipmentCode: equipmentCode || "",
        labCode: labCode || "",
        maintenanceType: "",
        scheduledDate: "",
        technicianEmail: "",
        description: "",
    });

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        createMaintenance.mutate(form, {
            onSuccess: () => {
                navigate(
                    `/equipment/${equipmentCode}?lab=${labCode}`,
                    {
                        replace: true,
                    }
                );
            },
        });
    };

    return (
        <DashboardLayout>
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-8">
                <h1 className="text-3xl font-bold mb-8">
                    Schedule Maintenance
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    <div>
                        <label className="block mb-2 font-medium">
                            Equipment Code
                        </label>

                        <input
                            type="text"
                            value={form.equipmentCode}
                            readOnly
                            className="w-full border rounded-lg p-3 bg-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">
                            Maintenance Type
                        </label>

                        <select
                            name="maintenanceType"
                            value={form.maintenanceType}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-lg p-3"
                        >
                            <option value="">
                                Select Maintenance Type
                            </option>

                            {maintenanceTypes.map((type) => (
                                <option
                                    key={type.value}
                                    value={type.value}
                                >
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">
                            Scheduled Date
                        </label>

                        <input
                            type="date"
                            name="scheduledDate"
                            value={form.scheduledDate}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-lg p-3"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">
                            Technician
                        </label>

                        <select
                            name="technicianEmail"
                            value={form.technicianEmail}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-lg p-3"
                        >
                            <option value="">
                                Select Technician
                            </option>

                            {technicians.map((technician) => (
                                <option
                                    key={technician.id}
                                    value={technician.email}
                                >
                                    {technician.fullName} ({technician.email})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">
                            Description
                        </label>

                        <textarea
                            rows={4}
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-lg p-3"
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-6 py-3 border rounded-lg hover:bg-gray-100"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={createMaintenance.isLoading}
                            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg disabled:bg-gray-400"
                        >
                            {createMaintenance.isLoading
                                ? "Scheduling..."
                                : "Schedule Maintenance"}
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default ScheduleMaintenancePage;