import React from "react";

const StatCard = ({
  title,
  value,
  icon,
  color = "text-green-600",
  subtitle,
}) => {
  return (
    <div className="bg-white rounded-xl shadow border p-6 hover:shadow-lg transition">

      <div className="flex justify-between items-start">

        <div>

          <p className="text-slate-500 text-sm">
            {title}
          </p>

          <h2 className={`text-4xl font-bold mt-3 ${color}`}>
            {value}
          </h2>

          {subtitle && (
            <p className="text-xs text-slate-400 mt-2">
              {subtitle}
            </p>
          )}

        </div>

        <div className="text-4xl">
          {icon}
        </div>

      </div>

    </div>
  );
};

export default StatCard;