import React from "react";

// Same token palette as the rest of the app:
// ink #14181C · paper #F6F5F1 · steel #5B6770 · amber #E8A33D · teal #1F7A6C · line #D8D3C7

/**
 * @param {number[]} data - 7 values (Mon–Sun), typically 0–100
 */
const WeeklyUtilizationChart = ({ data }) => {
  const max = Math.max(...data, 1);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="flex items-end gap-3 h-40">
      {data.map((value, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
          <span className="font-mono text-xs text-[#5B6770]">{value}%</span>
          <div className="w-full bg-[#F6F5F1] rounded-sm relative h-full flex items-end overflow-hidden">
            <div
              className="w-full bg-[#1F7A6C] rounded-sm transition-all"
              style={{ height: `${(value / max) * 100}%` }}
            />
          </div>
          <span className="font-mono text-[10px] tracking-widest text-[#5B6770] uppercase">
            {days[i] ?? i + 1}
          </span>
        </div>
      ))}
    </div>
  );
};

export default WeeklyUtilizationChart;