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

const MonthlyBookingChart = ({ data = [] }) => {
    return (
        <div className="card shadow-sm h-100">
            <div className="card-header bg-white">
                <h5 className="mb-0">Monthly Bookings</h5>
            </div>

            <div className="card-body">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="month" />

                        <YAxis allowDecimals={false} />

                        <Tooltip />

                        <Bar
                            dataKey="totalBookings"
                            fill="#4F46E5"
                            radius={[6, 6, 0, 0]}
                            maxBarSize={60}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default MonthlyBookingChart;