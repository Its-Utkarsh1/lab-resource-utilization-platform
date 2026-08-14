import React, { useMemo, useState } from "react";
import { useNotifications, useMarkRead, useMarkAllRead } from "../../hooks/useNotifications";

// Same token palette as the rest of the app:
// ink #14181C · paper #F6F5F1 · steel #5B6770 · amber #E8A33D · teal #1F7A6C · line #D8D3C7

const NotificationsPage = () => {
  const { data: notifications = [], isLoading } = useNotifications();
  const markRead = useMarkRead();
  const markAllRead = useMarkAllRead();

  const [unreadOnly, setUnreadOnly] = useState(false);

  // NOTE: the original mixed two different field names — `isRead` here
  // in the count, `read` in the row rendering below. Standardized on
  // `isRead` throughout, matching what unreadCount already used.
  const unreadCount = useMemo(() => notifications.filter((n) => !n.isRead).length, [notifications]);

  const visibleNotifications = useMemo(
    () => (unreadOnly ? notifications.filter((n) => !n.isRead) : notifications),
    [notifications, unreadOnly]
  );

  const isRowBusy = (id) => markRead.isLoading && markRead.variables === id;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-[#14181C] tracking-tight">Notifications</h1>
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-1.5 rounded-sm bg-[#E8A33D] text-white text-xs font-mono font-bold">
                {unreadCount}
              </span>
            )}
          </div>
          <p className="text-sm text-[#5B6770] mt-1">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}.`
              : "You're all caught up."}
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={() => markAllRead.mutate()}
            disabled={markAllRead.isLoading}
            className="shrink-0 rounded-sm bg-[#14181C] px-4 py-2 text-sm font-mono uppercase tracking-wide text-white hover:bg-[#2a2f35] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {markAllRead.isLoading ? "Marking..." : "Mark all read"}
          </button>
        )}
      </div>

      {/* Filter toggle */}
      {notifications.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setUnreadOnly(false)}
            className={`rounded-sm px-3 py-1 text-xs font-mono uppercase tracking-wide transition-colors ${
              !unreadOnly ? "bg-[#14181C] text-white" : "bg-[#F6F5F1] text-[#5B6770] hover:bg-[#D8D3C7]/60"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setUnreadOnly(true)}
            className={`rounded-sm px-3 py-1 text-xs font-mono uppercase tracking-wide transition-colors ${
              unreadOnly ? "bg-[#14181C] text-white" : "bg-[#F6F5F1] text-[#5B6770] hover:bg-[#D8D3C7]/60"
            }`}
          >
            Unread
          </button>
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="py-16 flex flex-col items-center justify-center text-[#5B6770]">
          <div className="h-8 w-8 border-2 border-[#D8D3C7] border-t-[#1F7A6C] rounded-full animate-spin mb-3" />
          <p className="text-sm">Loading notifications...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center text-center px-6 bg-white border border-[#D8D3C7] rounded-sm">
          <div className="h-12 w-12 rounded-sm bg-[#F6F5F1] flex items-center justify-center mb-3">
            <span className="text-[#5B6770] text-xl">🔔</span>
          </div>
          <h3 className="text-base font-bold text-[#14181C]">No notifications</h3>
          <p className="text-sm text-[#5B6770] mt-1 max-w-sm">You don't have any notifications yet.</p>
        </div>
      ) : visibleNotifications.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center text-center px-6 bg-white border border-[#D8D3C7] rounded-sm">
          <div className="h-12 w-12 rounded-sm bg-[#1F7A6C]/10 flex items-center justify-center mb-3">
            <span className="text-[#1F7A6C] text-xl">✓</span>
          </div>
          <h3 className="text-base font-bold text-[#14181C]">No unread notifications</h3>
          <p className="text-sm text-[#5B6770] mt-1 max-w-sm">
            You've read everything. Switch to "All" to see your full history.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleNotifications.map((notification) => {
            const busy = isRowBusy(notification.id);
            return (
              <div
                key={notification.id}
                className={`relative rounded-sm border p-4 transition-colors ${
                  notification.isRead ? "bg-white border-[#D8D3C7]" : "bg-[#E8A33D]/5 border-[#E8A33D]/30"
                }`}
              >
                {!notification.isRead && (
                  <span className="absolute top-4 left-0 h-2 w-2 -translate-x-1 rounded-full bg-[#E8A33D]" />
                )}
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm text-[#14181C]">{notification.title}</h3>
                    <p className="mt-1 text-sm text-[#5B6770]">{notification.message}</p>
                    <p className="text-xs font-mono text-[#5B6770]/80 mt-2">{notification.createdAt}</p>
                  </div>

                  {!notification.isRead && (
                    <button
                      onClick={() => markRead.mutate(notification.id)}
                      disabled={busy}
                      className="shrink-0 rounded-sm border border-[#1F7A6C]/30 px-2.5 py-1 text-xs font-mono uppercase tracking-wide text-[#1F7A6C] hover:bg-[#1F7A6C]/10 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                    >
                      {busy ? "Marking..." : "Mark read"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;