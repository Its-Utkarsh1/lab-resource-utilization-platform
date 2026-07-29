import React from "react";
import { useMyInvoices } from "../../hooks/useInvoice";

import DashboardLayout from "../../components/layout/DashboardLayout";

/* ---------- design tokens (matches AnalyticsDashboard) ---------- */

const tokens = {
    ink: "#16181d",
    sub: "#6b7280",
    line: "#e7e8ec",
    surface: "#ffffff",
    canvas: "#f6f7f9",
};

const statusStyles = {
    PAID: { fg: "#1a9e6f", bg: "#e7f8f1" },
    PENDING: { fg: "#c46a1a", bg: "#fbf0e3" },
    FAILED: { fg: "#c4451c", bg: "#fbe9e5" },
    OVERDUE: { fg: "#c4451c", bg: "#fbe9e5" },
    REFUNDED: { fg: "#7c4fd1", bg: "#f1ecfc" },
};

function StatusBadge({ status }) {
    const s = statusStyles[status?.toUpperCase()] || { fg: tokens.sub, bg: "#eef0f2" };
    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "12.5px",
                fontWeight: 600,
                color: s.fg,
                background: s.bg,
                padding: "4px 10px",
                borderRadius: "999px",
            }}
        >
            <span style={{ width: "6px", height: "6px", borderRadius: "999px", background: s.fg }} />
            {status}
        </span>
    );
}

function Icon({ children }) {
    return (
        <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="1.6">
            {children}
        </svg>
    );
}

const InvoiceListPage = () => {
    const { data = [], isLoading } = useMyInvoices();

    return (
        <DashboardLayout>
            <style>{`
                @keyframes inv-spin { to { transform: rotate(360deg); } }
                .invoice-row:hover { background: #fafbfc; }
                .invoice-table th, .invoice-table td { vertical-align: middle; }
            `}</style>
            <div style={{ background: tokens.canvas, minHeight: "100vh", padding: "28px 28px 40px" }}>

                <div style={{ marginBottom: "22px" }}>
                    <h2 style={{ fontWeight: 700, fontSize: "22px", color: tokens.ink, marginBottom: "4px" }}>
                        My Invoices
                    </h2>
                    <p style={{ color: tokens.sub, fontSize: "14px", margin: 0 }}>
                        {isLoading ? "Fetching your billing history…" : `${data.length} invoice${data.length === 1 ? "" : "s"} on record`}
                    </p>
                </div>

                <div
                    style={{
                        background: tokens.surface,
                        border: `1px solid ${tokens.line}`,
                        borderRadius: "16px",
                        overflow: "hidden",
                    }}
                >
                    {isLoading ? (
                        <div style={{ padding: "60px 20px", textAlign: "center" }}>
                            <div
                                style={{
                                    width: "30px",
                                    height: "30px",
                                    margin: "0 auto 14px",
                                    borderRadius: "999px",
                                    border: `3px solid ${tokens.line}`,
                                    borderTopColor: "#2f6fed",
                                    animation: "inv-spin .8s linear infinite",
                                }}
                            />
                            <div style={{ color: tokens.sub, fontSize: "14px", fontWeight: 500 }}>Loading invoices…</div>
                        </div>
                    ) : data.length === 0 ? (
                        <div style={{ padding: "70px 20px", textAlign: "center" }}>
                            <div style={{ color: "#9aa1ac", display: "flex", justifyContent: "center", marginBottom: "12px" }}>
                                <Icon>
                                    <rect x="4" y="5" width="16" height="15" rx="2.5" />
                                    <path d="M8 10.5h8M8 14h5" strokeLinecap="round" />
                                </Icon>
                            </div>
                            <div style={{ fontWeight: 600, color: tokens.ink, marginBottom: "4px" }}>
                                No invoices yet
                            </div>
                            <div style={{ color: tokens.sub, fontSize: "13.5px" }}>
                                Invoices will appear here once you have a completed booking.
                            </div>
                        </div>
                    ) : (
                        <div style={{ overflowX: "auto" }}>
                            <table className="invoice-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                                <thead>
                                    <tr style={{ borderBottom: `1px solid ${tokens.line}` }}>
                                        {["Booking", "Equipment", "Amount", "Status", "Date"].map((h) => (
                                            <th
                                                key={h}
                                                style={{
                                                    textAlign: "left",
                                                    padding: "13px 20px",
                                                    fontSize: "12px",
                                                    fontWeight: 600,
                                                    letterSpacing: "0.04em",
                                                    textTransform: "uppercase",
                                                    color: tokens.sub,
                                                }}
                                            >
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((invoice) => (
                                        <tr
                                            key={invoice.invoiceId}
                                            className="invoice-row"
                                            style={{ borderBottom: `1px solid ${tokens.line}`, transition: "background .12s ease" }}
                                        >
                                            <td style={{ padding: "14px 20px", fontWeight: 600, color: tokens.ink }}>
                                                {invoice.bookingCode}
                                            </td>
                                            <td style={{ padding: "14px 20px", color: tokens.ink }}>
                                                {invoice.equipmentName}
                                            </td>
                                            <td style={{ padding: "14px 20px", fontWeight: 600, color: tokens.ink }}>
                                                ₹{invoice.amount}
                                            </td>
                                            <td style={{ padding: "14px 20px" }}>
                                                <StatusBadge status={invoice.paymentStatus} />
                                            </td>
                                            <td style={{ padding: "14px 20px", color: tokens.sub }}>
                                                {invoice.invoiceDate}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default InvoiceListPage;
