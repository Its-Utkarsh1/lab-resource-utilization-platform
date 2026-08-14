import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// Same token palette as the rest of the app:
// ink #14181C · paper #F6F5F1 · steel #5B6770 · amber #E8A33D · teal #1F7A6C · line #D8D3C7

// NOTE: renders ONLY the chart — used inside AnalyticsDashboard's
// SectionCard, which already supplies the card chrome/title. Height is
// 350 to match BookingTrendChart, its row-sibling in the analytics grid.

const axisTickStyle = { fontSize: 12, fill: "#5B6770", fontFamily: "monospace" };

const truncate = (value) => (value.length > 18 ? value.substring(0, 18) + "..." : value);

const EquipmentUsageChart = ({ data = [] }) => {
  if (data.length === 0) {
    return (
      <div className="h-[350px] flex items-center justify-center text-sm text-[#5B6770]">
        No equipment usage data yet.
      </div>
    );
  }

  return (
    <div style={{ height: 350 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          barGap={8}
          barCategoryGap="30%"
          margin={{ top: 8, right: 8, left: 0, bottom: 60 }}
        >
          <CartesianGrid stroke="#D8D3C7" strokeDasharray="3 3" vertical={false} />

          <XAxis
            dataKey="equipmentName"
            interval={0}
            height={60}
            angle={-30}
            textAnchor="end"
            tick={axisTickStyle}
            axisLine={{ stroke: "#D8D3C7" }}
            tickLine={false}
            tickFormatter={truncate}
          />

          <YAxis allowDecimals={false} tick={axisTickStyle} axisLine={{ stroke: "#D8D3C7" }} tickLine={false} width={32} />

          <Tooltip
            formatter={(value, name) => [value, name === "totalBookings" ? "Bookings" : "Hours Used"]}
            labelFormatter={(label) => `Equipment: ${label}`}
            contentStyle={{
              background: "#ffffff",
              border: "1px solid #D8D3C7",
              borderRadius: 4,
              fontSize: 12,
              fontFamily: "monospace",
            }}
            labelStyle={{ color: "#14181C", fontWeight: 700, marginBottom: 4 }}
          />

          <Legend wrapperStyle={{ fontSize: 12, fontFamily: "monospace", color: "#5B6770" }} />

          <Bar dataKey="totalBookings" name="Bookings" fill="#1F7A6C" radius={[2, 2, 0, 0]} maxBarSize={36} />
          <Bar dataKey="totalHours" name="Hours Used" fill="#E8A33D" radius={[2, 2, 0, 0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EquipmentUsageChart;