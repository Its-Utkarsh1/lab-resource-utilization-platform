import React, { useState } from "react";
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useRole } from '../../hooks/useRole'
import { useUnreadNotifications } from '../../hooks/useNotifications'
import { getInitials } from '../../utils/helpers'

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth()
  const { navItems } = useRole()
  const location = useLocation()
  const [openMenu, setOpenMenu] = useState(null);
  const { data: unreadData } = useUnreadNotifications()
  const unreadCount = unreadData?.length || 0

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Logged-in Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <Link to="/" className="text-xl font-bold text-slate-800 tracking-tight">LabResource</Link>
            </div>

            {/* Role-based Nav Items */}
            <div className="hidden md:flex items-center gap-1 bg-slate-100 rounded-xl p-1">
              {navItems.map((item, i) => {

                if (item.children) {
                  return (
                    <div
                      key={i}
                      className="relative"
                      onMouseEnter={() => setOpenMenu(item.name)}
                      onMouseLeave={() => setOpenMenu(null)}
                    >
                      <button
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${location.pathname.startsWith(item.path)
                          ? "bg-green-500 text-white"
                          : "text-slate-600 hover:bg-white hover:text-green-600"
                          }`}
                      >
                        {item.name}
                      </button>

                      {openMenu === item.name && (
                        <div
                          className="absolute left-0 top-full w-64 bg-white border rounded-lg shadow-xl z-50"
                          onMouseEnter={() => setOpenMenu(item.name)}
                          onMouseLeave={() => setOpenMenu(null)}
                        >

                          {item.children.map((child) => (
                            <Link
                              key={child.path}
                              to={child.path}
                              className={`block px-4 py-3 text-sm transition-colors ${location.pathname === child.path
                                ? "bg-green-50 text-green-600 font-semibold"
                                : "text-slate-700 hover:bg-slate-100"
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
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${location.pathname === item.path
                      ? "bg-green-500 text-white shadow-sm"
                      : "text-slate-600 hover:text-green-600 hover:bg-white"
                      }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-4">
              <Link to="/notifications" className="relative p-2 text-slate-500 hover:text-green-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white text-white text-[10px] flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </Link>
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-slate-800">{user?.name}</p>
                  <p className="text-xs text-green-600 font-medium">{user?.role?.replace('_', ' ')}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-sm font-bold text-white shadow-md">
                  {getInitials(user?.name)}
                </div>
                <button onClick={logout} className="text-slate-400 hover:text-red-500 transition-colors" title="Logout">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}

export default DashboardLayout
