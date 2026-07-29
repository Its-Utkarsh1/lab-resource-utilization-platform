import React from "react";

const colors = {
  AVAILABLE: "bg-green-100 text-green-700",
  APPROVED: "bg-green-100 text-green-700",

  PENDING: "bg-yellow-100 text-yellow-700",

  REJECTED: "bg-red-100 text-red-700",

  MAINTENANCE: "bg-orange-100 text-orange-700",

  BOOKED: "bg-blue-100 text-blue-700",

  ACTIVE: "bg-indigo-100 text-indigo-700",

  COMPLETED: "bg-emerald-100 text-emerald-700",

  DEFAULT: "bg-gray-100 text-gray-700",
};

const StatusBadge = ({ status }) => {
  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        colors[status] || colors.DEFAULT
      }`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;