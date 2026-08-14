import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

// Same token palette as the rest of the app:
// ink #14181C · paper #F6F5F1 · steel #5B6770 · amber #E8A33D · teal #1F7A6C · line #D8D3C7

// NOTE: renders ONLY the chart — used inside AnalyticsDashboard's
// SectionCard, which already supplies the card chrome/title. Height
// matches MonthlyBookingChart, its row-sibling in the analytics grid.

const axisTickStyle = { fontSize: 12, fill: "#5B6770", fontFamily: "monospace" };

const truncate = (value) => (value.length > 18 ? value.substring(0, 18) + "..." : value);

const RevenueChart = ({ data = [] }) => {
  if (data.length === 0) {
    return (
      <div className="h-[350px] flex items-center justify-center text-sm text-[#5B6770]">
        No revenue data yet.
      </div>
    );
  }

  return (
    <div style={{ height: 350 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 60 }} barCategoryGap="35%">
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

          <YAxis
            domain={[0, (dataMax) => Math.ceil(dataMax * 1.1)]}
            tickFormatter={(value) => `₹${value}`}
            tick={axisTickStyle}
            axisLine={{ stroke: "#D8D3C7" }}
            tickLine={false}
            width={56}
          />

          <Tooltip
            formatter={(value) => [`₹${Number(value).toLocaleString("en-IN")}`, "Revenue"]}
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

          <Bar dataKey="revenue" name="Revenue" fill="#E8A33D" radius={[2, 2, 0, 0]} maxBarSize={48} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;