import React from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useNotifications, useMarkAsRead } from '../../hooks/useNotifications'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import { timeAgo } from '../../utils/helpers'

const NotificationsPage = () => {
  const { data: notifications, isLoading } = useNotifications()
  const markAsRead = useMarkAsRead()

  const getNotificationIcon = (type) => {
    const icons = {
      BOOKING_CONFIRMED: '✅',
      BOOKING_REMINDER: '⏰',
      MAINTENANCE_DUE: '🔧',
      CALIBRATION_EXPIRY: '⚠️',
      IDLE_EQUIPMENT: '📊',
      SHARING_REQUEST: '🤝',
      EQUIPMENT_AVAILABLE: '🔓',
    }
    return icons[type] || '📢'
  }

  const getNotificationColor = (type) => {
    const colors = {
      BOOKING_CONFIRMED: 'border-green-400',
      BOOKING_REMINDER: 'border-blue-400',
      MAINTENANCE_DUE: 'border-amber-400',
      CALIBRATION_EXPIRY: 'border-red-400',
      IDLE_EQUIPMENT: 'border-purple-400',
      SHARING_REQUEST: 'border-blue-400',
      EQUIPMENT_AVAILABLE: 'border-green-400',
    }
    return colors[type] || 'border-slate-300'
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
        <p className="text-slate-600">Stay updated with your lab activities</p>
      </div>

      {isLoading ? (
        <LoadingSpinner className="py-16" />
      ) : notifications?.length === 0 ? (
        <EmptyState 
          icon="🔔" 
          title="No notifications" 
          description="You're all caught up! No new notifications at the moment."
        />
      ) : (
        <div className="space-y-3">
          {notifications?.map((notification) => (
            <div 
              key={notification.id} 
              className={`card p-5 border-l-4 ${getNotificationColor(notification.type)} ${!notification.read ? 'bg-green-50/30' : ''}`}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xl">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{notification.title}</p>
                  <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-xs text-slate-500">{timeAgo(notification.createdAt)}</span>
                    {!notification.read && (
                      <button 
                        onClick={() => markAsRead.mutate(notification.id)}
                        className="text-xs text-green-600 font-medium hover:text-green-700"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
                {!notification.read && (
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}

export default NotificationsPage
