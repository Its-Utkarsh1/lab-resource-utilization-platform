import React from "react";

const LoadingSpinner = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">

      <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>

      <p className="mt-4 text-slate-500">
        {text}
      </p>

    </div>
  );
};

export default LoadingSpinner;