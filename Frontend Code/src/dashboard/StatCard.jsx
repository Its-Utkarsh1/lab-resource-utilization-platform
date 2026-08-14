import React from "react";

// Same token palette as the rest of the app:
// ink #14181C · paper #F6F5F1 · steel #5B6770 · amber #E8A33D · teal #1F7A6C · line #D8D3C7

const ACCENTS = {
  amber: { hex: "#E8A33D", text: "text-[#E8A33D]", bg: "bg-[#E8A33D]/10" },
  teal: { hex: "#1F7A6C", text: "text-[#1F7A6C]", bg: "bg-[#1F7A6C]/10" },
  steel: { hex: "#5B6770", text: "text-[#5B6770]", bg: "bg-[#5B6770]/10" },
};

/**
 * @param {string} title
 * @param {string|number} value
 * @param {React.ReactNode} [icon] - emoji, text, or an svg element
 * @param {"amber"|"teal"|"steel"} [color="teal"] - accent from the app's palette
 * @param {string} [subtitle]
 */
const StatCard = ({ title, value, icon, color = "teal", subtitle }) => {
  const accent = ACCENTS[color] || ACCENTS.teal;

  return (
    <div
      className="bg-white rounded-sm border border-[#D8D3C7] border-t-2 p-6 hover:border-[#D8D3C7] transition-colors"
      style={{ borderTopColor: accent.hex }}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="min-w-0">
          <p className="text-[#5B6770] text-xs font-mono tracking-widest uppercase">{title}</p>
          <h2 className={`text-4xl font-mono font-bold mt-3 ${accent.text}`}>{value}</h2>
          {subtitle && <p className="text-xs text-[#5B6770] mt-2">{subtitle}</p>}
        </div>

        {icon && (
          <div className={`shrink-0 w-11 h-11 rounded-sm flex items-center justify-center text-xl ${accent.bg} ${accent.text}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;