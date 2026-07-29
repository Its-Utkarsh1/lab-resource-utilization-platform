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

const BookingTrendChart = ({ data = [] }) => {
    return (
        <div className="card shadow-sm">
            <div className="card-header">
                <h5 className="mb-0">Booking Trend</h5>
            </div>

            <div className="card-body" style={{ height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="bookingDate" />


                        <YAxis />

                        <Tooltip />

                        <Line
                            type="monotone"
                            dataKey="bookingCount"
                            stroke="#4F46E5"
                            strokeWidth={3}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default BookingTrendChart;