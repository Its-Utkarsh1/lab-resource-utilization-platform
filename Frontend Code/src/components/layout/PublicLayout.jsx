import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const PublicLayout = ({ children }) => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-white">
      {/* Public Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-slate-800 tracking-tight">LabResource</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="/#about" className="nav-link">About</a>
              <a href="/#how-it-works" className="nav-link">How It Works</a>
              <a href="/#services" className="nav-link">Services</a>
              <a href="/#roles" className="nav-link">For Roles</a>
              <a href="/#contact" className="nav-link">Contact</a>
            </div>

            <div className="flex items-center gap-3">
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="px-5 py-2 text-slate-900 font-medium hover:text-green-600"
                    >
                      Workspace
                    </Link>

                    <button
                      onClick={logout}
                      className="btn-primary text-sm"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="px-5 py-2 text-slate-600 font-medium hover:text-green-600"
                    >
                      Log In
                    </Link>

                    <Link
                      to="/register"
                      className="btn-primary text-sm"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
          </div>
        </div>
      </nav>

      {children}

      {/* Public Footer */}
      <footer id="contact" className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white text-sm">⚗</div>
                <span className="text-lg font-bold text-white">LabResource</span>
              </div>
              <p className="text-sm">Empowering research through intelligent resource management.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/#about" className="hover:text-green-400 transition-colors">About</a></li>
                <li><a href="/#services" className="hover:text-green-400 transition-colors">Services</a></li>
                <li><a href="/#roles" className="hover:text-green-400 transition-colors">For Roles</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-green-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>support@labresource.edu</li>
                <li>+1 (555) 123-4567</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between text-sm">
            <p>© 2026 LabResource Platform. All rights reserved.</p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-green-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-green-400 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default PublicLayout
