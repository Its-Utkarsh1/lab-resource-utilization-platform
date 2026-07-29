import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { ROLES } from '../../utils/roles'
import toast from 'react-hot-toast'
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    role: "",
    institutionName: "",
    institutionCode: "",
    departmentName: "",
    labCode: "",
  });
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate();

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
      const { confirmPassword, ...request } = formData;

      await register(request);

      toast.success("Account created successfully. Please verify your email.");

      navigate("/verify-email", {
        state: {
          email: formData.email,
        },
      });

    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  const roleOptions = [
    { value: "SYSTEM_ADMIN", label: "System Admin" },
    { value: "INSTITUTION_ADMIN", label: "Institution Admin" },
    { value: "DEPARTMENT_HEAD", label: "Department Head" },
    { value: "PROFESSOR", label: "Professor" },
    { value: "ASSOCIATE_PROFESSOR", label: "Associate Professor" },
    { value: "ASSISTANT_PROFESSOR", label: "Assistant Professor" },
    { value: "RESEARCH_SCIENTIST", label: "Research Scientist" },
    { value: "RESEARCH_ASSOCIATE", label: "Research Associate" },
    { value: "LAB_MANAGER", label: "Lab Manager" },
    { value: "LAB_TECHNICIAN", label: "Lab Technician" },
    { value: "RESEARCHER", label: "Researcher" },
    { value: "STUDENT", label: "Student" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 p-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h2>
          <p className="text-slate-500">Join LabResource and start managing lab resources efficiently</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="input-field" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="input-field" placeholder="you@institution.edu" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Phone Number
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="9876543210"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Institution Name
                </label>
                <input
                  type="text"
                  name="institutionName"
                  value={formData.institutionName}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Institution Code
                </label>
                <input
                  type="text"
                  name="institutionCode"
                  value={formData.institutionCode}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Department</label>
              <input type="text" name="departmentName" value={formData.departmentName} onChange={handleChange} required className="input-field" placeholder="Biology" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
            <select name="role" value={formData.role} required onChange={handleChange} className="input-field">
              {roleOptions.map((role) => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
          </div>

          {["LAB_TECHNICIAN", "LAB_MANAGER"].includes(formData.role) && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Lab Code
              </label>

              <input
                type="text"
                name="labCode"
                value={formData.labCode}
                onChange={handleChange}
                placeholder="Enter Lab Code"
                className="input-field"
                required
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required className="input-field" placeholder="Min 8 characters" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="input-field" placeholder="Repeat password" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" required className="w-4 h-4 rounded border-slate-300 text-green-500 focus:ring-green-500" />
            <span className="text-sm text-slate-600">I agree to the <a href="#" className="text-green-600 hover:underline">Terms of Service</a> and <a href="#" className="text-green-600 hover:underline">Privacy Policy</a></span>
          </div>

          <button type="submit" disabled={loading} className="w-full btn-primary py-3.5 disabled:opacity-50">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-slate-500 text-sm">
          Already have an account? <Link to="/login" className="text-green-600 hover:text-green-700 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
