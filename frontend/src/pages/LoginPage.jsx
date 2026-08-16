import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import { setCredentials } from "../redux/authSlice";
import { FiMail, FiLock, FiArrowRight, FiUserCheck, FiZap, FiCheckCircle } from "react-icons/fi";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      role: "investor",
    },
  });

  const fillDemoAccount = (role) => {
    if (role === "advisor") {
      setValue("email", "advisor@sikka.com");
      setValue("password", "Password123!");
      setValue("role", "advisor");
    } else {
      setValue("email", "user@sikka.com");
      setValue("password", "Password123!");
      setValue("role", "investor");
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await api.post("/api/auth/login", data);
      dispatch(setCredentials(response.data.data));
      const userRole = response.data.data.user?.role;
      toast.success(
        userRole === "advisor"
          ? "Welcome to Sikka Advisor Portal!"
          : "Welcome back to Sikka!"
      );
      navigate("/dashboard");
    } catch (err) {
      // Handled by axios interceptor toast
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
              <FiZap className="w-3.5 h-3.5 text-[#55CFA0]" /> Next-Gen Micro-Investing
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white font-outfit">
              Grow Your Wealth <br />
              <span className="text-[#55CFA0]">One Spare Change At A Time.</span>
            </h1>
            <p className="mt-3 text-sm text-[#8A9A92] leading-relaxed">
              Log in to monitor round-up accumulations, portfolio growth, risk allocations, and direct advisor consultations.
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-[#1B4D38]">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#1B4D38] text-[#55CFA0] mt-0.5 border border-[#55CFA0]/30">
                <FiCheckCircle className="w-4 h-4 text-[#55CFA0]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Algorithmic Rebalancing</h4>
                <p className="text-xs text-[#8A9A92]">Automated asset allocation customized to your risk tolerance.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#1B4D38] text-[#55CFA0] mt-0.5 border border-[#55CFA0]/30">
                <FiCheckCircle className="w-4 h-4 text-[#55CFA0]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">AI Financial Copilot</h4>
                <p className="text-xs text-[#8A9A92]">Real-time market insights and personalized investment answers.</p>
              </div>
            </div>
          </div>

          {/* Quick Demo Fill Buttons */}
          <div className="pt-4 border-t border-[#1B4D38]">
            <span className="text-[11px] font-bold text-[#55CFA0] uppercase tracking-wider block mb-2">
              Quick One-Click Demo Credentials:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemoAccount("investor")}
                className="px-3 py-2 text-xs font-bold rounded-xl bg-[#1B4D38] hover:bg-[#18A66A] text-white border border-[#55CFA0]/30 transition-all flex items-center justify-center gap-1 shadow-sm"
              >
                Investor Demo
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount("advisor")}
                className="px-3 py-2 text-xs font-bold rounded-xl bg-[#1B4D38] hover:bg-[#18A66A] text-white border border-[#55CFA0]/30 transition-all flex items-center justify-center gap-1 shadow-sm"
              >
                Advisor Demo
              </button>
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="p-8 rounded-3xl border border-[#D7E2DC] bg-white shadow-sm space-y-6">
          <div className="text-center md:text-left">
            <div className="mx-auto md:mx-0 w-12 h-12 rounded-2xl bg-[#E3F5ED] border border-[#D7E2DC] flex items-center justify-center text-[#18A66A] mb-4 shadow-sm">
              <FiLock className="w-6 h-6 text-[#18A66A]" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[#15231D] font-outfit">
              Secure Sign In
            </h2>
            <p className="mt-1 text-xs text-[#60736A]">
              Enter your registered credentials to access your Sikka terminal
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#60736A] mb-1.5">
                Account Role
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A9A92]">
                  <FiUserCheck className="w-4 h-4" />
                </div>
                <select
                  {...register("role")}
                  className="block w-full pl-10 pr-4 py-3 bg-white border border-[#D7E2DC] text-[#15231D] text-sm rounded-xl focus:outline-none focus:border-[#18A66A] focus:ring-1 focus:ring-[#18A66A] transition-all cursor-pointer"
                >
                  <option value="investor">Investor Account</option>
                  <option value="advisor">Financial Advisor Account</option>
                </select>
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
                      message: "Invalid email address format",
                    },
                  })}
                  className={`block w-full pl-10 pr-4 py-3 bg-white border ${errors.email ? "border-rose-500" : "border-[#D7E2DC]"
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
                  })}
                  className={`block w-full pl-10 pr-4 py-3 bg-white border ${errors.password ? "border-rose-500" : "border-[#D7E2DC]"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-[#18A66A] hover:bg-[#159A63] focus:outline-none shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01]"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Ledger Access...</span>
                </>
              ) : (
                <>
                  <span>Sign In To Sikka</span>
                  <FiArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Mobile Autofill */}
          <div className="md:hidden pt-2 border-t border-[#D7E2DC] space-y-2">
            <span className="text-[11px] font-bold text-[#60736A] uppercase tracking-wider block text-center">
              Quick Demo Fill:
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fillDemoAccount("investor")}
                className="flex-1 py-2 text-xs font-bold rounded-lg bg-[#E3F5ED] text-[#123B2A] border border-[#D7E2DC]"
              >
                Investor Demo
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount("advisor")}
                className="flex-1 py-2 text-xs font-bold rounded-lg bg-[#123B2A] text-white border border-[#1B4D38]"
              >
                Advisor Demo
              </button>
            </div>
          </div>

          <div className="text-center pt-2 border-t border-[#D7E2DC]">
            <p className="text-xs text-[#60736A]">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-bold text-[#18A66A] hover:text-[#159A63] transition-colors"
              >
                Create Free Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
