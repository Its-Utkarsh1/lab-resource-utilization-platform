import React from "react";

const EmptyState = ({
  title = "No Data Available",
  description = "There is nothing to display at the moment.",
}) => {
  return (
    <div className="bg-white rounded-xl shadow border p-10 text-center">

      <div className="text-6xl mb-4">📭</div>

      <h2 className="text-2xl font-semibold text-slate-800">
        {title}
      </h2>

      <p className="text-slate-500 mt-2">
        {description}
      </p>

    </div>
  );
};

export default EmptyState;