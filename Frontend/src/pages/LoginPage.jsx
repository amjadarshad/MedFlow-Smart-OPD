import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import {
  Plus,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Stethoscope,
} from "lucide-react";

import { useAuth } from "../context/AuthContext.jsx";
import { roleHomePaths } from "../config/navigation.js";

import { loginUser, registerUser } from "../services/authService.js";

import { authTabs, userRoles } from "../constants/authConstants.js";

import { getDepartments } from "../services/departmentService.js";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") === authTabs.create
      ? authTabs.create
      : authTabs.login,
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [accountType, setAccountType] = useState(
    searchParams.get("role") === userRoles.doctor
      ? userRoles.doctor
      : userRoles.patient,
  );

  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  // Doctor professional details
  const [departments, setDepartments] = useState([]);

  const [departmentId, setDepartmentId] = useState("");

  const [specialization, setSpecialization] = useState("");

  const [qualification, setQualification] = useState("");

  const [experience, setExperience] = useState("");

  const [consultationFee, setConsultationFee] = useState("");

  const [bio, setBio] = useState("");

  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);

  useEffect(() => {
    if (activeTab !== authTabs.create || accountType !== userRoles.doctor) {
      return;
    }

    const loadDepartments = async () => {
      try {
        setIsLoadingDepartments(true);
        setErrorMessage("");

        const data = await getDepartments();

        setDepartments(data.departments || []);
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message ||
            error.message ||
            "Unable to load departments.",
        );
      } finally {
        setIsLoadingDepartments(false);
      }
    };

    loadDepartments();
  }, [activeTab, accountType]);

  async function handleSubmit(event) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    const isCreatingAccount = activeTab === authTabs.create;

    if (
      isCreatingAccount &&
      accountType === userRoles.doctor &&
      (!departmentId || !specialization.trim() || !qualification.trim())
    ) {
      setErrorMessage(
        "Please complete the required doctor professional details.",
      );

      setIsSubmitting(false);
      return;
    }

    const body = isCreatingAccount
      ? {
          name: name.trim(),
          email: email.trim(),
          password,
          role: accountType,

          ...(accountType === userRoles.doctor && {
            department: departmentId,

            specialization: specialization.trim(),

            qualification: qualification.trim(),

            experience: Number(experience || 0),

            consultationFee: Number(consultationFee || 0),

            bio: bio.trim(),
          }),
        }
      : {
          email: email.trim(),
          password,
        };

    try {
      const data = isCreatingAccount
        ? await registerUser(body)
        : await loginUser(body);

      if (data.requiresApproval) {
        setSuccessMessage(
          data.message ||
            "Doctor account submitted for administrator approval.",
        );

        setPassword("");

        setActiveTab(authTabs.login);

        return;
      }

      if (data.token && data.user) {
        login(data.user, data.token);

        navigate(roleHomePaths[data.user.role] || "/dashboard");

        return;
      }

      setSuccessMessage(
        data.message ||
          "Account created. Please log in with your new credentials.",
      );

      setPassword("");

      setActiveTab(authTabs.login);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          "Unable to continue. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function switchTab(tab) {
    setActiveTab(tab);
    setErrorMessage("");

    if (tab === authTabs.create) {
      setSuccessMessage("");
    }
  }

  function handleAccountTypeChange(nextAccountType) {
    setAccountType(nextAccountType);

    setErrorMessage("");

    if (nextAccountType === userRoles.patient) {
      setDepartmentId("");
      setSpecialization("");
      setQualification("");
      setExperience("");
      setConsultationFee("");
      setBio("");
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

            <span className="font-display font-extrabold text-2xl text-white">
              MedFlow
            </span>
          </Link>

          <h1 className="font-display font-extrabold text-[34px] text-white leading-tight mb-3">
            Precision Care, Simplified.
          </h1>

          <p className="text-blue-100 text-[15px] leading-relaxed max-w-sm mb-10">
            Streamlining clinical workflows and patient experiences through
            intelligent OPD management systems.
          </p>

          <div className="flex gap-4">
            <div className="bg-white/15 rounded-xl px-5 py-4">
              <p className="font-display font-extrabold text-white text-[22px]">
                2k+
              </p>

              <p className="text-blue-100 text-[11px] font-semibold uppercase tracking-wide">
                Active Doctors
              </p>
            </div>

            <div className="bg-white/15 rounded-xl px-5 py-4">
              <p className="font-display font-extrabold text-white text-[22px]">
                150k+
              </p>

              <p className="text-blue-100 text-[11px] font-semibold uppercase tracking-wide">
                Patients Managed
              </p>
            </div>
          </div>
        </div>

        <div className="absolute -bottom-10 -left-10 -right-10 h-56 opacity-30">
          <svg width="100%" height="100%">
            <pattern
              id="dots"
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1.5" fill="white" />
            </pattern>

            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>
      </div>

      {/* RIGHT: form panel */}
      <div className="flex items-center justify-center p-8 lg:p-14">
        <div className="w-full max-w-md">
          <h2 className="font-display font-extrabold text-[28px] text-ink mb-2">
            {activeTab === authTabs.create
              ? "Create Your Account"
              : "Welcome Back"}
          </h2>

          <p className="text-slate-600 text-[14.5px] mb-8">
            Access your clinical dashboard to manage operations.
          </p>

          {/* Tabs */}
          <div className="flex border-b border-slate-200 mb-7">
            <button
              type="button"
              onClick={() => switchTab(authTabs.login)}
              className={`flex-1 pb-3 text-[13px] font-bold uppercase tracking-wide border-b-2 transition-colors ${
                activeTab === authTabs.login
                  ? "border-brand text-brand"
                  : "border-transparent text-slate-400"
              }`}
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => switchTab(authTabs.create)}
              className={`flex-1 pb-3 text-[13px] font-bold uppercase tracking-wide border-b-2 transition-colors ${
                activeTab === authTabs.create
                  ? "border-brand text-brand"
                  : "border-transparent text-slate-400"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error */}
          {errorMessage && (
            <div
              role="alert"
              className="bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 mb-5"
            >
              <p className="text-[13px] text-red-700 font-medium">
                {errorMessage}
              </p>
            </div>
          )}

          {/* Success */}
          {successMessage && (
            <div
              role="status"
              className="bg-mint-light border border-emerald-200 rounded-lg px-4 py-2.5 mb-5"
            >
              <p className="text-[13px] text-emerald-700 font-medium">
                {successMessage}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {activeTab === authTabs.create && (
              <>
                {/* Full Name */}
                <div>
                  <label className="block text-[12px] font-bold uppercase tracking-wide text-slate-500 mb-2">
                    Full Name
                  </label>

                  <div className="flex items-center gap-2.5 bg-slate-100 rounded-lg px-4 py-3">
                    <User size={17} className="text-slate-400 shrink-0" />

                    <input
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Dr. Jane Smith"
                      className="bg-transparent outline-none text-[14px] flex-1 placeholder:text-slate-400"
                      required
                    />
                  </div>
                </div>

                {/* Account type */}
                <fieldset>
                  <legend className="block text-[12px] font-bold uppercase tracking-wide text-slate-500 mb-3">
                    Account Type
                  </legend>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        id: userRoles.patient,
                        label: "Patient",
                        icon: User,
                      },
                      {
                        id: userRoles.doctor,
                        label: "Doctor",
                        icon: Stethoscope,
                      },
                    ].map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        type="button"
                        aria-pressed={accountType === id}
                        onClick={() => handleAccountTypeChange(id)}
                        className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-3 text-sm font-semibold transition-colors ${
                          accountType === id
                            ? "border-brand bg-brand-light text-brand"
                            : "border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        <Icon size={17} />

                        {label}
                      </button>
                    ))}
                  </div>
                </fieldset>

                {/* Doctor fields */}
                {accountType === userRoles.doctor && (
                  <div className="flex flex-col gap-5">
                    {/* Department */}
                    <div>
                      <label className="block text-[12px] font-bold uppercase tracking-wide text-slate-500 mb-2">
                        Department
                      </label>

                      <select
                        value={departmentId}
                        onChange={(event) =>
                          setDepartmentId(event.target.value)
                        }
                        disabled={isLoadingDepartments}
                        required
                        className="w-full bg-slate-100 rounded-lg px-4 py-3 text-[14px] outline-none border border-transparent focus:border-brand disabled:opacity-60"
                      >
                        <option value="">
                          {isLoadingDepartments
                            ? "Loading departments..."
                            : "Select department"}
                        </option>

                        {departments.map((department) => (
                          <option key={department._id} value={department._id}>
                            {department.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Specialization */}
                    <div>
                      <label className="block text-[12px] font-bold uppercase tracking-wide text-slate-500 mb-2">
                        Specialization
                      </label>

                      <input
                        type="text"
                        value={specialization}
                        onChange={(event) =>
                          setSpecialization(event.target.value)
                        }
                        placeholder="e.g. Interventional Cardiology"
                        required
                        className="w-full bg-slate-100 rounded-lg px-4 py-3 text-[14px] outline-none border border-transparent focus:border-brand"
                      />
                    </div>

                    {/* Qualification */}
                    <div>
                      <label className="block text-[12px] font-bold uppercase tracking-wide text-slate-500 mb-2">
                        Qualification
                      </label>

                      <input
                        type="text"
                        value={qualification}
                        onChange={(event) =>
                          setQualification(event.target.value)
                        }
                        placeholder="e.g. MBBS, FCPS"
                        required
                        className="w-full bg-slate-100 rounded-lg px-4 py-3 text-[14px] outline-none border border-transparent focus:border-brand"
                      />
                    </div>

                    {/* Experience + fee */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[12px] font-bold uppercase tracking-wide text-slate-500 mb-2">
                          Experience
                        </label>

                        <input
                          type="number"
                          min="0"
                          value={experience}
                          onChange={(event) =>
                            setExperience(event.target.value)
                          }
                          placeholder="Years"
                          className="w-full bg-slate-100 rounded-lg px-4 py-3 text-[14px] outline-none border border-transparent focus:border-brand"
                        />
                      </div>

                      <div>
                        <label className="block text-[12px] font-bold uppercase tracking-wide text-slate-500 mb-2">
                          Consultation Fee
                        </label>

                        <input
                          type="number"
                          min="0"
                          value={consultationFee}
                          onChange={(event) =>
                            setConsultationFee(event.target.value)
                          }
                          placeholder="2500"
                          className="w-full bg-slate-100 rounded-lg px-4 py-3 text-[14px] outline-none border border-transparent focus:border-brand"
                        />
                      </div>
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block text-[12px] font-bold uppercase tracking-wide text-slate-500 mb-2">
                        Professional Bio
                      </label>

                      <textarea
                        value={bio}
                        onChange={(event) => setBio(event.target.value)}
                        rows={3}
                        placeholder="Short professional introduction..."
                        className="w-full resize-none bg-slate-100 rounded-lg px-4 py-3 text-[14px] outline-none border border-transparent focus:border-brand"
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Email */}
            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wide text-slate-500 mb-2">
                Email Address
              </label>

              <div className="flex items-center gap-2.5 bg-slate-100 rounded-lg px-4 py-3">
                <Mail size={17} className="text-slate-400 shrink-0" />

                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="dr.smith@medflow.com"
                  className="bg-transparent outline-none text-[14px] flex-1 placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wide text-slate-500 mb-2">
                Password
              </label>

              <div className="flex items-center gap-2.5 bg-slate-100 rounded-lg px-4 py-3">
                <Lock size={17} className="text-slate-400 shrink-0" />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="bg-transparent outline-none text-[14px] flex-1 placeholder:text-slate-400"
                  required
                />

                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() =>
                    setShowPassword((previousValue) => !previousValue)
                  }
                >
                  {showPassword ? (
                    <EyeOff size={17} className="text-slate-400" />
                  ) : (
                    <Eye size={17} className="text-slate-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className="flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark text-white font-semibold text-[15px] py-3.5 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "Please wait..."
                : activeTab === authTabs.create
                  ? accountType === userRoles.doctor
                    ? "Submit Doctor Request"
                    : "Create Patient Account"
                  : "Secure Login"}

              {!isSubmitting && <ArrowRight size={17} />}
            </button>
          </form>

          <p className="mt-6 text-center text-[12.5px] text-slate-500">
            Portfolio demonstration — patients can create accounts directly,
            while doctor accounts require administrator approval.
          </p>
        </div>
      </div>
    </div>
  );
}
