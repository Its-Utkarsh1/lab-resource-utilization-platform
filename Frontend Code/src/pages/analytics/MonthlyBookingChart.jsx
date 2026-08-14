import React from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

// Same token palette as the rest of the app:
// ink #14181C · paper #F6F5F1 · steel #5B6770 · amber #E8A33D · teal #1F7A6C · line #D8D3C7

// NOTE: renders ONLY the chart — used inside AnalyticsDashboard's
// SectionCard, which already supplies the card chrome/title.

const axisTickStyle = { fontSize: 12, fill: "#5B6770", fontFamily: "monospace" };

const MonthlyBookingChart = ({ data = [] }) => {
    if (data.length === 0) {
        return (
            <div className="h-[350px] flex items-center justify-center text-sm text-[#5B6770]">
                No monthly booking data yet.
            </div>
        );
    }

    return (
        <div style={{ height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke="#D8D3C7" strokeDasharray="3 3" vertical={false} />

                    <XAxis dataKey="month" tick={axisTickStyle} axisLine={{ stroke: "#D8D3C7" }} tickLine={false} />
                    <YAxis allowDecimals={false} tick={axisTickStyle} axisLine={{ stroke: "#D8D3C7" }} tickLine={false} width={32} />

                    <Tooltip
                        contentStyle={{
                            background: "#ffffff",
                            border: "1px solid #D8D3C7",
                            borderRadius: 4,
                            fontSize: 12,
                            fontFamily: "monospace",
                        }}
                        labelStyle={{ color: "#14181C", fontWeight: 700, marginBottom: 4 }}
                        itemStyle={{ color: "#1F7A6C" }}
                        cursor={{ fill: "#F6F5F1" }}
                    />

                    <Bar dataKey="totalBookings" fill="#1F7A6C" radius={[2, 2, 0, 0]} maxBarSize={48} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MonthlyBookingChart;