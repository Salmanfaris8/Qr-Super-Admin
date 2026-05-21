import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Smartphone, ArrowLeft, Check, Loader2, AlertCircle } from "lucide-react";
import { OTPInput } from "input-otp";
import axios from "axios";
import { useNavigate } from "react-router";

type Step = "credentials" | "otp" | "success";
type Page = "login" | "home";

interface AuthToken {
  token: string;
  expiresAt: string;
  adminId: string;
  role: string;
}

interface Admin {
  id: string;
  email: string;
  role: string;
}

// Storage keys
const TOKEN_KEY = "token";
const ADMIN_KEY = "admin";
const EXPIRES_KEY = "token_expires_at";

// Utility: Save token to localStorage
const saveToken = (token: string, admin: Admin) => {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 1 day
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
  localStorage.setItem(EXPIRES_KEY, expiresAt);
};

// Utility: Get token from localStorage
const getToken = (): AuthToken | null => {
  const token = localStorage.getItem(TOKEN_KEY);
  const admin = localStorage.getItem(ADMIN_KEY);
  const expiresAt = localStorage.getItem(EXPIRES_KEY);

  if (!token || !admin || !expiresAt) return null;

  // Check if token expired
  if (new Date() > new Date(expiresAt)) {
    clearToken();
    return null;
  }

  return {
    token,
    expiresAt,
    ...JSON.parse(admin),
  };
};

// Utility: Clear token from localStorage
const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ADMIN_KEY);
  localStorage.removeItem(EXPIRES_KEY);
};

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const [page, setPage] = useState<Page>("login");
  const [step, setStep] = useState<Step>("credentials");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [admin, setAdmin] = useState<Admin | null>(null);

  const navigate = useNavigate();

  // Check if user is already logged in on mount
  useEffect(() => {
    const savedToken = getToken();
    if (savedToken) {
      setAdmin({
        id: savedToken.adminId,
        email: savedToken.token,
        role: savedToken.role,
      });
      setPage("home");
    }
  }, []);

  const handleCredentialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/superadmin/send-otp`,
        { email }
      );

      setStep("otp");
      setError("");
    } catch (err) {
  if (axios.isAxiosError(err)) {
    setError(err.response?.data?.message || err.message);
  } else {
    setError("An unexpected error occurred");
  }
} finally {
      setLoading(false);
    }
  };

  const handleOtpComplete = async (value: string) => {
    setOtp(value);

    if (value.length === 6) {
      setLoading(true);
      setError("");

      try {
        const { data } = await axios.post(
          `${API_BASE_URL}/superadmin/verify-otp`,
          { email, otp: value }
        );

        // Save token and admin data
        saveToken(data.token, data.admin);
        setAdmin(data.admin);
        setStep("success");

        // redirect after small delay (optional)
        setTimeout(() => {
          navigate("/dashboard"); // ✅ your dashboard route
        }, 1500);
      } catch (err) {
  if (axios.isAxiosError(err)) {
    setError(err.response?.data?.message || "Invalid OTP");
  } else {
    setError("An unexpected error occurred");
  }
  setOtp("");
} finally {
        setLoading(false);
      }
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend OTP");
      }

      setOtp("");
      setError("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to resend OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (step === "success") {
      // Redirect to home after 2 seconds
      const timer = setTimeout(() => {
        setPage("home");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleBack = () => {
    if (step === "otp") {
      setStep("credentials");
      setOtp("");
      setError("");
    }
  };

  const handleLogout = () => {
    clearToken();
    setPage("login");
    setStep("credentials");
    setEmail("");
    setMobile("");
    setOtp("");
    setAdmin(null);
    setError("");
  };

  // if (page === "home" && admin) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
  //       <div className="max-w-6xl mx-auto p-8">
  //         <motion.div
  //           initial={{ opacity: 0, y: -20 }}
  //           animate={{ opacity: 1, y: 0 }}
  //           className="flex items-center justify-between mb-12"
  //         >
  //           <h1 className="text-3xl font-semibold text-blue-600">Hotel Admin</h1>
  //           <button
  //             onClick={handleLogout}
  //             className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
  //           >
  //             Logout
  //           </button>
  //         </motion.div>

  //         <motion.div
  //           initial={{ opacity: 0, y: 20 }}
  //           animate={{ opacity: 1, y: 0 }}
  //           transition={{ delay: 0.2 }}
  //           className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8"
  //         >
  //           <h2 className="text-2xl font-semibold mb-4">Welcome to Your Dashboard</h2>
  //           <div className="space-y-4 text-gray-600">
  //             <p>You have successfully logged in with:</p>
  //             <div className="bg-gray-50 rounded-lg p-4 space-y-2">
  //               <div className="flex items-center gap-2">
  //                 <Mail className="w-4 h-4 text-blue-600" />
  //                 <span className="font-medium text-gray-900">{admin.email}</span>
  //               </div>
  //               <div className="flex items-center gap-2">
  //                 <Smartphone className="w-4 h-4 text-blue-600" />
  //                 <span className="font-medium text-gray-900 capitalize">
  //                   {admin.role}
  //                 </span>
  //               </div>
  //             </div>

  //             {/* Token Expiry Info */}
  //             <motion.div
  //               initial={{ opacity: 0 }}
  //               animate={{ opacity: 1 }}
  //               transition={{ delay: 0.3 }}
  //               className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
  //             >
  //               <p className="text-sm text-blue-900">
  //                 <span className="font-medium">Session expires in:</span>
  //                 <ExpiryTimer />
  //               </p>
  //             </motion.div>
  //           </div>
  //         </motion.div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-semibold tracking-tight text-blue-600 mb-2"
            >
              Super Admin
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-600"
            >
              {step === "credentials" && "Login or Signup"}
              {step === "otp" && "Enter verification code"}
              {step === "success" && "Welcome back!"}
            </motion.p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </motion.div>
          )}

          {/* Back button */}
          {step === "otp" && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </motion.button>
          )}

          <AnimatePresence mode="wait">
            {/* Credentials Input */}
            {step === "credentials" && (
              <motion.form
                key="credentials"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleCredentialSubmit}
                className="space-y-5"
              >
                <div>
                  <label className="block mb-2 text-gray-900 font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email "
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    autoFocus
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-gray-900 font-medium flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-blue-600" />
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="Enter your mobile number"
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>
              </motion.form>
            )}

            {/* OTP Input */}
            {step === "otp" && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <p className="text-center text-sm text-gray-600 mb-6">
                    We sent a verification code to{" "}
                    <span className="text-gray-900 font-medium">{email}</span>
                  </p>

                  <div className="flex justify-center gap-2">
                    <OTPInput
                      maxLength={6}
                      value={otp}
                      onChange={handleOtpComplete}
                      autoFocus
                      containerClassName="flex gap-2"
                      render={({ slots }) => (
                        <>
                          {slots.map((slot, idx) => (
                            <div
                              key={idx}
                              className={`w-12 h-14 border-2 rounded-lg flex items-center justify-center text-xl font-medium transition-all ${
                                slot.isActive
                                  ? "border-blue-600 ring-2 ring-blue-200"
                                  : "border-gray-300"
                              }`}
                            >
                              {slot.char !== null && <div>{slot.char}</div>}
                              {slot.hasFakeCaret && (
                                <div className="w-0.5 h-6 bg-blue-600 animate-pulse" />
                              )}
                            </div>
                          ))}
                        </>
                      )}
                    />
                  </div>
                </div>

                <button
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="w-full text-blue-600 hover:text-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {loading ? "Resending..." : "Resend code"}
                </button>
              </motion.div>
            )}

            {/* Success */}
            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Check className="w-10 h-10 text-white" />
                </motion.div>

                <h2 className="text-2xl font-semibold mb-2">Verification Successful!</h2>
                <p className="text-gray-600 mb-6">Redirecting to home...</p>

                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="flex justify-center"
                >
                  <Loader2 className="w-8 h-8 text-blue-600" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-gray-600 mt-6"
        >
          New user? Your account will be created automatically
        </motion.p>
      </motion.div>
    </div>
  );
}

// Component to display expiry timer
function ExpiryTimer() {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateTimer = () => {
      const expiresAt = localStorage.getItem(EXPIRES_KEY);
      if (!expiresAt) return;

      const now = new Date();
      const expiry = new Date(expiresAt);
      const diff = expiry.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("expired");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft(`${hours}h ${minutes}m`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return <span className="ml-2 text-blue-700 font-semibold">{timeLeft || "calculating..."}</span>;
}