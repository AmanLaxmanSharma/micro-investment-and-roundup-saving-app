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
        <div className="w-6 h-6 border-2 border-[#16A36A] border-t-transparent rounded-full animate-spin" />
        <span className="text-[#64748B]">Loading goal tracker...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <div className="space-y-2">
        <h2 className="text-3xl font-extrabold tracking-tight text-[#123B5D] flex items-center gap-3 font-outfit">
          <FiTarget className="text-[#16A36A]" />
          {isAdvisor ? "Client Financial Goals & Milestone Review" : "Goal-Based Savings"}
        </h2>
        <p className="text-sm text-[#64748B]">
          {isAdvisor
            ? "Review investor client savings goals, target milestones, and completion velocity."
            : "Establish targeted savings goals and fund them incrementally from your in-app Sikka Wallet balance."}
        </p>
      </div>

      {/* Wallet balance panel */}
      <div className="p-6 rounded-3xl border border-[#E2E8F0] bg-white shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#DCFCE7] border border-[#BBF7D0] text-[#16A36A] rounded-2xl">
            <FiDollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[#64748B] font-semibold uppercase tracking-wider">
              {isAdvisor ? "Advisor Fee Balance" : "Funding Wallet Balance"}
            </span>
            <h4 className="text-2xl font-bold text-[#1F2937] font-mono mt-0.5">
              ₹{parseAmount(wallet?.balance).toFixed(2)}
            </h4>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Create Goal Form OR Advisor Goal Monitor */}
        {isAdvisor ? (
          <div className="lg:col-span-1 p-6 rounded-3xl border border-[#E2E8F0] bg-white shadow-sm space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-[#123B5D] uppercase tracking-widest px-2.5 py-1 bg-[#DCFCE7] rounded-full border border-[#16A36A]/30 inline-flex items-center gap-1">
                <FiShield className="text-[#16A36A]" /> Milestone Monitor
              </span>
              <h3 className="text-lg font-bold text-[#123B5D]">Client Milestone Review</h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0] space-y-1">
                <span className="text-xs text-[#64748B] font-semibold uppercase tracking-wider">Monitored Goals</span>
                <h4 className="text-2xl font-mono font-bold text-[#1F2937]">{goals.length} Goals</h4>
              </div>

              <div className="p-4 rounded-xl bg-[#DCFCE7]/40 border border-[#16A36A]/30 space-y-2">
                <h5 className="text-xs font-bold text-[#123B5D] flex items-center gap-1">
                  <FiTrendingUp className="text-[#16A36A]" /> Goal Acceleration Tip
                </h5>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Help clients achieve long-term goals faster by recommending automated spare change multiplier allocations into equity mutual funds.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-1 p-6 rounded-3xl border border-[#E2E8F0] bg-white shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-[#123B5D] flex items-center gap-2 font-outfit">
              <FiPlusCircle className="text-[#16A36A]" />
              Set New Goal
            </h3>

            <form onSubmit={handleSubmit(handleCreateGoal)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1.5">
                  Goal Name
                </label>
                <input
                  type="text"
                  {...register("name", { required: "Goal name is required" })}
                  placeholder="e.g. Dream House Downpayment"
                  className={`block w-full px-3 py-2 bg-white border ${
                    errors.name ? "border-red-500" : "border-[#E2E8F0]"
                  } placeholder-[#94A3B8] text-[#1F2937] text-sm rounded-xl focus:outline-none focus:border-[#16A36A] transition-all`}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-[#DC2626]">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1.5">
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
                  className={`block w-full px-3 py-2 bg-white border ${
                    errors.targetAmount ? "border-red-500" : "border-[#E2E8F0]"
                  } placeholder-[#94A3B8] text-[#1F2937] text-sm rounded-xl focus:outline-none focus:border-[#16A36A] transition-all`}
                />
                {errors.targetAmount && (
                  <p className="mt-1 text-xs text-[#DC2626]">{errors.targetAmount.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1.5">
                  Target Date
                </label>
                <input
                  type="date"
                  {...register("targetDate", { required: "Target date is required" })}
                  className={`block w-full px-3 py-2 bg-white border ${
                    errors.targetDate ? "border-red-500" : "border-[#E2E8F0]"
                  } text-[#1F2937] text-sm rounded-xl focus:outline-none focus:border-[#16A36A] transition-all`}
                />
                {errors.targetDate && (
                  <p className="mt-1 text-xs text-[#DC2626]">{errors.targetDate.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={submittingGoal}
                className="w-full py-3 bg-[#16A36A] hover:bg-[#138959] text-white rounded-xl text-sm font-bold shadow-sm transition-all disabled:opacity-50"
              >
                {submittingGoal ? "Setting Goal..." : "Establish Goal"}
              </button>
            </form>
          </div>
        )}

        {/* Goals Listing and Tracking Grid */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-[#123B5D] font-outfit">Active Savings Goals</h3>

          {goals.length === 0 ? (
            <div className="p-8 rounded-3xl border border-[#E2E8F0] bg-white text-center space-y-3 shadow-sm">
              <FiTarget className="w-8 h-8 text-[#94A3B8] mx-auto" />
              <p className="text-[#1F2937] font-semibold text-sm">No active savings targets found.</p>
              <p className="text-xs text-[#64748B]">
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
                    className="p-5 rounded-3xl border border-[#E2E8F0] bg-white hover:shadow-md transition-all flex flex-col justify-between gap-6"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-[#1F2937] text-base leading-snug">{g.name}</h4>
                        <button
                          onClick={() => handleDelete(g._id)}
                          className="p-1 text-[#94A3B8] hover:text-[#DC2626] transition-colors"
                          title="Remove Goal"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-1">
                        <div className="h-2 w-full bg-[#F5F7FA] rounded-full overflow-hidden border border-[#E2E8F0]">
                          <div
                            className="h-full bg-[#16A36A] rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-[#64748B] font-mono">
                          <span>{percent.toFixed(0)}% Saved</span>
                          <span>Target: ₹{target.toFixed(0)}</span>
                        </div>
                      </div>

                      {/* Amounts */}
                      <div className="flex justify-between items-center bg-[#F5F7FA] p-3 rounded-xl border border-[#E2E8F0]">
                        <div>
                          <span className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider block">
                            Saved Balance
                          </span>
                          <strong className="text-[#1F2937] text-sm font-mono">
                            ₹{current.toFixed(2)}
                          </strong>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider block">
                            Target Date
                          </span>
                          <span className="text-[#64748B] text-xs flex items-center gap-1 mt-0.5 justify-end">
                            <FiCalendar className="w-3 h-3 text-[#16A36A]" />
                            {new Date(g.targetDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Contribution Input for Investor OR Advice Button for Advisor */}
                    {isAdvisor ? (
                      <div className="border-t border-[#E2E8F0] pt-4 flex justify-between items-center">
                        <span className="text-[10px] text-[#64748B] font-mono">Client Milestone</span>
                        <Link
                          to="/advisory"
                          className="px-3 py-1.5 bg-[#DCFCE7] hover:bg-[#16A36A] text-[#123B5D] hover:text-white rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1"
                        >
                          <FiTrendingUp /> Advise Client
                        </Link>
                      </div>
                    ) : g.status !== "completed" ? (
                      <div className="flex items-center gap-2 border-t border-[#E2E8F0] pt-4">
                        <div className="relative flex-1">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] text-xs font-mono">
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
                            className="block w-full pl-6 pr-2 py-1.5 bg-white border border-[#E2E8F0] text-[#1F2937] text-xs font-mono rounded-lg focus:outline-none focus:border-[#16A36A]"
                          />
                        </div>
                        <button
                          onClick={() => handleContribute(g._id, g.name)}
                          className="px-3.5 py-1.5 bg-[#16A36A] hover:bg-[#138959] text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-all shadow-2xs"
                        >
                          <FiArrowUpCircle /> Fund
                        </button>
                      </div>
                    ) : (
                      <div className="border-t border-[#E2E8F0] pt-4 text-center">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#123B5D] bg-[#DCFCE7] px-4 py-1 rounded-full border border-[#BBF7D0]">
                          <FiCheckCircle className="text-[#16A36A]" /> TARGET ACHIEVED
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
