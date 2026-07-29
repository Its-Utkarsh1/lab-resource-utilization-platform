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

const EquipmentUsageChart = ({ data = [] }) => {
  return (
    <div className="card shadow-sm h-100">
      <div className="card-header">
        <h5 className="mb-0">Equipment Usage</h5>
      </div>

      <div className="card-body" style={{ height: 430 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            barGap={10}
            barCategoryGap="30%"
            margin={{
              top: 20,
              right: 20,
              left: 20,
              bottom: 90,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="equipmentName"
              interval={0}
              height={80}
              tick={{
                fontSize: 12,
                fill: "#374151",
              }}
              tickFormatter={(value) =>
                value.length > 18
                  ? value.substring(0, 18) + "..."
                  : value
              }
            />

            <YAxis allowDecimals={false} />

            <Tooltip
              formatter={(value, name) => [
                value,
                name === "totalBookings"
                  ? "Bookings"
                  : "Hours Used",
              ]}
              labelFormatter={(label) => `Equipment: ${label}`}
            />

            <Legend />

            <Bar
              dataKey="totalBookings"
              name="Bookings"
              fill="#3b82f6"
              radius={[6, 6, 0, 0]}
              maxBarSize={45}
            />

            <Bar
              dataKey="totalHours"
              name="Hours Used"
              fill="#22c55e"
              radius={[6, 6, 0, 0]}
              maxBarSize={45}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EquipmentUsageChart;