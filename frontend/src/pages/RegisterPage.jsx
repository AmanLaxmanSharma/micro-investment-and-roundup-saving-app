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
    <div className="relative min-h-[calc(100vh-130px)] flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Feature Showcase - Rich Deep Forest Green Component */}
        <div className="hidden md:flex flex-col justify-between space-y-6 p-8 rounded-3xl border border-[#1B4D38] bg-[#123B2A] shadow-xl text-white">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1B4D38] border border-[#55CFA0]/40 text-[#55CFA0] text-xs font-bold uppercase tracking-wider mb-4">
              <FiShield className="w-3.5 h-3.5 text-[#55CFA0]" /> Start In Under 60 Seconds
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white font-outfit">
              Join Thousands Of <br />
              <span className="text-[#55CFA0]">Smart Micro-Investors.</span>
            </h1>
            <p className="mt-3 text-sm text-[#8A9A92] leading-relaxed">
              Automate your spare change savings, track target goals, and receive customized portfolio guidance.
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-[#1B4D38]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#1B4D38] text-[#55CFA0] border border-[#55CFA0]/30">
                <FiZap className="w-4 h-4 text-[#55CFA0]" />
              </div>
              <span className="text-xs font-semibold text-white">Automated UPI & Bank Round-ups</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#1B4D38] text-[#55CFA0] border border-[#55CFA0]/30">
                <FiTrendingUp className="w-4 h-4 text-[#55CFA0]" />
              </div>
              <span className="text-xs font-semibold text-white">Risk-Adjusted Algo Portfolios</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#1B4D38] text-[#55CFA0] border border-[#55CFA0]/30">
                <FiShield className="w-4 h-4 text-[#55CFA0]" />
              </div>
              <span className="text-xs font-semibold text-white">Bank-Grade 256-Bit Security</span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#1B4D38]">
            <div className="p-3 rounded-2xl bg-[#1B4D38] border border-[#55CFA0]/30 flex items-center justify-between text-xs">
              <span className="text-[#8A9A92]">Average Annual Roundup Growth</span>
              <span className="font-extrabold text-[#55CFA0]">+14.8% CAGR</span>
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="p-8 rounded-3xl border border-[#D7E2DC] bg-white shadow-sm space-y-6">
          <div className="text-center md:text-left">
            <div className="mx-auto md:mx-0 w-12 h-12 rounded-2xl bg-[#E3F5ED] border border-[#D7E2DC] flex items-center justify-center text-[#18A66A] mb-4 shadow-sm">
              <FiUser className="w-6 h-6 text-[#18A66A]" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[#15231D] font-outfit">
              Create Free Account
            </h2>
            <p className="mt-1 text-xs text-[#60736A]">
              Fill in your details below to activate your Sikka portfolio
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#60736A] mb-1.5">
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
                    errors.firstName ? "border-rose-500" : "border-[#D7E2DC]"
                  } placeholder-[#8A9A92] text-[#15231D] text-sm rounded-xl focus:outline-none focus:border-[#18A66A] focus:ring-1 focus:ring-[#18A66A] transition-all`}
                  placeholder="Aman"
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-rose-600 font-medium">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#60736A] mb-1.5">
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
                    errors.lastName ? "border-rose-500" : "border-[#D7E2DC]"
                  } placeholder-[#8A9A92] text-[#15231D] text-sm rounded-xl focus:outline-none focus:border-[#18A66A] focus:ring-1 focus:ring-[#18A66A] transition-all`}
                  placeholder="Sharma"
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-rose-600 font-medium">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#60736A] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A9A92]">
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
                    errors.email ? "border-rose-500" : "border-[#D7E2DC]"
                  } placeholder-[#8A9A92] text-[#15231D] text-sm rounded-xl focus:outline-none focus:border-[#18A66A] focus:ring-1 focus:ring-[#18A66A] transition-all`}
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-rose-600 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#60736A] mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A9A92]">
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
                    errors.password ? "border-rose-500" : "border-[#D7E2DC]"
                  } placeholder-[#8A9A92] text-[#15231D] text-sm rounded-xl focus:outline-none focus:border-[#18A66A] focus:ring-1 focus:ring-[#18A66A] transition-all`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rose-600 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#60736A] mb-1.5">
                Account Type
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A9A92]">
                  <FiBriefcase className="w-4 h-4" />
                </div>
                <select
                  {...register("role")}
                  className="block w-full pl-10 pr-4 py-2.5 bg-white border border-[#D7E2DC] text-[#15231D] text-sm rounded-xl focus:outline-none focus:border-[#18A66A] cursor-pointer"
                >
                  <option value="investor">Investor Account</option>
                  <option value="advisor">Financial Advisor Account</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-[#18A66A] hover:bg-[#159A63] focus:outline-none shadow-sm transition-all duration-200 disabled:opacity-50 hover:scale-[1.01]"
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

          <div className="text-center pt-2 border-t border-slate-900">
            <p className="text-xs text-slate-400">
              Already registered?{" "}
              <Link
                to="/login"
                className="font-bold text-brand-400 hover:text-brand-300 transition-colors"
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
