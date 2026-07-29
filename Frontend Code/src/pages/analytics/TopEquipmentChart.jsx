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

const TopEquipmentChart = ({ data = [] }) => {
    return (
        <div className="card shadow-sm h-100">
            <div className="card-header">
                <h5 className="mb-0">Top Used Equipment</h5>
            </div>

            <div className="card-body" style={{ height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}
                        margin={{
                            top: 20,
                            right: 20,
                            left: 20,
                            bottom: 60,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis
                            dataKey="equipmentName"
                            tickFormatter={(value) =>
                                value.length > 12 ? value.slice(0, 12) + "..." : value
                            }
                            interval={0}
                            height={50}
                        />

                        <YAxis />

                        <Tooltip />

                        <Bar
                            dataKey="bookingCount"
                            fill="#8b5cf6"
                            maxBarSize={60}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default TopEquipmentChart;