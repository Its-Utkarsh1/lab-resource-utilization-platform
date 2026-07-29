import React from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  useAvailableEquipment,
  useIncomingRequests,
  useOutgoingRequests,
  useSharingHistory,
} from "../../hooks/useSharing";

const SharingPage = () => {
  const { data: available = [] } = useAvailableEquipment();
  const { data: incoming = [] } = useIncomingRequests();
  const { data: outgoing = [] } = useOutgoingRequests();
  const { data: history = [] } = useSharingHistory();

  console.log("Available Equipment:", available);
  console.log("Incoming Requests:", incoming);
  console.log("Outgoing Requests:", outgoing);
  console.log("History:", history);

  const cards = [
    {
      title: "Available Equipment",
      value: available.length,
      description: "Equipment available from other institutions",
      color: "bg-blue-500",
      path: "/sharing/available",
    },
    {
      title: "Incoming Requests",
      value: incoming.length,
      description: "Requests awaiting your approval",
      color: "bg-amber-500",
      path: "/sharing/incoming",
    },
    {
      title: "Outgoing Requests",
      value: outgoing.length,
      description: "Requests sent by your institution",
      color: "bg-green-500",
      path: "/sharing/outgoing",
    },
    {
      title: "History",
      value: history.length,
      description: "Completed and cancelled requests",
      color: "bg-purple-500",
      path: "/sharing/history",
    },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Inter-Institution Equipment Sharing
        </h1>

        <p className="text-slate-600 mt-2">
          Share laboratory equipment securely between institutions.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => (
          <Link
            key={card.title}
            to={card.path}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition"
          >
            <div
              className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center text-white text-xl font-bold mb-4`}
            >
              {card.value}
            </div>

            <h3 className="text-lg font-semibold text-slate-900">
              {card.title}
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              {card.description}
            </p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-semibold mb-5">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <Link
            to="/sharing/available"
            className="border rounded-lg p-4 hover:bg-slate-50"
          >
            <h3 className="font-semibold text-slate-900">
              Browse Equipment
            </h3>

            <p className="text-sm text-slate-600 mt-1">
              View equipment from partner institutions and request sharing.
            </p>
          </Link>

          <Link
            to="/sharing/incoming"
            className="border rounded-lg p-4 hover:bg-slate-50"
          >
            <h3 className="font-semibold text-slate-900">
              Review Requests
            </h3>

            <p className="text-sm text-slate-600 mt-1">
              Approve or reject incoming sharing requests.
            </p>
          </Link>

          <Link
            to="/sharing/outgoing"
            className="border rounded-lg p-4 hover:bg-slate-50"
          >
            <h3 className="font-semibold text-slate-900">
              Track Requests
            </h3>

            <p className="text-sm text-slate-600 mt-1">
              Monitor requests sent by your institution.
            </p>
          </Link>

          <Link
            to="/sharing/history"
            className="border rounded-lg p-4 hover:bg-slate-50"
          >
            <h3 className="font-semibold text-slate-900">
              View History
            </h3>

            <p className="text-sm text-slate-600 mt-1">
              Review completed, rejected, and cancelled sharing requests.
            </p>
          </Link>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default SharingPage;