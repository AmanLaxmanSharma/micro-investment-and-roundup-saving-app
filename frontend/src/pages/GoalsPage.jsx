import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import { parseAmount } from "../utils/parseAmount";
import {
  FiTarget,
  FiPlusCircle,
  FiTrash2,
  FiDollarSign,
  FiCalendar,
  FiArrowUpCircle,
  FiCheckCircle,
  FiTrendingUp,
  FiShield,
} from "react-icons/fi";

export default function GoalsPage() {
  const { user } = useSelector((state) => state.auth);
  const isAdvisor = user?.role === "advisor";
  const [goals, setGoals] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submittingGoal, setSubmittingGoal] = useState(false);
  const [contributeAmount, setContributeAmount] = useState({});

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      targetAmount: "",
      targetDate: "",
    },
  });

  const fetchData = async () => {
    try {
      const [goalsRes, walletRes] = await Promise.all([
        api.get("/api/goals"),
        api.get("/api/wallet"),
      ]);
      setGoals(goalsRes.data.data.goals || []);
      setWallet(walletRes.data.data.wallet);
    } catch (err) {
      toast.error("Unable to load goals savings details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateGoal = async (data) => {
    setSubmittingGoal(true);
    try {
      await api.post("/api/goals", {
        ...data,
        targetAmount: parseFloat(data.targetAmount),
      });
      toast.success(`Goal "${data.name}" established successfully!`);
      reset();
      fetchData();
    } catch (err) {
      // Handled
    } finally {
      setSubmittingGoal(false);
    }
  };

  const handleContribute = async (id, name) => {
    const amount = parseFloat(contributeAmount[id]);
    const balance = parseAmount(wallet?.balance);

    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid contribution amount.");
      return;
    }

    if (amount > balance) {
      toast.error("Insufficient wallet balance to make contribution.");
      return;
    }

    try {
      await api.post(`/api/goals/${id}/contribute`, { amount });
      toast.success(`Contributed ₹${amount.toFixed(2)} to "${name}"!`);
      setContributeAmount((prev) => ({ ...prev, [id]: "" }));
      fetchData();
    } catch (err) {
      // Handled
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this financial goal?")) {
      return;
    }
    try {
      await api.delete(`/api/goals/${id}`);
      toast.success("Goal removed.");
      fetchData();
    } catch (err) {
      // Handled
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center gap-3">
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-slate-400">Loading goal tracker...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <div className="space-y-2">
        <h2 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
          <FiTarget className={isAdvisor ? "text-emerald-400" : "text-brand-500"} />
          {isAdvisor ? "Client Financial Goals & Milestone Review" : "Goal-Based Savings"}
        </h2>
        <p className="text-slate-400">
          {isAdvisor
            ? "Review investor client savings goals, target milestones, and completion velocity."
            : "Establish targeted savings goals and fund them incrementally from your in-app Sikka Wallet balance."}
        </p>
      </div>

      {/* Wallet balance panel */}
      <div className="p-6 rounded-2xl border border-slate-900 bg-slate-950/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-3 border rounded-xl ${
            isAdvisor ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-brand-500/10 border-brand-500/20 text-brand-400"
          }`}>
            <FiDollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              {isAdvisor ? "Advisor Fee Balance" : "Funding Wallet Balance"}
            </span>
            <h4 className="text-2xl font-bold text-white font-mono mt-0.5">
              ₹{parseAmount(wallet?.balance).toFixed(2)}
            </h4>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Create Goal Form OR Advisor Goal Monitor */}
        {isAdvisor ? (
          <div className="lg:col-span-1 p-6 rounded-2xl border border-emerald-500/20 bg-slate-950/60 space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest px-2.5 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 inline-flex items-center gap-1">
                <FiShield /> Milestone Monitor
              </span>
              <h3 className="text-lg font-bold text-white">Client Milestone Review</h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-850 space-y-1">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Monitored Goals</span>
                <h4 className="text-2xl font-mono font-bold text-white">{goals.length} Goals</h4>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-2">
                <h5 className="text-xs font-bold text-emerald-300 flex items-center gap-1">
                  <FiTrendingUp /> Goal Acceleration Tip
                </h5>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Help clients achieve long-term goals faster by recommending automated spare change multiplier allocations into equity mutual funds.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-1 p-6 rounded-2xl border border-slate-900 bg-slate-950/40 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FiPlusCircle className="text-brand-500" />
              Set New Goal
            </h3>

            <form onSubmit={handleSubmit(handleCreateGoal)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Goal Name
                </label>
                <input
                  type="text"
                  {...register("name", { required: "Goal name is required" })}
                  placeholder="e.g. Dream House Downpayment"
                  className={`block w-full px-3 py-2 bg-slate-900 border ${
                    errors.name ? "border-rose-500" : "border-slate-800"
                  } placeholder-slate-600 text-slate-200 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all`}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-rose-500">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Target Amount (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("targetAmount", {
                    required: "Target amount is required",
                    min: { value: 1.0, message: "Target must be at least ₹1.00" },
                  })}
                  placeholder="1000.00"
                  className={`block w-full px-3 py-2 bg-slate-900 border ${
                    errors.targetAmount ? "border-rose-500" : "border-slate-800"
                  } placeholder-slate-600 text-slate-200 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all`}
                />
                {errors.targetAmount && (
                  <p className="mt-1 text-xs text-rose-500">{errors.targetAmount.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Target Date
                </label>
                <input
                  type="date"
                  {...register("targetDate", { required: "Target date is required" })}
                  className={`block w-full px-3 py-2 bg-slate-900 border ${
                    errors.targetDate ? "border-rose-500" : "border-slate-800"
                  } text-slate-300 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all`}
                />
                {errors.targetDate && (
                  <p className="mt-1 text-xs text-rose-500">{errors.targetDate.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={submittingGoal}
                className="w-full py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
              >
                {submittingGoal ? "Setting Goal..." : "Establish Goal"}
              </button>
            </form>
          </div>
        )}

        {/* Goals Listing and Tracking Grid */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-white">Active Savings Goals</h3>

          {goals.length === 0 ? (
            <div className="p-8 rounded-2xl border border-slate-900 bg-slate-950/20 text-center space-y-3">
              <FiTarget className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-slate-400 text-sm">No active savings targets found.</p>
              <p className="text-xs text-slate-600">
                Establish a goal on the left to allocate wallet capital specifically.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {goals.map((g) => {
                const target = parseAmount(g.targetAmount);
                const current = parseAmount(g.currentAmount);
                const percent = Math.min((current / target) * 100, 100);
                const daysLeft = Math.max(
                  0,
                  Math.ceil((new Date(g.targetDate) - new Date()) / (1000 * 60 * 60 * 24))
                );

                return (
                  <div
                    key={g._id}
                    className="p-5 rounded-2xl border border-slate-900 bg-slate-950/80 hover:border-slate-800 transition-all flex flex-col justify-between gap-6"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-white text-base leading-snug">{g.name}</h4>
                        <button
                          onClick={() => handleDelete(g._id)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                          title="Remove Goal"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-1">
                        <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand-500 rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                          <span>{percent.toFixed(0)}% Saved</span>
                          <span>Target: ₹{target.toFixed(0)}</span>
                        </div>
                      </div>

                      {/* Amounts */}
                      <div className="flex justify-between items-center bg-slate-950/60 p-2.5 rounded-lg border border-slate-900/60">
                        <div>
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                            Saved Balance
                          </span>
                          <strong className="text-white text-sm font-mono">
                            ₹{current.toFixed(2)}
                          </strong>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                            Target Date
                          </span>
                          <span className="text-slate-300 text-xs flex items-center gap-1 mt-0.5 justify-end">
                            <FiCalendar className="w-3 h-3" />
                            {new Date(g.targetDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Contribution Input for Investor OR Advice Button for Advisor */}
                    {isAdvisor ? (
                      <div className="border-t border-slate-900/60 pt-4 flex justify-between items-center">
                        <span className="text-[10px] text-slate-500 font-mono">Client Milestone</span>
                        <Link
                          to="/advisory"
                          className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1"
                        >
                          <FiTrendingUp /> Advise Client
                        </Link>
                      </div>
                    ) : g.status !== "completed" ? (
                      <div className="flex items-center gap-2 border-t border-slate-900/60 pt-4">
                        <div className="relative flex-1">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-mono">
                            ₹
                          </span>
                          <input
                            type="number"
                            placeholder="0.00"
                            value={contributeAmount[g._id] || ""}
                            onChange={(e) =>
                              setContributeAmount((prev) => ({
                                ...prev,
                                [g._id]: e.target.value,
                              }))
                            }
                            className="block w-full pl-6 pr-2 py-1.5 bg-slate-900 border border-slate-800 text-slate-200 text-xs font-mono rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
                          />
                        </div>
                        <button
                          onClick={() => handleContribute(g._id, g.name)}
                          className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
                        >
                          <FiArrowUpCircle /> Fund
                        </button>
                      </div>
                    ) : (
                      <div className="border-t border-slate-900/60 pt-4 text-center">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-400 bg-green-500/10 px-4 py-1.5 rounded-full border border-green-500/20">
                          <FiCheckCircle /> TARGET ACHIEVED
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
