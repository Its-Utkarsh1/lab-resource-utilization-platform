import React from "react";

// Same token palette as the rest of the app:
// ink #14181C · paper #F6F5F1 · steel #5B6770 · amber #E8A33D · teal #1F7A6C · line #D8D3C7

const SIZES = {
  sm: "w-6 h-6 border-2",
  md: "w-12 h-12 border-4",
  lg: "w-16 h-16 border-4",
};

/**
 * @param {string} [text="Loading..."]
 * @param {"sm"|"md"|"lg"} [size="md"]
 * @param {boolean} [fullScreen=false] - center in the full viewport height instead of a compact py-16 block
 */
const LoadingSpinner = ({ text = "Loading...", size = "md", fullScreen = false }) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${fullScreen ? "h-screen" : "py-16"}`}>
      <div className={`${SIZES[size] || SIZES.md} border-[#D8D3C7] border-t-[#1F7A6C] rounded-full animate-spin`} />
      {text && (
        <p className="text-sm font-mono tracking-widest text-[#5B6770] uppercase">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;