import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import { setCredentials } from "../redux/authSlice";
import { FiUser, FiMail, FiLock, FiArrowRight, FiBriefcase, FiShield, FiTrendingUp, FiZap } from "react-icons/fi";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "investor",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await api.post("/api/auth/register", data);
      dispatch(setCredentials(response.data.data));
      toast.success("Account created successfully! Welcome to Sikka.");
      navigate("/dashboard");
    } catch (err) {
      // Axios interceptor will toast validation errors
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-130px)] flex items-center justify-center px-4 py-12 overflow-hidden bg-[#F5F7FA]">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#123B5D]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Feature Showcase - Deep Navy Blue Component */}
        <div className="hidden md:flex flex-col justify-between space-y-6 p-8 rounded-3xl border border-[#0D2A42] bg-[#123B5D] shadow-xl text-white">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D2A42] border border-[#16A36A]/40 text-[#4ADE80] text-xs font-bold uppercase tracking-wider mb-4">
              <FiShield className="w-3.5 h-3.5 text-[#16A36A]" /> Start In Under 60 Seconds
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white font-outfit">
              Join Thousands Of <br />
              <span className="text-[#4ADE80]">Smart Micro-Investors.</span>
            </h1>
            <p className="mt-3 text-sm text-[#94A3B8] leading-relaxed">
              Automate your spare change savings, track target goals, and receive customized portfolio guidance.
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-[#1E5380]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#0D2A42] text-[#4ADE80] border border-[#16A36A]/30">
                <FiZap className="w-4 h-4 text-[#16A36A]" />
              </div>
              <span className="text-xs font-semibold text-white">Automated UPI & Bank Round-ups</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#0D2A42] text-[#4ADE80] border border-[#16A36A]/30">
                <FiTrendingUp className="w-4 h-4 text-[#16A36A]" />
              </div>
              <span className="text-xs font-semibold text-white">Risk-Adjusted Algo Portfolios</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#0D2A42] text-[#4ADE80] border border-[#16A36A]/30">
                <FiShield className="w-4 h-4 text-[#16A36A]" />
              </div>
              <span className="text-xs font-semibold text-white">Bank-Grade 256-Bit Security</span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#1E5380]">
            <div className="p-3 rounded-2xl bg-[#0D2A42] border border-[#16A36A]/30 flex items-center justify-between text-xs">
              <span className="text-[#94A3B8]">Average Annual Roundup Growth</span>
              <span className="font-extrabold text-[#4ADE80]">+14.8% CAGR</span>
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="p-8 rounded-3xl border border-[#E2E8F0] bg-white shadow-sm space-y-6">
          <div className="text-center md:text-left">
            <div className="mx-auto md:mx-0 w-12 h-12 rounded-2xl bg-[#DCFCE7] border border-[#BBF7D0] flex items-center justify-center text-[#16A36A] mb-4 shadow-sm">
              <FiUser className="w-6 h-6 text-[#16A36A]" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[#123B5D] font-outfit">
              Create Free Account
            </h2>
            <p className="mt-1 text-xs text-[#64748B]">
              Fill in your details below to activate your Sikka portfolio
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
                  First Name
                </label>
                <input
                  type="text"
                  {...register("firstName", {
                    required: "First name is required",
                    pattern: {
                      value: /^[A-Za-z -]+$/i,
                      message: "Only letters allowed",
                    },
                  })}
                  className={`block w-full px-3.5 py-2.5 bg-white border ${
                    errors.firstName ? "border-red-500" : "border-[#E2E8F0]"
                  } placeholder-[#94A3B8] text-[#1F2937] text-sm rounded-xl focus:outline-none focus:border-[#16A36A] focus:ring-1 focus:ring-[#16A36A] transition-all`}
                  placeholder="Aman"
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-[#DC2626] font-medium">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  {...register("lastName", {
                    required: "Last name is required",
                    pattern: {
                      value: /^[A-Za-z -]+$/i,
                      message: "Only letters allowed",
                    },
                  })}
                  className={`block w-full px-3.5 py-2.5 bg-white border ${
                    errors.lastName ? "border-red-500" : "border-[#E2E8F0]"
                  } placeholder-[#94A3B8] text-[#1F2937] text-sm rounded-xl focus:outline-none focus:border-[#16A36A] focus:ring-1 focus:ring-[#16A36A] transition-all`}
                  placeholder="Sharma"
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-[#DC2626] font-medium">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                  <FiMail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email address is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email format",
                    },
                  })}
                  className={`block w-full pl-10 pr-4 py-2.5 bg-white border ${
                    errors.email ? "border-red-500" : "border-[#E2E8F0]"
                  } placeholder-[#94A3B8] text-[#1F2937] text-sm rounded-xl focus:outline-none focus:border-[#16A36A] focus:ring-1 focus:ring-[#16A36A] transition-all`}
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-[#DC2626] font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                  <FiLock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Must be at least 6 characters",
                    },
                  })}
                  className={`block w-full pl-10 pr-4 py-2.5 bg-white border ${
                    errors.password ? "border-red-500" : "border-[#E2E8F0]"
                  } placeholder-[#94A3B8] text-[#1F2937] text-sm rounded-xl focus:outline-none focus:border-[#16A36A] focus:ring-1 focus:ring-[#16A36A] transition-all`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-[#DC2626] font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
                Account Type
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                  <FiBriefcase className="w-4 h-4" />
                </div>
                <select
                  {...register("role")}
                  className="block w-full pl-10 pr-4 py-2.5 bg-white border border-[#E2E8F0] text-[#1F2937] text-sm rounded-xl focus:outline-none focus:border-[#16A36A] cursor-pointer"
                >
                  <option value="investor">Investor Account</option>
                  <option value="advisor">Financial Advisor Account</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-[#16A36A] hover:bg-[#138959] focus:outline-none shadow-sm transition-all duration-200 disabled:opacity-50 hover:scale-[1.01]"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Portfolio Account...</span>
                </>
              ) : (
                <>
                  <span>Complete Registration</span>
                  <FiArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-[#E2E8F0]">
            <p className="text-xs text-[#64748B]">
              Already registered?{" "}
              <Link
                to="/login"
                className="font-bold text-[#16A36A] hover:text-[#138959] transition-colors"
              >
                Log In To Your Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
