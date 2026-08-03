import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Plus, Mail, Lock, Eye, EyeOff, ArrowRight, User, BriefcaseMedical, ShieldCheck, Chrome, Facebook } from "lucide-react";
import { loginRoles as ROLES } from "../data/allData.js";


export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

 const [activeTab, setActiveTab] = useState(
  searchParams.get("tab") === "create" ? "create" : "login"
);

const validRoles = ["patient", "doctor", "admin"];
const roleFromUrl = searchParams.get("role");
const [role, setRole] = useState(
  validRoles.includes(roleFromUrl) ? roleFromUrl : "patient"
);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (role === "patient") {
      navigate("/dashboard");
    } else if (role === "doctor") {
      navigate("/dashboard/appointments");
    } else if (role === "admin") {
      navigate("/dashboard/admin");
    }
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

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
                <a href="#forgot" className="text-[13px] font-medium text-brand hover:underline">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark text-white font-semibold text-[15px] py-3.5 rounded-lg transition-colors"
            >
              Secure Login <ArrowRight size={17} />
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
            <button className="flex items-center justify-center gap-2 border border-slate-200 rounded-lg py-3 hover:bg-slate-50 transition-colors">
              <Chrome size={17} className="text-slate-600" />
              <span className="text-[14px] font-medium text-ink">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 border border-slate-200 rounded-lg py-3 hover:bg-slate-50 transition-colors">
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
    </div>
  );
}