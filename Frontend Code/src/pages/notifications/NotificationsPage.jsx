import React, { useMemo, useState } from "react";
import {
    useNotifications,
    useMarkRead,
    useMarkAllRead,
} from "../../hooks/useNotifications";

const NotificationsPage = () => {
    const { data: notifications = [], isLoading } = useNotifications();
    const markRead = useMarkRead();
    const markAllRead = useMarkAllRead();

    const [unreadOnly, setUnreadOnly] = useState(false);

    const unreadCount = useMemo(
        () => notifications.filter((n) => !n.isRead).length,
        [notifications]
    );

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
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Notifications
                        </h1>
                        {unreadCount > 0 && (
                            <span className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-1.5 rounded-full bg-emerald-600 text-white text-xs font-medium">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                        {unreadCount > 0
                            ? `You have ${unreadCount} unread notification${
                                  unreadCount === 1 ? "" : "s"
                              }.`
                            : "You're all caught up."}
                    </p>
                </div>

                {unreadCount > 0 && (
                    <button
                        onClick={() => markAllRead.mutate()}
                        disabled={markAllRead.isLoading}
                        className="shrink-0 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
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
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                            !unreadOnly
                                ? "bg-gray-900 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setUnreadOnly(true)}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                            unreadOnly
                                ? "bg-gray-900 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        Unread
                    </button>
                </div>
            )}

            {/* Content */}
            {isLoading ? (
                <div className="py-16 flex flex-col items-center justify-center text-gray-500">
                    <div className="h-8 w-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
                    <p className="text-sm">Loading notifications...</p>
                </div>
            ) : notifications.length === 0 ? (
                <div className="py-16 flex flex-col items-center justify-center text-center px-6 bg-white border border-gray-200 rounded-xl">
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                        <span className="text-gray-400 text-xl">🔔</span>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">
                        No notifications
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 max-w-sm">
                        You don't have any notifications yet.
                    </p>
                </div>
            ) : visibleNotifications.length === 0 ? (
                <div className="py-16 flex flex-col items-center justify-center text-center px-6 bg-white border border-gray-200 rounded-xl">
                    <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
                        <span className="text-emerald-600 text-xl">✓</span>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">
                        No unread notifications
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 max-w-sm">
                        You've read everything. Switch to "All" to see your full
                        history.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {visibleNotifications.map((notification) => {
                        const busy = isRowBusy(notification.id);
                        return (
                            <div
                                key={notification.id}
                                className={`relative rounded-xl border p-4 transition-colors ${
                                    notification.read
                                        ? "bg-white border-gray-200"
                                        : "bg-emerald-50/60 border-emerald-200"
                                }`}
                            >
                                {!notification.read && (
                                    <span className="absolute top-4 left-0 h-2 w-2 -translate-x-1 rounded-full bg-emerald-500" />
                                )}
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <h3 className="font-semibold text-sm text-gray-900">
                                            {notification.title}
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-600">
                                            {notification.message}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-2">
                                            {notification.createdAt}
                                        </p>
                                    </div>

                                    {!notification.read && (
                                        <button
                                            onClick={() => markRead.mutate(notification.id)}
                                            disabled={busy}
                                            className="shrink-0 rounded-lg border border-emerald-200 px-2.5 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
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