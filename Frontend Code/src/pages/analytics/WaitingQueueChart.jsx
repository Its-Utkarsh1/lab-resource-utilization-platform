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

const WaitingQueueChart = ({ data = [] }) => {
  if (data.length === 0) {
    return (
      <div className="card shadow-sm">
        <div className="card-header">
          <h5 className="mb-0">Waiting Queue Analytics</h5>
        </div>

        <div
          className="card-body d-flex justify-content-center align-items-center"
          style={{ height: 350 }}
        >
          <div className="text-center text-muted">
            <h6>No Waiting Queue</h6>
            <p className="mb-0">
              No users are currently waiting for equipment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm">
      <div className="card-header">
        <h5 className="mb-0">Waiting Queue Analytics</h5>
      </div>

      <div className="card-body" style={{ height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 20,
              left: 20,
              bottom: 80,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="equipmentName"
              interval={0}
              height={70}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) =>
                value.length > 18
                  ? value.substring(0, 18) + "..."
                  : value
              }
            />

            <YAxis allowDecimals={false} />

            <Tooltip
              formatter={(value) => [value, "Waiting Users"]}
              labelFormatter={(label) => `Equipment: ${label}`}
            />

            <Bar
              dataKey="waitingUsers"
              name="Waiting Users"
              fill="#f97316"
              radius={[8, 8, 0, 0]}
              maxBarSize={60}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WaitingQueueChart;