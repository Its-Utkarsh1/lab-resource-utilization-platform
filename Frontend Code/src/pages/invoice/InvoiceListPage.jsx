import React from "react";
import { useMyInvoices } from "../../hooks/useInvoice";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import StatusBadge from "../../components/common/StatusBadge";

// Same token palette as the rest of the app:
// ink #14181C · paper #F6F5F1 · steel #5B6770 · amber #E8A33D · teal #1F7A6C · line #D8D3C7

const InvoiceListPage = () => {
  const { data = [], isLoading, error } = useMyInvoices();

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-black text-[#14181C] tracking-tight">My Invoices</h1>
        <p className="text-[#5B6770] mt-1">
          {isLoading
            ? "Fetching your billing history..."
            : `${data.length} invoice${data.length === 1 ? "" : "s"} on record`}
        </p>
      </div>

      <div className="bg-white rounded-sm border border-[#D8D3C7] overflow-hidden">
        {isLoading ? (
          <LoadingSpinner text="Loading invoices..." />
        ) : error ? (
          <div className="p-16 text-center">
            <p className="font-bold text-[#14181C] mb-1">Couldn't load invoices</p>
            <p className="text-sm text-[#5B6770]">
              {error.response?.data?.message || error.message || "Something went wrong. Try refreshing the page."}
            </p>
          </div>
        ) : data.length === 0 ? (
          <EmptyState
            icon="🧾"
            title="No invoices yet"
            description="Invoices will appear here once you have a completed booking."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F6F5F1] border-b border-[#D8D3C7]">
                <tr>
                  {["Booking", "Equipment", "Amount", "Status", "Date"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 font-mono text-xs tracking-widest text-[#5B6770] uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8D3C7]">
                {data.map((invoice) => (
                  <tr key={invoice.invoiceId} className="hover:bg-[#F6F5F1]">
                    <td className="px-5 py-3.5 font-mono text-xs text-[#14181C] font-semibold">{invoice.bookingCode}</td>
                    <td className="px-5 py-3.5 text-[#14181C]">{invoice.equipmentName}</td>
                    <td className="px-5 py-3.5 font-mono font-semibold text-[#14181C]">
                      ₹{Number(invoice.amount).toLocaleString("en-IN")}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={invoice.paymentStatus} />
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-[#5B6770]">{invoice.invoiceDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default InvoiceListPage;