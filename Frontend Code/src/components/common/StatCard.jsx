import React from 'react'

const StatCard = ({ icon, value, label, trend, trendColor = 'green', onClick }) => {
  const colorClasses = {
    green: { bg: 'bg-green-50', icon: 'text-green-600', badge: 'bg-green-100 text-green-700' },
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600', badge: 'bg-blue-100 text-blue-700' },
    amber: { bg: 'bg-amber-50', icon: 'text-amber-600', badge: 'bg-amber-100 text-amber-700' },
    red: { bg: 'bg-red-50', icon: 'text-red-600', badge: 'bg-red-100 text-red-700' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600', badge: 'bg-purple-100 text-purple-700' },
  }

  const colors = colorClasses[trendColor] || colorClasses.green

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center`}>
          <span className={`text-xl ${colors.icon}`}>{icon}</span>
        </div>
        {trend && (
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${colors.badge}`}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-slate-900 mb-1">{value}</p>
      <p className="text-sm text-slate-500 font-medium">{label}</p>
    </div>
  )
}

export default StatCard
