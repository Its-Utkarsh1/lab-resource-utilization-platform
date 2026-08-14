import React from "react";

// Same token palette as the rest of the app:
// ink #14181C · paper #F6F5F1 · steel #5B6770 · amber #E8A33D · teal #1F7A6C · line #D8D3C7

const STYLES = {
  AVAILABLE: { text: "text-[#1F7A6C]", bg: "bg-[#1F7A6C]/10", dot: "bg-[#1F7A6C]" },
  APPROVED: { text: "text-[#1F7A6C]", bg: "bg-[#1F7A6C]/10", dot: "bg-[#1F7A6C]" },
  ACTIVE: { text: "text-[#1F7A6C]", bg: "bg-[#1F7A6C]/10", dot: "bg-[#1F7A6C]" },
  COMPLETED: { text: "text-[#1F7A6C]", bg: "bg-[#1F7A6C]/10", dot: "bg-[#1F7A6C]" },

  PENDING: { text: "text-[#E8A33D]", bg: "bg-[#E8A33D]/10", dot: "bg-[#E8A33D]" },
  MAINTENANCE: { text: "text-[#E8A33D]", bg: "bg-[#E8A33D]/10", dot: "bg-[#E8A33D]" },

  BOOKED: { text: "text-[#5B6770]", bg: "bg-[#5B6770]/10", dot: "bg-[#5B6770]" },

  REJECTED: { text: "text-red-600", bg: "bg-red-50", dot: "bg-red-500" },

  DEFAULT: { text: "text-[#5B6770]", bg: "bg-[#5B6770]/10", dot: "bg-[#5B6770]" },
};

/**
 * @param {string} status - status key, e.g. "APPROVED", "PENDING"
 * @param {boolean} [dot=true] - show a leading status dot
 * @param {string} [className] - extra classes merged onto the badge
 */
const StatusBadge = ({ status, dot = true, className = "" }) => {
  const style = STYLES[status] || STYLES.DEFAULT;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-xs font-mono font-medium tracking-wide uppercase ${style.bg} ${style.text} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />}
      {status}
    </span>
  );
};

export default StatusBadge;