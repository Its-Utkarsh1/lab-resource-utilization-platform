import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const RevenueChart = ({ data = [] }) => {
  return (
    <div className="card shadow-sm h-100">
      <div className="card-header">
        <h5 className="mb-0">Revenue by Equipment</h5>
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
            barCategoryGap="35%"
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

            <YAxis
              domain={[0, (dataMax) => Math.ceil(dataMax * 1.1)]}
              tickFormatter={(value) => `₹${value}`}
            />

            <Tooltip
              formatter={(value) => [
                `₹${Number(value).toLocaleString("en-IN")}`,
                "Revenue",
              ]}
              labelFormatter={(label) => `Equipment: ${label}`}
            />

            <Bar
              dataKey="revenue"
              name="Revenue"
              fill="#22c55e"
              radius={[8, 8, 0, 0]}
              maxBarSize={60}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;