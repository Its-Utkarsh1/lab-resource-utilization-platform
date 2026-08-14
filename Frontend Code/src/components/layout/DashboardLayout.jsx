import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useRole } from "../../hooks/useRole";
import { useUnreadNotifications } from "../../hooks/useNotifications";
import { getInitials } from "../../utils/helpers";

// Same token palette as the rest of the app:
// ink #14181C · paper #F6F5F1 · steel #5B6770 · amber #E8A33D · teal #1F7A6C · line #D8D3C7

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { navItems } = useRole();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: unreadData } = useUnreadNotifications();
  const unreadCount = unreadData?.length || 0;

  const isActive = (path) => location.pathname === path;
  const isActiveGroup = (path) => location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-[#F6F5F1]">
      {/* Logged-in Navigation */}
      <nav className="bg-white border-b border-[#D8D3C7] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 border border-[#14181C]/15 rounded-sm flex items-center justify-center">
                <svg className="w-6 h-6 text-[#1F7A6C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <Link to="/" className="text-lg font-mono font-bold tracking-widest text-[#14181C] uppercase">
                LRUP
              </Link>
            </div>

            {/* Role-based Nav Items (desktop) */}
            <div className="hidden md:flex items-center gap-1 bg-[#F6F5F1] border border-[#D8D3C7] rounded-sm p-1">
              {navItems.map((item, i) => {
                if (item.children) {
                  const open = openMenu === item.name;
                  return (
                    <div
                      key={i}
                      className="relative"
                      onMouseEnter={() => setOpenMenu(item.name)}
                      onMouseLeave={() => setOpenMenu(null)}
                    >
                      <button
                        type="button"
                        aria-haspopup="true"
                        aria-expanded={open}
                        onClick={() => setOpenMenu(open ? null : item.name)}
                        className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors ${
                          isActiveGroup(item.path)
                            ? "bg-[#14181C] text-[#F6F5F1]"
                            : "text-[#5B6770] hover:bg-white hover:text-[#1F7A6C]"
                        }`}
                      >
                        {item.name}
                      </button>

                      {open && (
                        <div
                          role="menu"
                          className="absolute left-0 top-full mt-1 w-64 bg-white border border-[#D8D3C7] rounded-sm shadow-lg z-50 overflow-hidden"
                          onMouseEnter={() => setOpenMenu(item.name)}
                          onMouseLeave={() => setOpenMenu(null)}
                        >
                          {item.children.map((child) => (
                            <Link
                              key={child.path}
                              to={child.path}
                              role="menuitem"
                              onClick={() => setOpenMenu(null)}
                              className={`block px-4 py-3 text-sm transition-colors ${
                                isActive(child.path)
                                  ? "bg-[#1F7A6C]/10 text-[#1F7A6C] font-semibold"
                                  : "text-[#14181C] hover:bg-[#F6F5F1]"
                              }`}
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={i}
                    to={item.path}
                    onClick={() => setOpenMenu(null)}
                    className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? "bg-[#14181C] text-[#F6F5F1]"
                        : "text-[#5B6770] hover:text-[#1F7A6C] hover:bg-white"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/notifications"
                aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
                className="relative p-2 text-[#5B6770] hover:text-[#1F7A6C] transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[1.1rem] h-[1.1rem] px-1 bg-red-500 rounded-full border-2 border-white text-white text-[10px] flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </Link>

              <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-[#D8D3C7]">
                <div className="text-right">
                  <p className="text-sm font-medium text-[#14181C]">{user?.fullName}</p>
                  <p className="text-[10px] font-mono tracking-widest text-[#1F7A6C] uppercase">
                    {user?.role?.replaceAll("_", " ")}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-sm bg-[#14181C] flex items-center justify-center text-xs font-mono font-bold text-[#E8A33D]">
                  {getInitials(user?.fullName)}
                </div>
                <button
                  onClick={logout}
                  aria-label="Log out"
                  className="text-[#5B6770] hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>

              {/* Mobile menu toggle */}
              <button
                type="button"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((v) => !v)}
                className="md:hidden p-2 text-[#14181C] border border-[#D8D3C7] rounded-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile nav panel */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[#D8D3C7] bg-white px-4 py-3 space-y-1">
            <div className="flex items-center gap-3 pb-3 mb-2 border-b border-[#D8D3C7] sm:hidden">
              <div className="w-9 h-9 rounded-sm bg-[#14181C] flex items-center justify-center text-xs font-mono font-bold text-[#E8A33D]">
                {getInitials(user?.fullName)}
              </div>
              <div>
                <p className="text-sm font-medium text-[#14181C]">{user?.fullName}</p>
                <p className="text-[10px] font-mono tracking-widest text-[#1F7A6C] uppercase">
                  {user?.role?.replaceAll("_", " ")}
                </p>
              </div>
            </div>

            {navItems.map((item, i) =>
              item.children ? (
                <div key={i} className="space-y-1">
                  <p className="px-2 py-1 text-xs font-mono tracking-widest text-[#5B6770] uppercase">{item.name}</p>
                  {item.children.map((child) => (
                    <Link
                      key={child.path}
                      to={child.path}
                      onClick={() => setMobileOpen(false)}
                      className={`block px-3 py-2 rounded-sm text-sm ${
                        isActive(child.path) ? "bg-[#1F7A6C]/10 text-[#1F7A6C] font-semibold" : "text-[#14181C] hover:bg-[#F6F5F1]"
                      }`}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={i}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2 rounded-sm text-sm ${
                    isActive(item.path) ? "bg-[#14181C] text-[#F6F5F1]" : "text-[#14181C] hover:bg-[#F6F5F1]"
                  }`}
                >
                  {item.name}
                </Link>
              )
            )}

            <button
              onClick={logout}
              className="w-full text-left px-3 py-2 rounded-sm text-sm text-red-600 hover:bg-red-50 mt-2 border-t border-[#D8D3C7] pt-3"
            >
              Log out
            </button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
};

export default DashboardLayout;