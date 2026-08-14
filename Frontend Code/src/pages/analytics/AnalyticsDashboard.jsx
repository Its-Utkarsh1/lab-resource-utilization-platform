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
import LoadingSpinner from "../../components/common/LoadingSpinner";
import StatCard from "../../components/common/StatCard";
import MonthlyBookingChart from "./MonthlyBookingChart";
import RevenueChart from "./RevenueChart";
import BookingTrendChart from "./BookingTrendChart";
import TopEquipmentChart from "./TopEquipmentChart";
import EquipmentUsageChart from "./EquipmentUsageChart";
import WaitingQueueChart from "./WaitingQueueChart";

// Same token palette as the rest of the app:
// ink #14181C · paper #F6F5F1 · steel #5B6770 · amber #E8A33D · teal #1F7A6C · line #D8D3C7

const SUPPORTED_ROLES = ["SYSTEM_ADMIN", "INSTITUTION_ADMIN", "LAB_MANAGER"];

const SectionCard = ({ title, accent = "teal", children }) => (
    <div className="bg-white rounded-sm border border-[#D8D3C7] h-full">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-[#D8D3C7]">
            <span className={`w-1.5 h-1.5 rounded-full ${accent === "amber" ? "bg-[#E8A33D]" : "bg-[#1F7A6C]"}`} />
            <span className="font-bold text-sm text-[#14181C]">{title}</span>
        </div>
        <div className="p-5">{children}</div>
    </div>
);

const AnalyticsDashboard = () => {
    const { user } = useAuth();

    const systemAnalytics = useSystemAnalytics(user?.role === "SYSTEM_ADMIN");
    const institutionAnalytics = useInstitutionAnalytics(user?.role === "INSTITUTION_ADMIN");
    const labAnalytics = useLabAnalytics(user?.role === "LAB_MANAGER");

    const roleSupported = SUPPORTED_ROLES.includes(user?.role);

    const analytics =
        user?.role === "SYSTEM_ADMIN"
            ? systemAnalytics
            : user?.role === "INSTITUTION_ADMIN"
                ? institutionAnalytics
                : user?.role === "LAB_MANAGER"
                    ? labAnalytics
                    : { data: undefined, isLoading: false, error: null };

    const { data: dashboard, isLoading, error } = analytics;
    const { data: revenueEquipment = [] } = useRevenueByEquipment();
    const { data: monthlyBookings = [] } = useMonthlyBookings();
    const { data: bookingTrend = [] } = useBookingTrend();
    const { data: topEquipment = [] } = useTopEquipment();
    const { data: equipmentUsage = [] } = useEquipmentUsage();
    const { data: waitingQueue = [] } = useWaitingQueueAnalytics();

    if (!roleSupported) {
        return (
            <DashboardLayout>
                <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
                    <div className="w-12 h-12 rounded-sm border border-[#D8D3C7] flex items-center justify-center mb-4">
                        <span className="font-mono text-lg text-[#5B6770]">i</span>
                    </div>
                    <h2 className="text-xl font-bold text-[#14181C] mb-2">Analytics not available</h2>
                    <p className="text-sm text-[#5B6770] max-w-sm">
                        Analytics for your role ("{user?.role?.replaceAll("_", " ")}") isn't set up yet. Check back
                        soon, or contact your system admin.
                    </p>
                </div>
            </DashboardLayout>
        );
    }

    if (isLoading) {
        return (
            <DashboardLayout>
                <LoadingSpinner fullScreen text="Loading analytics..." />
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
                    <div className="w-12 h-12 rounded-sm border border-red-200 bg-red-50 flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                        </svg>
                    </div>
                    <h2 className="text-lg font-bold text-[#14181C] mb-1">Couldn't load analytics</h2>
                    <p className="text-sm text-[#5B6770] max-w-sm">{error.response?.data || error.message}</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-black text-[#14181C] tracking-tight">Analytics</h1>
                <p className="text-[#5B6770] mt-1">Equipment usage, bookings and revenue overview</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                <StatCard title="Total Bookings" value={dashboard?.totalBookings ?? 0} color="teal" />
                <StatCard title="Total Equipment" value={dashboard?.totalEquipment ?? 0} color="amber" />
                <StatCard title="Revenue" value={`₹${dashboard?.totalRevenue ?? 0}`} color="teal" />
                <StatCard
                    title="Utilization"
                    value={`${dashboard?.utilizationRate != null ? dashboard.utilizationRate.toFixed(2) : "0.00"}%`}
                    color="amber"
                />
            </div>

            {/* Revenue + Monthly */}
            <div className="grid lg:grid-cols-2 gap-4 mb-4">
                <SectionCard title="Revenue by Equipment" accent="amber">
                    <RevenueChart data={revenueEquipment} />
                </SectionCard>
                <SectionCard title="Monthly Bookings" accent="teal">
                    <MonthlyBookingChart data={monthlyBookings} />
                </SectionCard>
            </div>

            {/* Booking Trend */}
            <div className="grid lg:grid-cols-3 gap-4 mb-4">
                <div className="lg:col-span-2">
                    <SectionCard title="Booking Trend">
                        <BookingTrendChart data={bookingTrend} />
                    </SectionCard>
                </div>
                <div>
                    <SectionCard title="Equipment Usage" accent="amber">
                        <EquipmentUsageChart data={equipmentUsage} />
                    </SectionCard>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
                <SectionCard title="Top Equipment">
                    <TopEquipmentChart data={topEquipment} />
                </SectionCard>
                <SectionCard title="Waiting Queue" accent="amber">
                    <WaitingQueueChart data={waitingQueue} />
                </SectionCard>
            </div>
        </DashboardLayout>
    );
};

export default AnalyticsDashboard;