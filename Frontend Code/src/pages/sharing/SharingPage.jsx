import React from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAvailableEquipment, useIncomingRequests, useOutgoingRequests, useSharingHistory } from "../../hooks/useSharing";

// Same token palette as the rest of the app:
// ink #14181C · paper #F6F5F1 · steel #5B6770 · amber #E8A33D · teal #1F7A6C · line #D8D3C7

const SharingPage = () => {
  // NOTE: useAvailableEquipment is called here with no arguments, but on
  // AvailableEquipmentPage it's called as
  // useAvailableEquipment(selectedInstitution, selectedDepartment) and
  // only returns results once both are set. Called with nothing, this
  // count is likely always 0 (or errors) rather than reflecting real
  // data — worth confirming against the hook's actual implementation.
  const { data: available = [] } = useAvailableEquipment();
  const { data: incoming = [] } = useIncomingRequests();
  const { data: outgoing = [] } = useOutgoingRequests();
  const { data: history = [] } = useSharingHistory();

  const cards = [
    {
      title: "Available Equipment",
      value: available.length,
      description: "View equipment from partner institutions and request sharing.",
      accent: "teal",
      path: "/sharing/available",
    },
    {
      title: "Incoming Requests",
      value: incoming.length,
      description: "Approve or reject incoming sharing requests.",
      accent: "amber",
      path: "/sharing/incoming",
    },
    {
      title: "Outgoing Requests",
      value: outgoing.length,
      description: "Monitor requests sent by your institution.",
      accent: "teal",
      path: "/sharing/outgoing",
    },
    {
      title: "History",
      value: history.length,
      description: "Review completed, rejected, and cancelled sharing requests.",
      accent: "amber",
      path: "/sharing/history",
    },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#14181C] tracking-tight">Inter-Institution Equipment Sharing</h1>
        <p className="text-[#5B6770] mt-2">Share laboratory equipment securely between institutions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link
            key={card.title}
            to={card.path}
            className="bg-white rounded-sm border border-[#D8D3C7] border-t-2 p-6 hover:border-[#D8D3C7] transition-colors"
            style={{ borderTopColor: card.accent === "amber" ? "#E8A33D" : "#1F7A6C" }}
          >
            <p
              className="text-3xl font-mono font-bold mb-3"
              style={{ color: card.accent === "amber" ? "#E8A33D" : "#1F7A6C" }}
            >
              {card.value}
            </p>
            <h3 className="text-lg font-bold text-[#14181C]">{card.title}</h3>
            <p className="text-sm text-[#5B6770] mt-2">{card.description}</p>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default SharingPage;