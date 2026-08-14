import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import authService from "../../services/authService";

// Same token palette as Login/Register/ForgotPassword:
// ink #14181C · paper #F6F5F1 · steel #5B6770 · amber #E8A33D · teal #1F7A6C · line #D8D3C7

const inputClass =
  "w-full rounded-sm border border-[#D8D3C7] px-4 py-2.5 text-[#14181C] placeholder-[#5B6770]/60 focus:outline-none focus:border-[#1F7A6C] focus:ring-1 focus:ring-[#1F7A6C] transition-colors";
const readOnlyClass = "w-full rounded-sm border border-[#D8D3C7] px-4 py-2.5 text-[#5B6770] bg-[#F6F5F1] cursor-not-allowed";
const labelClass = "block text-sm font-medium text-[#14181C] mb-2";

export default function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: location.state?.email || "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword({
        email: form.email,
        otp: form.otp,
        newPassword: form.newPassword,
      });

      toast.success("Password reset successfully.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  // Without an email carried over via router state (e.g. someone lands
  // here directly, refreshes, or follows a stale link), the email field
  // would previously render blank AND read-only — a dead end with no way
  // to type it in. Send them back to request a fresh OTP instead.
  if (!location.state?.email) {
    return (
      <div className="min-h-screen bg-[#F6F5F1] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-sm shadow-xl border border-[#D8D3C7] p-8 text-center">
          <h2 className="text-2xl font-black text-[#14181C] tracking-tight mb-2">Reset link expired</h2>
          <p className="text-[#5B6770] mb-6">
            We couldn't find an email for this password reset. Please request a new OTP.
          </p>
          <Link
            to="/forgot-password"
            className="inline-block px-6 py-3 bg-[#14181C] text-[#F6F5F1] font-mono text-sm tracking-wide uppercase rounded-sm hover:bg-[#2a2f35] transition-colors"
          >
            Request New OTP
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F5F1] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-sm shadow-xl border border-[#D8D3C7] p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 border border-[#14181C]/15 rounded-sm flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-[#1F7A6C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2h-1V9a5 5 0 00-10 0v2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
              />
            </svg>
          </div>

          <h2 className="text-3xl font-black text-[#14181C] tracking-tight">Reset Password</h2>
          <p className="text-[#5B6770] mt-2">Enter the OTP and choose a new password.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" name="email" value={form.email} readOnly className={readOnlyClass} />
          </div>

          <div>
            <label className={labelClass}>OTP</label>
            <input
              type="text"
              name="otp"
              value={form.otp}
              onChange={handleChange}
              placeholder="Enter OTP"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>New Password</label>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="Min 8 characters"
              minLength={8}
              autoComplete="new-password"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat new password"
              minLength={8}
              autoComplete="new-password"
              className={inputClass}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#14181C] text-[#F6F5F1] font-mono text-sm tracking-wide uppercase rounded-sm hover:bg-[#2a2f35] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="mt-6 text-center text-[#5B6770] text-sm">
          <Link to="/login" className="text-[#1F7A6C] hover:text-[#175f54] font-medium transition-colors">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}