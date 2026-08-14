import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import authService from "../../services/authService";

// Same token palette as the rest of the auth flow:
// ink #14181C · paper #F6F5F1 · steel #5B6770 · amber #E8A33D · teal #1F7A6C · line #D8D3C7

const inputClass =
  "w-full rounded-sm border border-[#D8D3C7] px-4 py-2.5 text-[#14181C] placeholder-[#5B6770]/60 focus:outline-none focus:border-[#1F7A6C] focus:ring-1 focus:ring-[#1F7A6C] transition-colors";
const labelClass = "block text-sm font-medium text-[#14181C] mb-2";

const RESEND_COOLDOWN_SECONDS = 30;

export default function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!email || !otp) {
      toast.error("Please enter email and OTP.");
      return;
    }

    setLoading(true);
    try {
      await authService.verifyEmail({ email, otp });
      toast.success("Email verified successfully.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Enter your email first.");
      return;
    }

    setResending(true);
    try {
      await authService.resendOtp({ email });
      toast.success("OTP sent successfully.");
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setResending(false);
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
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <h2 className="text-3xl font-black text-[#14181C] tracking-tight">Verify Email</h2>
          <p className="text-[#5B6770] mt-2">Enter the OTP sent to your email.</p>
        </div>

        <form onSubmit={handleVerify} className="space-y-5">
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className={inputClass}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#14181C] text-[#F6F5F1] font-mono text-sm tracking-wide uppercase rounded-sm hover:bg-[#2a2f35] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={resending || cooldown > 0}
            className="w-full border border-[#D8D3C7] rounded-sm py-3 text-[#14181C] font-mono text-sm tracking-wide uppercase hover:border-[#14181C]/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {resending ? "Sending..." : cooldown > 0 ? `Resend OTP (${cooldown}s)` : "Resend OTP"}
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