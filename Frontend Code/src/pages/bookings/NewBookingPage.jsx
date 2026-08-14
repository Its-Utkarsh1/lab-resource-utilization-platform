import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useEquipmentByCode } from "../../hooks/useEquipment";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import api from "../../services/api";
import { useEstimateCost } from "../../hooks/useBookings";

// Same token palette as the rest of the app:
// ink #14181C · paper #F6F5F1 · steel #5B6770 · amber #E8A33D · teal #1F7A6C · line #D8D3C7

const inputClass =
  "w-full rounded-sm border border-[#D8D3C7] p-3 text-[#14181C] focus:outline-none focus:border-[#1F7A6C] focus:ring-1 focus:ring-[#1F7A6C] transition-colors";
const labelClass = "block mb-2 font-medium text-[#14181C]";

// datetime-local wants "YYYY-MM-DDTHH:mm" — used as the `min` on the
// Start Time field so users can't book a slot in the past.
const nowLocal = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

const NewBookingPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const equipmentCode = searchParams.get("equipment");
  const labCode = searchParams.get("lab");

  const { data: equipment, isLoading, isError } = useEquipmentByCode(user?.institutionCode, labCode, equipmentCode);

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

    if (!user?.institutionCode) return toast.error("Institution Code not found.");
    if (!labCode) return toast.error("Lab Code not found.");
    if (!equipmentCode) return toast.error("Equipment Code not found.");
    if (!purpose.trim()) return toast.error("Purpose is required.");
    if (!startTime) return toast.error("Start Time is required.");
    if (!endTime) return toast.error("End Time is required.");
    if (new Date(endTime) <= new Date(startTime)) return toast.error("End Time must be after Start Time.");
    if (new Date(startTime) < new Date()) return toast.error("Start Time cannot be in the past.");
    if (equipment?.availableQuantity != null && quantity > equipment.availableQuantity) {
      return toast.error(`Only ${equipment.availableQuantity} unit(s) available.`);
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

      toast.success("Equipment booked successfully!");

      setPurpose("");
      setStartTime("");
      setEndTime("");
      setQuantity(1);
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data?.error || "Booking failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingSpinner fullScreen text="Loading equipment..." />
      </DashboardLayout>
    );
  }

  if (isError || !equipment) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto bg-white rounded-sm border border-[#D8D3C7] p-10 text-center">
          <h2 className="text-xl font-bold text-[#14181C] mb-2">Equipment not found</h2>
          <p className="text-[#5B6770]">
            {equipmentCode && labCode
              ? "This equipment couldn't be loaded. It may no longer be available."
              : "No equipment was selected. Go back and choose equipment to book."}
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto bg-white rounded-sm border border-[#D8D3C7] p-8">
        <h1 className="text-3xl font-black text-[#14181C] tracking-tight mb-8">Book Equipment</h1>

        {/* Equipment Information */}
        <div className="grid md:grid-cols-2 gap-6 mb-8 border border-[#D8D3C7] rounded-sm p-6 bg-[#F6F5F1]">
          <div className="space-y-2 text-sm">
            <p><span className="font-medium text-[#14181C]">Equipment:</span> <span className="text-[#5B6770]">{equipment.equipmentName}</span></p>
            <p><span className="font-medium text-[#14181C]">Equipment Code:</span> <span className="text-[#5B6770] font-mono">{equipment.equipmentCode}</span></p>
            <p><span className="font-medium text-[#14181C]">Lab:</span> <span className="text-[#5B6770]">{equipment.lab}</span></p>
            <p><span className="font-medium text-[#14181C]">Status:</span> <span className="text-[#5B6770]">{equipment.status}</span></p>
            <p><span className="font-medium text-[#14181C]">Available Quantity:</span> <span className="text-[#5B6770] font-mono">{equipment.availableQuantity}</span></p>
          </div>

          <div className="flex items-center justify-center">
            <div className="border border-[#1F7A6C]/30 bg-[#1F7A6C]/5 rounded-sm w-full text-center p-6">
              <p className="text-[#5B6770] font-mono text-xs tracking-widest uppercase">Price Per Hour</p>
              <h2 className="text-4xl font-mono font-bold text-[#1F7A6C] mt-3">₹{equipment.hourlyRate}</h2>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={labelClass}>Purpose</label>
            <textarea
              required
              rows={4}
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Start Time</label>
              <input
                type="datetime-local"
                required
                min={nowLocal()}
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>End Time</label>
              <input
                type="datetime-local"
                required
                min={startTime || nowLocal()}
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>
              Quantity
              {equipment.availableQuantity != null && (
                <span className="text-xs text-[#5B6770] font-normal ml-2">
                  ({equipment.availableQuantity} available)
                </span>
              )}
            </label>
            <input
              type="number"
              min="1"
              max={equipment.availableQuantity ?? undefined}
              required
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className={inputClass}
            />
          </div>

          {/* Booking Summary */}
          <div className="bg-[#F6F5F1] border border-[#D8D3C7] rounded-sm p-6">
            <h3 className="text-lg font-bold text-[#14181C] mb-4">Booking Summary</h3>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[#5B6770]">Duration</p>
                <p className="font-mono font-semibold text-[#14181C]">{estimate?.hoursUsed ?? 0} Hours</p>
              </div>
              <div>
                <p className="text-[#5B6770]">Price / Hour</p>
                <p className="font-mono font-semibold text-[#14181C]">₹{estimate?.hourlyRate ?? equipment.hourlyRate}</p>
              </div>
              <div>
                <p className="text-[#5B6770]">Quantity</p>
                <p className="font-mono font-semibold text-[#14181C]">{estimate?.quantity ?? quantity}</p>
              </div>
              <div>
                <p className="text-[#5B6770]">Estimated Amount</p>
                <p className="text-2xl font-mono font-bold text-[#1F7A6C]">₹{estimate?.totalAmount ?? 0}</p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-[#14181C] hover:bg-[#2a2f35] text-white px-6 py-3 rounded-sm font-mono text-sm uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? "Booking..." : "Book Equipment"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default NewBookingPage;