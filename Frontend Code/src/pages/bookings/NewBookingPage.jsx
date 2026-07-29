import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEquipmentByCode } from "../../hooks/useEquipment";
import DashboardLayout from "../../components/layout/DashboardLayout";
import api from "../../services/api";
import { useEstimateCost } from "../../hooks/useBookings";

const NewBookingPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const equipmentCode = searchParams.get("equipment");
  const labCode = searchParams.get("lab");

  const { data: equipment, isLoading } = useEquipmentByCode(
    user?.institutionCode,
    labCode,
    equipmentCode
  );


  const [purpose, setPurpose] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const { data: estimate } = useEstimateCost({
    institutionCode: user?.institutionCode,
    labCode,
    equipmentCode,
    quantity,
    startTime,
    endTime,
  });



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.institutionCode) {
      alert("Institution Code not found.");
      return;
    }

    if (!labCode) {
      alert("Lab Code not found.");
      return;
    }

    if (!equipmentCode) {
      alert("Equipment Code not found.");
      return;
    }

    if (!purpose.trim()) {
      alert("Purpose is required.");
      return;
    }

    if (!startTime) {
      alert("Start Time is required.");
      return;
    }

    if (!endTime) {
      alert("End Time is required.");
      return;
    }

    if (new Date(endTime) <= new Date(startTime)) {
      alert("End Time must be after Start Time.");
      return;
    }

    try {
      setSubmitting(true);

      const request = {
        institutionCode: user.institutionCode,
        labCode,
        equipmentCode,
        quantity,
        purpose,
        startTime,
        endTime,
      };

      await api.post("/bookings", request);

      alert("Equipment booked successfully!");

      setPurpose("");
      setStartTime("");
      setEndTime("");
      setQuantity(1);

    } catch (error) {
      alert(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Booking failed."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center">
          Loading...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-8">

        <h1 className="text-3xl font-bold mb-8">
          Book Equipment
        </h1>

        {/* Equipment Information */}
        <div className="grid md:grid-cols-2 gap-6 mb-8 border rounded-xl p-6 bg-slate-50">

          <div className="space-y-3">

            <p>
              <strong>Equipment:</strong> {equipment?.equipmentName}
            </p>

            <p>
              <strong>Equipment Code:</strong> {equipment?.equipmentCode}
            </p>

            <p>
              <strong>Lab:</strong> {equipment?.lab}
            </p>

            <p>
              <strong>Status:</strong> {equipment?.status}
            </p>

            <p>
              <strong>Available Quantity:</strong>{" "}
              {equipment?.availableQuantity}
            </p>

          </div>

          <div className="flex items-center justify-center">

            <div className="bg-green-100 border border-green-300 rounded-xl w-full text-center p-6">

              <p className="text-gray-600 font-medium">
                Price Per Hour
              </p>

              <h2 className="text-5xl font-bold text-green-700 mt-3">
                ₹ {equipment?.hourlyRate}
              </h2>

            </div>

          </div>

        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>

            <label className="block mb-2 font-medium">
              Purpose
            </label>

            <textarea
              required
              rows={4}
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full border rounded-lg p-3"
            />

          </div>

          <div className="grid md:grid-cols-2 gap-5">

            <div>

              <label className="block mb-2 font-medium">
                Start Time
              </label>

              <input
                type="datetime-local"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full border rounded-lg p-3"
              />

            </div>

            <div>

              <label className="block mb-2 font-medium">
                End Time
              </label>

              <input
                type="datetime-local"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full border rounded-lg p-3"
              />

            </div>

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Quantity
            </label>

            <input
              type="number"
              min="1"
              required
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full border rounded-lg p-3"
            />

          </div>

          {/* Booking Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">

            <h3 className="text-lg font-semibold mb-4">
              Booking Summary
            </h3>

            <div className="grid grid-cols-2 gap-4">

              <div>
                <p className="text-gray-600">Duration</p>
                <p className="font-semibold">
                  {estimate?.hoursUsed ?? 0} Hours
                </p>
              </div>

              <div>
                <p className="text-gray-600">Price / Hour</p>
                <p className="font-semibold">
                  ₹ {estimate?.hourlyRate ?? equipment?.hourlyRate}
                </p>
              </div>

              <div>
                <p className="text-gray-600">Quantity</p>
                <p className="font-semibold">
                  {estimate?.quantity ?? quantity}
                </p>
              </div>

              <div>
                <p className="text-gray-600">Estimated Amount</p>
                <p className="text-2xl font-bold text-green-700">
                  ₹ {estimate?.totalAmount ?? 0}
                </p>
              </div>

            </div>

          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg disabled:bg-gray-400"
          >
            {submitting ? "Booking..." : "Book Equipment"}
          </button>

        </form>

      </div>
    </DashboardLayout>
  );
};

export default NewBookingPage;