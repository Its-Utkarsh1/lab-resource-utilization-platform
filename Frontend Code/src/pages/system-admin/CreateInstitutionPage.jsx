import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateInstitution } from "../../hooks/useInstitutions";

const CreateInstitutionPage = () => {
  const navigate = useNavigate();
  const createInstitution = useCreateInstitution();

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    email: "",
    phoneNumber: "",
    website: "",
    address: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    createInstitution.mutate(formData, {
      onSuccess: () => {
        navigate("/dashboard");
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto">

      <div className="bg-white shadow rounded-xl p-8">

        <h1 className="text-3xl font-bold mb-2">
          Create Institution
        </h1>

        <p className="text-slate-500 mb-8">
          Register a new institution in the platform.
        </p>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >

          <div>
            <label className="block mb-2 font-medium">
              Institution Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Institution Code
            </label>

            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Phone Number
            </label>

            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Website
            </label>

            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Address
            </label>

            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-4">

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-lg border"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={createInstitution.isLoading}
              className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              {createInstitution.isLoading
                ? "Creating..."
                : "Create Institution"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default CreateInstitutionPage;