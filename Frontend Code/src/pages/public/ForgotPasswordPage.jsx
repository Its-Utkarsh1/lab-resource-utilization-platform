import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import authService from "../../services/authService";

// Same token palette as Login/Register:
// ink #14181C · paper #F6F5F1 · steel #5B6770 · amber #E8A33D · teal #1F7A6C · line #D8D3C7

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.forgotPassword({ email });
      toast.success("OTP sent successfully.");
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

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
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2h-1V9a5 5 0 00-10 0v2H6a2 2 0 00-2 2v6a2 2 0 002 2zm3-10V9a3 3 0 016 0v2H9z"
              />
            </svg>
          </div>

          <h2 className="text-3xl font-black text-[#14181C] tracking-tight">Forgot Password</h2>
          <p className="text-[#5B6770] mt-2">Enter your registered email to receive an OTP.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#14181C] mb-2">Email Address</label>
            <input
              type="email"
              className="w-full rounded-sm border border-[#D8D3C7] px-4 py-2.5 text-[#14181C] placeholder-[#5B6770]/60 focus:outline-none focus:border-[#1F7A6C] focus:ring-1 focus:ring-[#1F7A6C] transition-colors"
              placeholder="you@institution.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#14181C] text-[#F6F5F1] font-mono text-sm tracking-wide uppercase rounded-sm hover:bg-[#2a2f35] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

        <p className="mt-6 text-center text-[#5B6770] text-sm">
          Remembered your password?{" "}
          <Link to="/login" className="text-[#1F7A6C] hover:text-[#175f54] font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}