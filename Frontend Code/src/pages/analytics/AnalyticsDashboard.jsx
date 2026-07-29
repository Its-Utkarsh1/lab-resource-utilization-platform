import { useAuth } from "../../context/AuthContext";
import React from "react";
import {
    useSystemAnalytics,
    useInstitutionAnalytics,
    useLabAnalytics,
    useRevenueByEquipment,
    useMonthlyBookings,
    useBookingTrend,
    useTopEquipment,
    useEquipmentUsage,
    useWaitingQueueAnalytics,
} from "../../hooks/useAnalytics";
import DashboardLayout from "../../components/layout/DashboardLayout";
import MonthlyBookingChart from "./MonthlyBookingChart";
import RevenueChart from "./RevenueChart";
import BookingTrendChart from "./BookingTrendChart";
import TopEquipmentChart from "./TopEquipmentChart";
import EquipmentUsageChart from "./EquipmentUsageChart";
import WaitingQueueChart from "./WaitingQueueChart";

/* ---------- small inline icon set (no extra dependency) ---------- */

const Icon = {
    Bookings: (props) => (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
            <path d="M3.5 9.5h17" />
            <path d="M8 3v3.2M16 3v3.2" strokeLinecap="round" />
        </svg>
    ),
    Equipment: (props) => (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path d="M14.7 3.3a1 1 0 0 1 1.4 0l4.6 4.6a1 1 0 0 1 0 1.4l-2.1 2.1-6-6z" />
            <path d="M12.6 5.4 5.2 12.8a2 2 0 0 0-.5.9L3.3 19l5.3-1.4a2 2 0 0 0 .9-.5l7.4-7.4" />
        </svg>
    ),
    Revenue: (props) => (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path d="M12 2.5v19M17 6.8c0-1.8-2-3.2-5-3.2s-5 1.4-5 3.4c0 4 10 2 10 6.2 0 2-2 3.4-5 3.4s-5-1.4-5-3.2" strokeLinecap="round" />
        </svg>
    ),
    Utilization: (props) => (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <circle cx="12" cy="12" r="8.5" />
            <path d="M12 12 12 6.8M12 12l4.2 2.4" strokeLinecap="round" />
        </svg>
    ),
    Warning: (props) => (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
            <path d="M12 3.5 21.5 20h-19z" strokeLinejoin="round" />
            <path d="M12 9.5v4.2" strokeLinecap="round" />
            <circle cx="12" cy="16.7" r="0.9" fill="currentColor" stroke="none" />
        </svg>
    ),
};

/* ---------- design tokens ---------- */

const tokens = {
    ink: "#16181d",
    sub: "#6b7280",
    line: "#e7e8ec",
    surface: "#ffffff",
    canvas: "#f6f7f9",
    accents: {
        bookings: { fg: "#2f6fed", bg: "#eaf1fe" },
        equipment: { fg: "#1a9e6f", bg: "#e7f8f1" },
        revenue: { fg: "#c46a1a", bg: "#fbf0e3" },
        utilization: { fg: "#7c4fd1", bg: "#f1ecfc" },
    },
};

const kpiCardStyle = {
    background: tokens.surface,
    border: `1px solid ${tokens.line}`,
    borderRadius: "16px",
    padding: "22px 22px 20px",
    height: "100%",
    transition: "box-shadow .18s ease, transform .18s ease",
};

const sectionCardStyle = {
    background: tokens.surface,
    border: `1px solid ${tokens.line}`,
    borderRadius: "16px",
    height: "100%",
};

const sectionHeaderStyle = {
    padding: "16px 22px",
    borderBottom: `1px solid ${tokens.line}`,
    display: "flex",
    alignItems: "center",
    gap: "10px",
};

function KpiCard({ label, value, iconKey, IconCmp }) {
    const a = tokens.accents[iconKey];
    return (
        <div
            className="kpi-card"
            style={kpiCardStyle}
        >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: tokens.sub, letterSpacing: "0.01em" }}>
                        {label}
                    </div>
                    <div style={{ fontSize: "30px", fontWeight: 700, color: tokens.ink, marginTop: "8px", lineHeight: 1 }}>
                        {value}
                    </div>
                </div>
                <div
                    style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "10px",
                        background: a.bg,
                        color: a.fg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                    }}
                >
                    <IconCmp />
                </div>
            </div>
        </div>
    );
}

function SectionCard({ title, children, accentKey = "bookings" }) {
    const a = tokens.accents[accentKey];
    return (
        <div style={sectionCardStyle}>
            <div style={sectionHeaderStyle}>
                <span style={{ width: "6px", height: "6px", borderRadius: "999px", background: a.fg }} />
                <span style={{ fontWeight: 600, fontSize: "14.5px", color: tokens.ink }}>{title}</span>
            </div>
            <div style={{ padding: "18px 20px" }}>{children}</div>
        </div>
    );
}

const AnalyticsDashboard = () => {

    const { user } = useAuth();

    const systemAnalytics = useSystemAnalytics(
        user?.role === "SYSTEM_ADMIN"
    );

    const institutionAnalytics = useInstitutionAnalytics(
        user?.role === "INSTITUTION_ADMIN"
    );

    const labAnalytics = useLabAnalytics(
        user?.role === "LAB_MANAGER"
    );

    const analytics =
        user?.role === "SYSTEM_ADMIN"
            ? systemAnalytics
            : user?.role === "INSTITUTION_ADMIN"
                ? institutionAnalytics
                : labAnalytics;

    const {
        data: dashboard,
        isLoading,
        error,
    } = analytics;
    const { data: revenueEquipment = [] } = useRevenueByEquipment();
    const { data: monthlyBookings = [] } = useMonthlyBookings();
    const { data: bookingTrend = [] } = useBookingTrend();
    const { data: topEquipment = [] } = useTopEquipment();
    const { data: equipmentUsage = [] } = useEquipmentUsage();
    const { data: waitingQueue = [] } = useWaitingQueueAnalytics();

    if (isLoading) {
        return (
            <DashboardLayout>
                <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", background: tokens.canvas }}>
                    <div style={{ textAlign: "center" }}>
                        <div
                            style={{
                                width: "34px",
                                height: "34px",
                                margin: "0 auto 14px",
                                borderRadius: "999px",
                                border: `3px solid ${tokens.line}`,
                                borderTopColor: tokens.accents.bookings.fg,
                                animation: "adash-spin .8s linear infinite",
                            }}
                        />
                        <div style={{ color: tokens.sub, fontSize: "14px", fontWeight: 500 }}>Loading analytics…</div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    console.log("Revenue", revenueEquipment);
    console.log("Monthly", monthlyBookings);
    console.log("Trend", bookingTrend);
    console.log("Equipment Usage", equipmentUsage);
    console.log("Top Equipment", topEquipment);
    console.log("Waiting Queue", waitingQueue);

    if (error) {
        return (
            <DashboardLayout>
                <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", background: tokens.canvas }}>
                    <div style={{ textAlign: "center", maxWidth: "360px" }}>
                        <div style={{ color: "#c4451c", marginBottom: "10px", display: "flex", justifyContent: "center" }}>
                            <Icon.Warning />
                        </div>
                        <div style={{ fontWeight: 600, color: tokens.ink, marginBottom: "4px" }}>
                            Couldn't load analytics
                        </div>
                        <div style={{ color: tokens.sub, fontSize: "13.5px" }}>
                            {error.response?.data || error.message}
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <style>{`
                @keyframes adash-spin { to { transform: rotate(360deg); } }
                .kpi-card:hover { box-shadow: 0 6px 20px rgba(16,20,30,0.06); transform: translateY(-1px); }
            `}</style>
            <div style={{ background: tokens.canvas, minHeight: "100vh", padding: "28px 28px 40px" }}>

                {/* Header */}
                <div style={{ marginBottom: "24px" }}>
                    <h2 style={{ fontWeight: 700, fontSize: "22px", color: tokens.ink, marginBottom: "4px" }}>
                        Analytics
                    </h2>
                    <p style={{ color: tokens.sub, fontSize: "14px", margin: 0 }}>
                        Equipment usage, bookings and revenue overview
                    </p>
                </div>



                {/* KPI Cards */}
                <div className="row g-3 mb-4">
                    <div className="col-xl-3 col-md-6">
                        <KpiCard label="Total Bookings" value={dashboard?.totalBookings ?? 0} iconKey="bookings" IconCmp={Icon.Bookings} />
                    </div>
                    <div className="col-xl-3 col-md-6">
                        <KpiCard label="Total Equipment" value={dashboard?.totalEquipment ?? 0} iconKey="equipment" IconCmp={Icon.Equipment} />
                    </div>
                    <div className="col-xl-3 col-md-6">
                        <KpiCard label="Revenue" value={`₹${dashboard?.totalRevenue ?? 0}`} iconKey="revenue" IconCmp={Icon.Revenue} />
                    </div>
                    <div className="col-xl-3 col-md-6">
                        <KpiCard label="Utilization" value={`${dashboard?.utilizationRate != null ? dashboard.utilizationRate.toFixed(2) : "0.00"}%`} iconKey="utilization" IconCmp={Icon.Utilization} />
                    </div>
                </div>

                {/* Revenue + Monthly */}
                <div className="row g-3 mb-3">
                    <div className="col-lg-6">
                        <SectionCard title="Revenue by Equipment" accentKey="revenue">
                            <RevenueChart data={revenueEquipment} />
                        </SectionCard>
                    </div>
                    <div className="col-lg-6">
                        <SectionCard title="Monthly Bookings" accentKey="bookings">
                            <MonthlyBookingChart data={monthlyBookings} />
                        </SectionCard>
                    </div>
                </div>

                {/* Booking Trend */}

                <div className="row g-4 mb-4">

                    <div className="col-lg-8">
                        <SectionCard title="Booking Trend">
                            <BookingTrendChart data={bookingTrend} />
                        </SectionCard>
                    </div>

                    <div className="col-lg-4">
                        <SectionCard title="Equipment Usage">
                            <EquipmentUsageChart data={equipmentUsage} />
                        </SectionCard>
                    </div>

                </div>

                <div className="row g-4">

                    <div className="col-lg-6">
                        <SectionCard title="Top Equipment">
                            <TopEquipmentChart data={topEquipment} />
                        </SectionCard>
                    </div>

                    <div className="col-lg-6">
                        <SectionCard title="Waiting Queue">
                            <WaitingQueueChart data={waitingQueue} />
                        </SectionCard>
                    </div>

                </div>
            </div>

        </DashboardLayout>
    );
};

export default AnalyticsDashboard;
