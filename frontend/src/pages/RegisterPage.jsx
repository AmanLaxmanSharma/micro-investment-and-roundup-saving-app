import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import { setCredentials } from "../redux/authSlice";
import { FiUser, FiMail, FiLock, FiArrowRight, FiBriefcase } from "react-icons/fi";

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
      // Backend returns { success: true, message: "...", data: { token, user } }
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
    <div className="relative min-h-[calc(100vh-73px)] flex items-center justify-center px-4 overflow-hidden py-12">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-brand-500/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-md w-full space-y-6 p-8 rounded-2xl border border-slate-900 bg-slate-950/70 backdrop-blur-md relative z-10 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 mb-4">
            <FiUser className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Start saving and investing spare change today
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
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
                className={`block w-full px-3 py-2 bg-slate-900 border ${errors.firstName ? "border-rose-500" : "border-slate-800"
                  } placeholder-slate-600 text-slate-200 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all`}
                placeholder="Aman"
              />
              {errors.firstName && (
                <p className="mt-1 text-xs text-rose-500 font-medium">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
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
                className={`block w-full px-3 py-2 bg-slate-900 border ${errors.lastName ? "border-rose-500" : "border-slate-800"
                  } placeholder-slate-600 text-slate-200 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all`}
                placeholder="Sharma"
              />
              {errors.lastName && (
                <p className="mt-1 text-xs text-rose-500 font-medium">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Email Address
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
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
                className={`block w-full pl-10 pr-3 py-2 bg-slate-900 border ${errors.email ? "border-rose-500" : "border-slate-800"
                  } placeholder-slate-600 text-slate-200 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all`}
                placeholder="name@example.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-rose-500 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Password
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <FiLock className="w-4 h-4" />
              </div>
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className={`block w-full pl-10 pr-3 py-2 bg-slate-900 border ${errors.password ? "border-rose-500" : "border-slate-800"
                  } placeholder-slate-600 text-slate-200 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-rose-500 font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Account Role
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <FiBriefcase className="w-4 h-4" />
              </div>
              <select
                {...register("role")}
                className="block w-full pl-10 pr-3 py-2 bg-slate-900 border border-slate-800 text-slate-300 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
              >
                <option value="investor">Investor (Saving spare change)</option>
                <option value="advisor">Advisor (Financial guidance)</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <FiArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center pt-2">
          <p className="text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-brand-400 hover:text-brand-300 transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
