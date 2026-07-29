import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { useUnreadCount } from "../hooks/useNotifications";

const NotificationBell = () => {
  const { data: count, isLoading } = useUnreadCount();

  const unreadCount = isLoading ? 0 : count;

  return (
    <Link to="/notifications" className="relative inline-block">
      <Bell size={24} className="text-gray-700 hover:text-blue-600" />

      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full min-w-[18px] h-[18px] flex items-center justify-center text-xs font-bold">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </Link>
  );
};

export default NotificationBell;