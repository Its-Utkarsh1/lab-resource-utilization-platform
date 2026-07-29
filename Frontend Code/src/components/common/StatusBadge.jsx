import React from 'react'

const StatusBadge = ({ status, size = 'md' }) => {
  const statusConfig = {
    AVAILABLE: { label: 'Available', color: 'green' },
    BOOKED: { label: 'Booked', color: 'amber' },
    UNDER_MAINTENANCE: { label: 'Maintenance', color: 'red' },
    OUT_OF_SERVICE: { label: 'Out of Service', color: 'red' },
    RETIRED: { label: 'Retired', color: 'slate' },
    PENDING_APPROVAL: { label: 'Pending', color: 'amber' },
    CONFIRMED: { label: 'Confirmed', color: 'green' },
    IN_USE: { label: 'In Use', color: 'blue' },
    COMPLETED: { label: 'Completed', color: 'green' },
    CANCELLED: { label: 'Cancelled', color: 'red' },
    NO_SHOW: { label: 'No Show', color: 'red' },
    SCHEDULED: { label: 'Scheduled', color: 'blue' },
    IN_PROGRESS: { label: 'In Progress', color: 'amber' },
    OVERDUE: { label: 'Overdue', color: 'red' },
  }

  const config = statusConfig[status] || { label: status, color: 'slate' }

  const colorClasses = {
    green: 'bg-green-100 text-green-700 border-green-200',
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
    amber: 'bg-amber-100 text-amber-700 border-amber-200',
    red: 'bg-red-100 text-red-700 border-red-200',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    purple: 'bg-purple-100 text-purple-700 border-purple-200',
  }

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-3 py-1',
    lg: 'text-sm px-4 py-1.5',
  }

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${colorClasses[config.color]} ${sizeClasses[size]}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${config.color === 'green' ? 'bg-green-500' : config.color === 'blue' ? 'bg-blue-500' : config.color === 'amber' ? 'bg-amber-500' : config.color === 'red' ? 'bg-red-500' : 'bg-slate-500'}`}></span>
      {config.label}
    </span>
  )
}

export default StatusBadge
