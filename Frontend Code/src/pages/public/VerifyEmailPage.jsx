import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import authService from "../../services/authService";

export default function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const verify = async () => {
    if (!email || !otp) {
      toast.error("Please enter email and OTP.");
      return;
    }

    setLoading(true);

    try {
      await authService.verifyEmail({
        email,
        otp,
      });

      toast.success("Email verified successfully.");

      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (!email) {
      toast.error("Enter your email first.");
      return;
    }

    try {
      await authService.resendOtp({
        email,
      });

      toast.success("OTP sent successfully.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-8">

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900">
            Verify Email
          </h2>

          <p className="text-slate-500 mt-2">
            Enter the OTP sent to your email.
          </p>
        </div>

        <div className="space-y-5">

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              OTP
            </label>

            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="input-field"
            />
          </div>

          <button
            onClick={verify}
            disabled={loading}
            className="w-full btn-primary py-3 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>

          <button
            type="button"
            onClick={resend}
            className="w-full border border-slate-300 rounded-xl py-3 hover:bg-slate-50"
          >
            Resend OTP
          </button>

        </div>
      </div>
    </div>
  );
}