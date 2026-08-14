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

const truncate = (value) => (value.length > 12 ? value.slice(0, 12) + "..." : value);

const TopEquipmentChart = ({ data = [] }) => {
    if (data.length === 0) {
        return (
            <div className="h-[350px] flex items-center justify-center text-sm text-[#5B6770]">
                No equipment booking data yet.
            </div>
        );
    }

    return (
        <div style={{ height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 40 }}>
                    <CartesianGrid stroke="#D8D3C7" strokeDasharray="3 3" vertical={false} />

                    <XAxis
                        dataKey="equipmentName"
                        tickFormatter={truncate}
                        interval={0}
                        height={50}
                        angle={-20}
                        textAnchor="end"
                        tick={axisTickStyle}
                        axisLine={{ stroke: "#D8D3C7" }}
                        tickLine={false}
                    />

                    <YAxis allowDecimals={false} tick={axisTickStyle} axisLine={{ stroke: "#D8D3C7" }} tickLine={false} width={32} />

                    <Tooltip
                        formatter={(value) => [value, "Bookings"]}
                        labelFormatter={(label) => `Equipment: ${label}`}
                        contentStyle={{
                            background: "#ffffff",
                            border: "1px solid #D8D3C7",
                            borderRadius: 4,
                            fontSize: 12,
                            fontFamily: "monospace",
                        }}
                        labelStyle={{ color: "#14181C", fontWeight: 700, marginBottom: 4 }}
                        cursor={{ fill: "#F6F5F1" }}
                    />

                    <Bar dataKey="bookingCount" name="Bookings" fill="#1F7A6C" radius={[2, 2, 0, 0]} maxBarSize={48} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TopEquipmentChart;