import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import api from "../services/api";
import {
  FiTrendingUp,
  FiActivity,
  FiPlusCircle,
  FiDollarSign,
  FiBriefcase,
  FiArrowUpRight,
  FiCheckCircle,
} from "react-icons/fi";

export default function InvestmentsPage() {
  const [investments, setInvestments] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      portfolioName: "",
      amount: "",
      allocation: "balanced",
      riskLevel: "moderate",
    },
  });

  const selectedPortfolioName = watch("portfolioName");

  const fetchData = async () => {
    try {
      const [investRes, walletRes, portfoliosRes] = await Promise.all([
        api.get("/api/investments"),
        api.get("/api/wallet"),
        api.get("/api/risk-profile/portfolios"),
      ]);
      setInvestments(investRes.data.data.investments || []);
      setWallet(walletRes.data.data.wallet);
      setPortfolios(portfoliosRes.data.data.portfolios || []);
    } catch (err) {
      toast.error("Unable to load investment data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const selectPortfolioCard = (p) => {
    setValue("portfolioName", p.name);
    setValue("allocation", p.riskLevel === "conservative" ? "stable" : p.riskLevel === "moderate" ? "balanced" : "growth");
    setValue("riskLevel", p.riskLevel);
  };

  const onSubmit = async (data) => {
    const investAmount = parseFloat(data.amount);
    const balance = parseFloat(wallet?.balance?.toString() || "0");

    if (investAmount > balance) {
      toast.error("Insufficient wallet balance. Please fund your wallet first.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post("/api/investments", {
        ...data,
        amount: investAmount,
      });
      toast.success(`Successfully invested $${investAmount.toFixed(2)} into ${data.portfolioName}!`);
      reset();
      fetchData();
    } catch (err) {
      // Handled
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center gap-3">
        <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-slate-400">Loading investment catalog...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      <div className="space-y-2">
        <h2 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
          <FiBriefcase className="text-brand-500" />
          Investments Center
        </h2>
        <p className="text-slate-400">
          Allocate your liquid wallet funds into managed investment portfolios to grow your wealth automatically.
        </p>
      </div>

      {/* Wallet Balance Banner */}
      <div className="p-6 rounded-2xl border border-slate-900 bg-slate-950/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-xl">
            <FiDollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Available Cash (Sikka Wallet)
            </span>
            <h4 className="text-2xl font-bold text-white font-mono mt-0.5">
              ${parseFloat(wallet?.balance?.toString() || "0.00").toFixed(2)}
            </h4>
          </div>
        </div>
        <div>
          <a
            href="/wallet"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold rounded-lg border border-slate-800 hover:border-slate-700 transition-all inline-flex items-center gap-1.5"
          >
            Add Funds <FiArrowUpRight />
          </a>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-10 items-start">
        {/* Selection & Form */}
        <div className="lg:col-span-3 space-y-6">
          <h3 className="text-xl font-bold text-white">Select Investment Fund</h3>
          
          <div className="grid sm:grid-cols-3 gap-4">
            {portfolios.map((p) => {
              const isSelected = selectedPortfolioName === p.name;
              return (
                <button
                  key={p._id}
                  type="button"
                  onClick={() => selectPortfolioCard(p)}
                  className={`p-5 rounded-2xl border text-left flex flex-col justify-between gap-6 transition-all ${
                    isSelected
                      ? "bg-brand-500/10 border-brand-500 ring-1 ring-brand-500 shadow-lg shadow-brand-500/5"
                      : "bg-slate-950/40 border-slate-900 hover:border-slate-850"
                  }`}
                >
                  <div className="space-y-1">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        p.riskLevel === "aggressive"
                          ? "text-purple-400"
                          : p.riskLevel === "moderate"
                          ? "text-amber-400"
                          : "text-green-400"
                      }`}
                    >
                      {p.riskLevel}
                    </span>
                    <h4 className="font-bold text-white text-sm leading-tight">{p.name}</h4>
                  </div>

                  <div className="space-y-2 w-full">
                    {/* Visual Segmented bar */}
                    <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden flex">
                      {p.assetAllocation.map((asset, i) => {
                        const colors = ["bg-brand-500", "bg-indigo-500", "bg-purple-500"];
                        return (
                          <div
                            key={asset.asset}
                            className={colors[i % colors.length]}
                            style={{ width: `${asset.percentage}%` }}
                          />
                        );
                      })}
                    </div>

                    <div className="flex justify-between items-center text-[11px] text-slate-400">
                      <span>Hist. Return</span>
                      <span className="font-bold text-white">{p.historicalReturnRate}%</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {selectedPortfolioName && (
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 rounded-2xl border border-slate-900 bg-slate-950/50 space-y-4 max-w-md">
              <h4 className="font-bold text-white flex items-center gap-2">
                <FiPlusCircle className="text-brand-500" />
                Allocate Capital: {selectedPortfolioName}
              </h4>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Investment Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("amount", {
                    required: "Amount is required",
                    min: { value: 1.0, message: "Minimum investment is $1.00" },
                  })}
                  placeholder="e.g. 100.00"
                  className={`block w-full px-3 py-2.5 bg-slate-900 border ${
                    errors.amount ? "border-rose-500" : "border-slate-800"
                  } placeholder-slate-600 text-slate-200 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all`}
                />
                {errors.amount && (
                  <p className="mt-1 text-xs text-rose-500">{errors.amount.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
              >
                {submitting ? "Processing Allocation..." : "Confirm Investment"}
              </button>
            </form>
          )}
        </div>

        {/* Existing Investments List */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-white">Allocation History</h3>

          {investments.length === 0 ? (
            <div className="p-8 rounded-2xl border border-slate-900 bg-slate-950/20 text-center space-y-3">
              <FiActivity className="w-8 h-8 text-slate-700 mx-auto" />
              <p className="text-slate-400 text-sm">No investment allocations yet.</p>
              <p className="text-xs text-slate-600">
                Choose a fund on the left and invest cash from your Sikka Wallet.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {investments.map((inv) => (
                <div
                  key={inv.id}
                  className="p-5 rounded-xl border border-slate-900 bg-slate-950/80 hover:border-slate-800 transition-all flex justify-between items-center"
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-white text-sm leading-tight">{inv.portfolioName}</h4>
                    <div className="flex gap-2.5 text-xs text-slate-500">
                      <span className="capitalize">{inv.allocation} allocation</span>
                      <span>•</span>
                      <span>{new Date(inv.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="font-mono font-extrabold text-brand-400 text-base">
                      ${parseFloat(inv.amount).toFixed(2)}
                    </div>
                    <span className="text-[9px] font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20 inline-block uppercase">
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
