import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { ROLES } from '../../utils/roles'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'

// Same token palette as HomePage / LoginPage:
// ink #14181C · paper #F6F5F1 · steel #5B6770 · amber #E8A33D · teal #1F7A6C · line #D8D3C7

const inputClass =
  'w-full rounded-sm border border-[#D8D3C7] px-4 py-2.5 text-[#14181C] placeholder-[#5B6770]/60 focus:outline-none focus:border-[#1F7A6C] focus:ring-1 focus:ring-[#1F7A6C] transition-colors'
const labelClass = 'block text-sm font-medium text-[#14181C] mb-2'

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    role: '',
    institutionName: '',
    institutionCode: '',
    departmentName: '',
    labCode: '',
  })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      const { confirmPassword, ...request } = formData

      await register(request)

      toast.success('Account created successfully. Please verify your email.')

      navigate('/verify-email', {
        state: { email: formData.email },
      })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const roleOptions = [
    { value: 'SYSTEM_ADMIN', label: 'System Admin' },
    { value: 'INSTITUTION_ADMIN', label: 'Institution Admin' },
    { value: 'DEPARTMENT_HEAD', label: 'Department Head' },
    { value: 'PROFESSOR', label: 'Professor' },
    { value: 'ASSOCIATE_PROFESSOR', label: 'Associate Professor' },
    { value: 'ASSISTANT_PROFESSOR', label: 'Assistant Professor' },
    { value: 'RESEARCH_SCIENTIST', label: 'Research Scientist' },
    { value: 'RESEARCH_ASSOCIATE', label: 'Research Associate' },
    { value: 'LAB_MANAGER', label: 'Lab Manager' },
    { value: 'LAB_TECHNICIAN', label: 'Lab Technician' },
    { value: 'RESEARCHER', label: 'Researcher' },
    { value: 'STUDENT', label: 'Student' },
  ]

  return (
    <div className="min-h-screen bg-[#F6F5F1] flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl bg-white rounded-sm shadow-xl overflow-hidden border border-[#D8D3C7] p-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 border border-[#14181C]/15 rounded-sm flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-[#1F7A6C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-[#14181C] mb-2 tracking-tight">Create Account</h2>
          <p className="text-[#5B6770]">Join LabResource and start managing lab resources efficiently</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Full Name</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className={inputClass} placeholder="John Doe" />
            </div>
            <div>
              <label className={labelClass}>Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputClass} placeholder="you@institution.edu" />
            </div>
          </div>

          <div>
            <label className={labelClass}>Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className={inputClass}
              placeholder="9876543210"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Institution Name</label>
              <input
                type="text"
                name="institutionName"
                value={formData.institutionName}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Institution Code</label>
              <input
                type="text"
                name="institutionCode"
                value={formData.institutionCode}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Department</label>
              <input type="text" name="departmentName" value={formData.departmentName} onChange={handleChange} required className={inputClass} placeholder="Biology" />
            </div>
          </div>

          <div>
            <label className={labelClass}>Role</label>
            <select name="role" value={formData.role} required onChange={handleChange} className={inputClass}>
              <option value="" disabled>
                Select a role
              </option>
              {roleOptions.map((role) => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
          </div>

          {['LAB_TECHNICIAN', 'LAB_MANAGER'].includes(formData.role) && (
            <div>
              <label className={labelClass}>Lab Code</label>
              <input
                type="text"
                name="labCode"
                value={formData.labCode}
                onChange={handleChange}
                placeholder="Enter Lab Code"
                className={inputClass}
                required
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required autoComplete="new-password" className={inputClass} placeholder="Min 8 characters" />
            </div>
            <div>
              <label className={labelClass}>Confirm Password</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required autoComplete="new-password" className={inputClass} placeholder="Repeat password" />
            </div>
          </div>

          <div className="flex items-start gap-2">
            <input type="checkbox" required className="w-4 h-4 mt-0.5 rounded-sm border-[#D8D3C7] text-[#1F7A6C] focus:ring-[#1F7A6C]" />
            <span className="text-sm text-[#5B6770]">
              I agree to the <a href="#" className="text-[#1F7A6C] hover:underline">Terms of Service</a> and{' '}
              <a href="#" className="text-[#1F7A6C] hover:underline">Privacy Policy</a>
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#14181C] text-[#F6F5F1] font-mono text-sm tracking-wide uppercase rounded-sm hover:bg-[#2a2f35] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-[#5B6770] text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-[#1F7A6C] hover:text-[#175f54] font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage