import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Plus, Mail, Lock, Eye, EyeOff, ArrowRight, User, BriefcaseMedical, ShieldCheck, Chrome, Facebook } from "lucide-react";
import { loginRoles as ROLES } from "../data/allData.js";
import { useAuth } from "../context/AuthContext.jsx";
import { API_BASE_URL } from "../../config/api.js";


export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();

 const [activeTab, setActiveTab] = useState(
  searchParams.get("tab") === "create" ? "create" : "login"
);

const validRoles = ["patient", "doctor", "admin"];
const roleFromUrl = searchParams.get("role");
const [role, setRole] = useState(
  validRoles.includes(roleFromUrl) ? roleFromUrl : "patient"
);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const ROLE_HOME_PATHS = {
    patient: "/dashboard",
    doctor: "/dashboard/appointments",
    admin: "/dashboard/admin",
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    const isCreatingAccount = activeTab === "create";
    const endpoint = isCreatingAccount ? "/auth/register" : "/auth/login";
    const body = isCreatingAccount
      ? { name, email, password, role }
      : { email, password };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Something went wrong. Please try again.");
        return;
      }

      // The backend is the source of truth for the account's role —
      // use data.user.role to decide where to send them, not the button they clicked.
      login(data.user, data.token);
      navigate(ROLE_HOME_PATHS[data.user.role] || "/dashboard");
    } catch (error) {
      setErrorMessage("Couldn't reach the server. Is the backend running on port 5000?");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSocialLogin(provider) {
    setInfoMessage(`${provider} login isn't set up in this demo — please use the email/password form above.`);
    setTimeout(() => setInfoMessage(""), 4000);
  }

  function handleForgotPassword(e) {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    setResetSent(true);
  }

  function closeForgotModal() {
    setIsForgotOpen(false);
    setResetSent(false);
    setResetEmail("");
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* LEFT: brand panel */}
      <div className="relative overflow-hidden bg-brand flex flex-col justify-between p-10 lg:p-14">
        <div>
          <Link to="/" className="inline-flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-lg border-2 border-white flex items-center justify-center">
              <Plus size={20} className="text-white" />
            </div>
            <span className="font-display font-extrabold text-2xl text-white">MedFlow</span>
          </Link>

          <h1 className="font-display font-extrabold text-[34px] text-white leading-tight mb-3">
            Precision Care, Simplified.
          </h1>
          <p className="text-blue-100 text-[15px] leading-relaxed max-w-sm mb-10">
            Streamlining clinical workflows and patient experiences through intelligent OPD
            management systems.
          </p>

          <div className="flex gap-4">
            <div className="bg-white/15 rounded-xl px-5 py-4">
              <p className="font-display font-extrabold text-white text-[22px]">2k+</p>
              <p className="text-blue-100 text-[11px] font-semibold uppercase tracking-wide">
                Active Doctors
              </p>
            </div>
            <div className="bg-white/15 rounded-xl px-5 py-4">
              <p className="font-display font-extrabold text-white text-[22px]">150k+</p>
              <p className="text-blue-100 text-[11px] font-semibold uppercase tracking-wide">
                Patients Managed
              </p>
            </div>
          </div>
        </div>

        <div className="absolute -bottom-10 -left-10 -right-10 h-56 opacity-30">
          <svg width="100%" height="100%">
            <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="white" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>
      </div>

      {/* RIGHT: form panel */}
      <div className="flex items-center justify-center p-8 lg:p-14">
        <div className="w-full max-w-md">
          <h2 className="font-display font-extrabold text-[28px] text-ink mb-2">Welcome Back</h2>
          <p className="text-slate-600 text-[14.5px] mb-8">
            Access your clinical dashboard to manage operations.
          </p>

          <div className="flex border-b border-slate-200 mb-7">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 pb-3 text-[13px] font-bold uppercase tracking-wide border-b-2 transition-colors ${
                activeTab === "login" ? "border-brand text-brand" : "border-transparent text-slate-400"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab("create")}
              className={`flex-1 pb-3 text-[13px] font-bold uppercase tracking-wide border-b-2 transition-colors ${
                activeTab === "create" ? "border-brand text-brand" : "border-transparent text-slate-400"
              }`}
            >
              Create Account
            </button>
          </div>

          {infoMessage && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 mb-5">
              <p className="text-[13px] text-amber-700 font-medium">{infoMessage}</p>
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 mb-5">
              <p className="text-[13px] text-red-700 font-medium">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {activeTab === "create" && (
              <>
                <div>
                  <label className="block text-[12px] font-bold uppercase tracking-wide text-slate-500 mb-2">
                    Full Name
                  </label>
                  <div className="flex items-center gap-2.5 bg-slate-100 rounded-lg px-4 py-3">
                    <User size={17} className="text-slate-400 shrink-0" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Dr. Jane Smith"
                      className="bg-transparent outline-none text-[14px] flex-1 placeholder:text-slate-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-bold uppercase tracking-wide text-slate-500 mb-3">
                    Select Your Role
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {ROLES.map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setRole(id)}
                        className={`flex flex-col items-center gap-1.5 py-3 rounded-lg border transition-colors ${
                          role === id
                            ? "border-brand bg-brand-light text-brand"
                            : "border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        <Icon size={18} />
                        <span className="text-[13px] font-medium">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wide text-slate-500 mb-2">
                Email Address
              </label>
              <div className="flex items-center gap-2.5 bg-slate-100 rounded-lg px-4 py-3">
                <Mail size={17} className="text-slate-400 shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="dr.smith@medflow.com"
                  className="bg-transparent outline-none text-[14px] flex-1 placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wide text-slate-500 mb-2">
                Password
              </label>
              <div className="flex items-center gap-2.5 bg-slate-100 rounded-lg px-4 py-3">
                <Lock size={17} className="text-slate-400 shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-transparent outline-none text-[14px] flex-1 placeholder:text-slate-400"
                  required
                />
                <button type="button" onClick={() => setShowPassword((prev) => !prev)}>
                  {showPassword ? (
                    <EyeOff size={17} className="text-slate-400" />
                  ) : (
                    <Eye size={17} className="text-slate-400" />
                  )}
                </button>
              </div>
              <div className="text-right mt-2">
                <button
                  type="button"
                  onClick={() => setIsForgotOpen(true)}
                  className="text-[13px] font-medium text-brand hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark text-white font-semibold text-[15px] py-3.5 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "Please wait..."
                : activeTab === "create"
                ? "Create Account"
                : "Secure Login"}
              {!isSubmitting && <ArrowRight size={17} />}
            </button>
          </form>

          <div className="flex items-center gap-3 my-7">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
              Or continue with
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-8">
            <button
              onClick={() => handleSocialLogin("Google")}
              className="flex items-center justify-center gap-2 border border-slate-200 rounded-lg py-3 hover:bg-slate-50 transition-colors"
            >
              <Chrome size={17} className="text-slate-600" />
              <span className="text-[14px] font-medium text-ink">Google</span>
            </button>
            <button
              onClick={() => handleSocialLogin("Facebook")}
              className="flex items-center justify-center gap-2 border border-slate-200 rounded-lg py-3 hover:bg-slate-50 transition-colors"
            >
              <Facebook size={17} className="text-brand" />
              <span className="text-[14px] font-medium text-ink">Facebook</span>
            </button>
          </div>

          <p className="text-center text-[13px] text-slate-500">
            By continuing, you agree to MedFlow's{" "}
            <a href="#terms" className="text-brand hover:underline">Terms of Service</a> and{" "}
            <a href="#privacy" className="text-brand hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </div>

      {/* Forgot Password modal */}
      {isForgotOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-sm p-6">
            {!resetSent ? (
              <>
                <h2 className="font-display font-extrabold text-[16px] text-ink mb-1">Reset Password</h2>
                <p className="text-slate-500 text-[13px] mb-4">
                  Enter your account email and we'll send a reset link.
                </p>
                <form onSubmit={handleForgotPassword} className="flex flex-col gap-4">
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-[13.5px] outline-none focus:border-brand"
                    required
                  />
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={closeForgotModal}
                      className="flex-1 border border-slate-300 text-slate-600 font-semibold text-[13.5px] py-2.5 rounded-lg hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-brand hover:bg-brand-dark text-white font-semibold text-[13.5px] py-2.5 rounded-lg"
                    >
                      Send Reset Link
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h2 className="font-display font-extrabold text-[16px] text-ink mb-1">Check your inbox</h2>
                <p className="text-slate-500 text-[13.5px] mb-5">
                  If an account exists for {resetEmail}, a password reset link has been sent.
                </p>
                <button
                  onClick={closeForgotModal}
                  className="w-full bg-brand hover:bg-brand-dark text-white font-semibold text-[13.5px] py-2.5 rounded-lg"
                >
                  Done
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}