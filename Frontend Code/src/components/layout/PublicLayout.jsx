import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

// Same token palette as HomePage / DashboardLayout:
// ink #14181C · paper #F6F5F1 · steel #5B6770 · amber #E8A33D · teal #1F7A6C · line #D8D3C7

const navLinks = [
  { href: '/#about', label: 'About' },
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/#services', label: 'Services' },
  { href: '/#roles', label: 'For Roles' },
  { href: '/#contact', label: 'Contact' },
]

const BeakerIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
)

const PublicLayout = ({ children }) => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* Public Navigation */}
      <nav className="bg-white border-b border-[#D8D3C7] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <Link to="/" className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 border border-[#14181C]/15 rounded-sm flex items-center justify-center">
                <BeakerIcon className="w-6 h-6 text-[#1F7A6C]" />
              </div>
              <span className="text-lg font-mono font-bold tracking-widest text-[#14181C] uppercase">LR</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-[#5B6770] hover:text-[#1F7A6C] transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="px-5 py-2 text-sm font-medium text-[#14181C] hover:text-[#1F7A6C] transition-colors"
                  >
                    Workspace
                  </Link>
                  <button
                    onClick={logout}
                    className="px-5 py-2 bg-[#14181C] text-[#F6F5F1] font-mono text-sm uppercase tracking-wide rounded-sm hover:bg-[#2a2f35] transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-5 py-2 text-sm font-medium text-[#5B6770] hover:text-[#1F7A6C] transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2 bg-[#14181C] text-[#F6F5F1] font-mono text-sm uppercase tracking-wide rounded-sm hover:bg-[#2a2f35] transition-colors"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              type="button"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
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

        {/* Mobile nav panel */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[#D8D3C7] bg-white px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-sm text-sm text-[#14181C] hover:bg-[#F6F5F1]"
              >
                {link.label}
              </a>
            ))}

            <div className="pt-3 mt-2 border-t border-[#D8D3C7] flex flex-col gap-2">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2 rounded-sm text-sm font-medium text-[#14181C] hover:bg-[#F6F5F1]"
                  >
                    Workspace
                  </Link>
                  <button
                    onClick={() => {
                      setMobileOpen(false)
                      logout()
                    }}
                    className="px-3 py-2 bg-[#14181C] text-[#F6F5F1] font-mono text-sm uppercase tracking-wide rounded-sm text-center"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2 rounded-sm text-sm font-medium text-[#14181C] hover:bg-[#F6F5F1]"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2 bg-[#14181C] text-[#F6F5F1] font-mono text-sm uppercase tracking-wide rounded-sm text-center"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {children}

      {/* Public Footer */}
      <footer id="contact" className="bg-[#14181C] text-[#8b95a1] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 border border-white/20 rounded-sm flex items-center justify-center">
                  <BeakerIcon className="w-4 h-4 text-[#E8A33D]" />
                </div>
                <span className="text-lg font-mono font-bold tracking-widest text-[#F6F5F1] uppercase">LR</span>
              </div>
              <p className="text-sm">Empowering research through intelligent resource management.</p>
            </div>
            <div>
              <h4 className="text-[#F6F5F1] font-bold mb-4 text-sm tracking-wide uppercase">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/#about" className="hover:text-[#E8A33D] transition-colors">About</a></li>
                <li><a href="/#services" className="hover:text-[#E8A33D] transition-colors">Services</a></li>
                <li><a href="/#roles" className="hover:text-[#E8A33D] transition-colors">For Roles</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#F6F5F1] font-bold mb-4 text-sm tracking-wide uppercase">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-[#E8A33D] transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-[#E8A33D] transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-[#E8A33D] transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#F6F5F1] font-bold mb-4 text-sm tracking-wide uppercase">Contact</h4>
              <ul className="space-y-2 text-sm font-mono">
                <li>support@labresource.edu</li>
                <li>+1 (555) 123-4567</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-sm">
            <p>© 2026 LabResource Platform. All rights reserved.</p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-[#E8A33D] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#E8A33D] transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default PublicLayout