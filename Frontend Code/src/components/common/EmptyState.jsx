import React from 'react'

const EmptyState = ({ icon = '📭', title = 'No data found', description = 'There are no items to display at the moment.', action = null }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md mb-6">{description}</p>
      {action}
    </div>
  )
}

export default EmptyState
