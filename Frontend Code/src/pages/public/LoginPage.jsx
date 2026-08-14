import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

// Same token palette as HomePage:
// ink #14181C · paper #F6F5F1 · steel #5B6770 · amber #E8A33D · teal #1F7A6C · line #D8D3C7

const features = [
  { tag: 'AVL', title: 'Real-time Availability', desc: 'Track equipment status instantly' },
  { tag: 'SCH', title: 'Smart Scheduling', desc: 'Rule-based booking optimization' },
  { tag: 'ANL', title: 'Analytics & Insights', desc: 'Data-driven procurement decisions' },
]

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login, oauthLogin } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(formData)
      toast.success('Welcome back!')
      navigate('/')
    } catch (error) {
      console.error('Login error:', error)
      console.error('Response:', error.response?.data)

      const responseData = error.response?.data
      const message =
        typeof responseData === 'string'
          ? responseData
          : responseData?.message || 'Invalid credentials'

      if (message.toLowerCase().includes('verify your email')) {
        toast.error(message)
        navigate('/verify-email', { state: { email: formData.email } })
        return
      }

      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F5F1] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-sm shadow-xl overflow-hidden border border-[#D8D3C7] flex flex-col md:flex-row">

        {/* Left Side - Branding */}
        <div className="md:w-1/2 bg-[#14181C] p-10 flex flex-col justify-between text-[#F6F5F1] relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #F6F5F1 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
            aria-hidden="true"
          />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-11 h-11 border border-white/20 rounded-sm flex items-center justify-center">
                <svg className="w-6 h-6 text-[#E8A33D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h1 className="text-xl font-mono font-bold tracking-widest uppercase">LR</h1>
            </div>

            <h2 className="text-4xl font-black mb-4 leading-tight tracking-tight">Welcome Back</h2>
            <p className="text-[#8b95a1] text-lg leading-relaxed mb-8">
              Sign in to access your lab resources, manage bookings, and track equipment utilization.
            </p>

            <div className="space-y-3">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 border border-white/10 rounded-sm p-4">
                  <div className="w-9 h-9 rounded-sm bg-[#E8A33D]/10 flex items-center justify-center font-mono text-[10px] font-bold text-[#E8A33D] shrink-0">
                    {feature.tag}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{feature.title}</p>
                    <p className="text-[#8b95a1] text-xs">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 mt-8 font-mono text-[11px] tracking-widest text-[#8b95a1] uppercase">
            Trusted by 50+ research institutions worldwide
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="md:w-1/2 p-10 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-[#14181C] mb-2 tracking-tight">Sign In</h2>
            <p className="text-[#5B6770]">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#14181C] mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@institution.edu"
                required
                autoComplete="email"
                className="w-full rounded-sm border border-[#D8D3C7] px-4 py-2.5 text-[#14181C] placeholder-[#5B6770]/60 focus:outline-none focus:border-[#1F7A6C] focus:ring-1 focus:ring-[#1F7A6C] transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#14181C] mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                className="w-full rounded-sm border border-[#D8D3C7] px-4 py-2.5 text-[#14181C] placeholder-[#5B6770]/60 focus:outline-none focus:border-[#1F7A6C] focus:ring-1 focus:ring-[#1F7A6C] transition-colors"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded-sm border-[#D8D3C7] text-[#1F7A6C] focus:ring-[#1F7A6C]" />
                <span className="text-[#5B6770]">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-[#1F7A6C] hover:text-[#175f54] font-medium transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#14181C] text-[#F6F5F1] font-mono text-sm tracking-wide uppercase rounded-sm hover:bg-[#2a2f35] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#D8D3C7]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-[#5B6770] font-mono text-xs uppercase tracking-wide">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => oauthLogin("google")}
                className="w-full max-w-xs flex items-center justify-center gap-2 bg-white border border-[#D8D3C7] rounded-sm py-2.5 text-[#14181C] hover:border-[#1F7A6C] hover:bg-[#1F7A6C]/5 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  />

                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />

                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />

                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>

                <span className="text-sm font-medium">
                  Continue with Google
                </span>
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-[#5B6770] text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#1F7A6C] hover:text-[#175f54] font-medium transition-colors">
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage