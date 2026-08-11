import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { useCreateLab } from "../../hooks/useLab";

const CreateLabPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const createLabMutation = useCreateLab();

  const [formData, setFormData] = useState({
    institutionName: user?.institutionName || "",
    institutionCode: user?.institutionCode || "",
    departmentName: user?.departmentName || "",
    managerEmail: user?.email || "",
    labName: "",
    labCode: "",
    location: "",
    userCapacity: 1,
    status: "AVAILABLE",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "userCapacity"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Request Payload:", formData);

    createLabMutation.mutate(formData, {
      onSuccess: () => {
        navigate("/labs");
      },
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow border p-8">

        <h1 className="text-3xl font-bold mb-8">
          Create Laboratory
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <div>
            <label className="block font-medium mb-2">
              Institution Name
            </label>

            <input
              type="text"
              name="institutionName"
              value={formData.institutionName}
              readOnly
              className="w-full border rounded-lg px-4 py-3 bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              Institution Code
            </label>

            <input
              type="text"
              name="institutionCode"
              value={formData.institutionCode}
              readOnly
              className="w-full border rounded-lg px-4 py-3 bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              Department
            </label>

            <input
              type="text"
              name="departmentName"
              value={formData.departmentName}
              readOnly
              className="w-full border rounded-lg px-4 py-3 bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              Lab Manager Email
            </label>

            <input
              type="email"
              name="managerEmail"
              value={formData.managerEmail}
              readOnly
              className="w-full border rounded-lg px-4 py-3 bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              Lab Name
            </label>

            <input
              type="text"
              name="labName"
              value={formData.labName}
              onChange={handleChange}
              placeholder="Programming Lab"
              required
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              Lab Code
            </label>

            <input
              type="text"
              name="labCode"
              value={formData.labCode}
              onChange={handleChange}
              placeholder="CSLAB001"
              required
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              Location
            </label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Block A - First Floor"
              required
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              User Capacity
            </label>

            <input
              type="number"
              name="userCapacity"
              value={formData.userCapacity}
              onChange={handleChange}
              min="1"
              required
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            >
              <option value="AVAILABLE">
                AVAILABLE
              </option>
              <option value="OCCUPIED">
                OCCUPIED
              </option>
              <option value="MAINTENANCE">
                MAINTENANCE
              </option>
              <option value="CLOSED">
                CLOSED
              </option>
            </select>
          </div>

          <div className="flex gap-4 pt-4">

            <button
              type="submit"
              disabled={createLabMutation.isLoading}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
            >
              {createLabMutation.isLoading
                ? "Creating..."
                : "Create Lab"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/labs")}
              className="border px-6 py-3 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>

          </div>

        </form>

      </div>
    </DashboardLayout>
  );
};

export default CreateLabPage;