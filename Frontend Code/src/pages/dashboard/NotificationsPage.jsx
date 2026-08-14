import React from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useNotifications, useMarkAsRead } from '../../hooks/useNotifications'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import { timeAgo } from '../../utils/helpers'

// Same token palette as the rest of the app:
// ink #14181C · paper #F6F5F1 · steel #5B6770 · amber #E8A33D · teal #1F7A6C · line #D8D3C7

const NOTIFICATION_META = {
  BOOKING_CONFIRMED: { tag: 'BC', accent: 'teal' },
  BOOKING_REMINDER: { tag: 'BR', accent: 'amber' },
  MAINTENANCE_DUE: { tag: 'MD', accent: 'amber' },
  CALIBRATION_EXPIRY: { tag: 'CE', accent: 'red' },
  IDLE_EQUIPMENT: { tag: 'IE', accent: 'steel' },
  SHARING_REQUEST: { tag: 'SR', accent: 'teal' },
  EQUIPMENT_AVAILABLE: { tag: 'EA', accent: 'teal' },
}
const DEFAULT_META = { tag: '\u2022', accent: 'steel' }

const ACCENT_STYLES = {
  teal: { border: 'border-l-[#1F7A6C]', bg: 'bg-[#1F7A6C]/10', text: 'text-[#1F7A6C]' },
  amber: { border: 'border-l-[#E8A33D]', bg: 'bg-[#E8A33D]/10', text: 'text-[#E8A33D]' },
  red: { border: 'border-l-red-400', bg: 'bg-red-50', text: 'text-red-600' },
  steel: { border: 'border-l-[#5B6770]', bg: 'bg-[#5B6770]/10', text: 'text-[#5B6770]' },
}

const NotificationsPage = () => {
  const { data: notifications, isLoading } = useNotifications()
  const markAsRead = useMarkAsRead()

  // Shared mutation across every row — track which notification is
  // currently being marked so only that one row shows a busy state
  // (and can't be double-fired by a fast double-click).
  const isMarking = (id) => markAsRead.isLoading && markAsRead.variables === id

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#14181C] tracking-tight">Notifications</h1>
        <p className="text-[#5B6770] mt-1">Stay updated with your lab activities</p>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : notifications?.length === 0 ? (
        <EmptyState
          icon="🔔"
          title="No notifications"
          description="You're all caught up! No new notifications at the moment."
        />
      ) : (
        <div className="space-y-3">
          {notifications?.map((notification) => {
            const meta = NOTIFICATION_META[notification.type] || DEFAULT_META
            const accent = ACCENT_STYLES[meta.accent]
            const marking = isMarking(notification.id)

            return (
              <div
                key={notification.id}
                className={`bg-white rounded-sm border border-[#D8D3C7] border-l-2 ${accent.border} p-5 ${
                  !notification.read ? 'bg-[#F6F5F1]/60' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-sm flex items-center justify-center font-mono text-xs font-bold shrink-0 ${accent.bg} ${accent.text}`}>
                    {meta.tag}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#14181C]">{notification.title}</p>
                    <p className="text-sm text-[#5B6770] mt-1">{notification.message}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-xs font-mono text-[#5B6770]">{timeAgo(notification.createdAt)}</span>
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead.mutate(notification.id)}
                          disabled={marking}
                          className="text-xs font-mono uppercase tracking-wide text-[#1F7A6C] font-medium hover:text-[#175f54] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {marking ? 'Marking...' : 'Mark as read'}
                        </button>
                      )}
                    </div>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-[#E8A33D] rounded-full mt-1 shrink-0" aria-hidden="true" />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </DashboardLayout>
  )
}

export default NotificationsPage