import React from "react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

// Same token palette as the rest of the app:
// ink #14181C · paper #F6F5F1 · steel #5B6770 · amber #E8A33D · teal #1F7A6C · line #D8D3C7

// NOTE: this component intentionally renders ONLY the chart, no card
// wrapper/title — it's used inside AnalyticsDashboard's SectionCard,
// which already provides the card chrome and "Booking Trend" heading.
// The previous version had its own .card/.card-header, which would
// have doubled up both the border and the title when nested.

const axisTickStyle = { fill: "#5B6770", fontSize: 12, fontFamily: "monospace" };

const BookingTrendChart = ({ data = [] }) => {
    if (data.length === 0) {
        return (
            <div className="h-[350px] flex items-center justify-center text-sm text-[#5B6770]">
                No booking trend data yet.
            </div>
        );
    }

    return (
        <div style={{ height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                    <CartesianGrid stroke="#D8D3C7" strokeDasharray="3 3" vertical={false} />

                    <XAxis dataKey="bookingDate" tick={axisTickStyle} axisLine={{ stroke: "#D8D3C7" }} tickLine={false} />
                    <YAxis tick={axisTickStyle} axisLine={{ stroke: "#D8D3C7" }} tickLine={false} width={36} />

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
                    />

                    <Line
                        type="monotone"
                        dataKey="bookingCount"
                        stroke="#1F7A6C"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, fill: "#1F7A6C" }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BookingTrendChart;