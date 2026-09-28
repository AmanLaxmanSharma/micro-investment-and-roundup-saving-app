import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import api from "../services/api";
import { parseAmount } from "../utils/parseAmount";
import {
  FiTrendingUp,
  FiActivity,
  FiPlusCircle,
  FiDollarSign,
  FiBriefcase,
  FiArrowUpRight,
  FiCheckCircle,
  FiLayers,
} from "react-icons/fi";
import LiveMarketWatcher from "../components/invest/LiveMarketWatcher";

export default function InvestmentsPage() {
  const [investments, setInvestments] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const formSectionRef = useRef(null);

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
    setValue(
      "allocation",
      p.riskLevel === "conservative"
        ? "stable"
        : p.riskLevel === "moderate"
        ? "balanced"
        : "growth"
    );
    setValue("riskLevel", p.riskLevel);
  };

  // Callback when a user clicks "Allocate via Sikka" on any real-time stock card
  const handleSelectStockFromMarket = (stock) => {
    let matchedPortfolio = null;

    if (stock.category === "etf_gold") {
      matchedPortfolio = portfolios.find((p) => p.riskLevel === "conservative") || portfolios[0];
    } else if (stock.category === "global_tech") {
      matchedPortfolio = portfolios.find((p) => p.riskLevel === "aggressive") || portfolios[portfolios.length - 1];
    } else {
      matchedPortfolio = portfolios.find((p) => p.riskLevel === "moderate") || portfolios[1] || portfolios[0];
    }

    if (matchedPortfolio) {
      selectPortfolioCard(matchedPortfolio);
      setValue("portfolioName", `${matchedPortfolio.name} (${stock.ticker})`);
    } else {
      setValue("portfolioName", `Direct: ${stock.ticker} (${stock.name})`);
      setValue("riskLevel", "moderate");
      setValue("allocation", "growth");
    }

    // Suggested micro-investment base
    setValue("amount", stock.currency === "INR" ? Math.min(stock.currentPrice, 500).toFixed(0) : "100.00");

    toast.info(`Selected ${stock.ticker} for micro-investment allocation.`);

    if (formSectionRef.current) {
      formSectionRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const onSubmit = async (data) => {
    const investAmount = parseFloat(data.amount);
    const balance = parseAmount(wallet?.balance);

    if (investAmount > balance) {
      toast.error("Insufficient wallet balance. Please fund your wallet first.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/api/investments", {
        ...data,
        amount: investAmount,
      });
      toast.success(
        `Successfully invested ₹${investAmount.toFixed(2)} into ${data.portfolioName}!`
      );
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
        <div className="w-6 h-6 border-2 border-[#16A36A] border-t-transparent rounded-full animate-spin" />
        <span className="text-[#64748B]">Loading investment center...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-extrabold tracking-tight text-[#123B5D] flex items-center gap-3 font-outfit">
          <FiBriefcase className="text-[#16A36A]" />
          Investments Center
        </h2>
        <p className="text-sm text-[#64748B]">
          Allocate your liquid wallet funds into managed ETF portfolios and track live share market quotes in real time via Socket.io.
        </p>
      </div>

      {/* Wallet Balance Banner */}
      <div className="p-6 rounded-3xl border border-[#E2E8F0] bg-white shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#DCFCE7] border border-[#BBF7D0] text-[#16A36A] rounded-2xl">
            <FiDollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[#64748B] font-semibold uppercase tracking-wider">
              Available Cash (Sikka Wallet)
            </span>
            <h4 className="text-2xl font-bold text-[#1F2937] font-mono mt-0.5">
              ₹{parseAmount(wallet?.balance).toFixed(2)}
            </h4>
          </div>
        </div>
        <div>
          <a
            href="/wallet"
            className="px-4 py-2.5 bg-[#16A36A] hover:bg-[#138959] text-white text-xs font-bold rounded-xl shadow-sm transition-all inline-flex items-center gap-1.5"
          >
            Add Funds <FiArrowUpRight />
          </a>
        </div>
      </div>

      {/* Real-Time Live Share Market & Socket.io Section */}
      <LiveMarketWatcher onSelectStockForInvestment={handleSelectStockFromMarket} />

      {/* Managed Portfolios & Allocation Section */}
      <div ref={formSectionRef} className="grid lg:grid-cols-5 gap-10 items-start pt-6">
        {/* Selection & Form */}
        <div className="lg:col-span-3 space-y-6">
          <h3 className="text-xl font-bold text-[#123B5D] font-outfit flex items-center gap-2">
            <FiLayers className="text-[#16A36A]" />
            Managed Sikka Portfolios
          </h3>
          
          <div className="grid sm:grid-cols-3 gap-4">
            {portfolios.map((p) => {
              const isSelected = selectedPortfolioName?.startsWith(p.name);
              return (
                <button
                  key={p._id}
                  type="button"
                  onClick={() => selectPortfolioCard(p)}
                  className={`p-5 rounded-3xl border text-left flex flex-col justify-between gap-6 transition-all ${
                    isSelected
                      ? "bg-[#DCFCE7]/40 border-[#16A36A] ring-1 ring-[#16A36A] shadow-sm"
                      : "bg-white border-[#E2E8F0] hover:border-[#123B5D]/40"
                  }`}
                >
                  <div className="space-y-1">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        p.riskLevel === "aggressive"
                          ? "text-[#DC2626]"
                          : p.riskLevel === "moderate"
                          ? "text-amber-700"
                          : "text-[#16A36A]"
                      }`}
                    >
                      {p.riskLevel}
                    </span>
                    <h4 className="font-bold text-[#1F2937] text-sm leading-tight">{p.name}</h4>
                  </div>

                  <div className="space-y-2 w-full">
                    {/* Visual Segmented bar */}
                    <div className="h-2 w-full bg-[#F5F7FA] rounded-full overflow-hidden flex border border-[#E2E8F0]">
                      {p.assetAllocation.map((asset, i) => {
                        const colors = ["bg-[#16A36A]", "bg-[#123B5D]", "bg-[#8B5CF6]"];
                        return (
                          <div
                            key={asset.asset}
                            className={colors[i % colors.length]}
                            style={{ width: `${asset.percentage}%` }}
                          />
                        );
                      })}
                    </div>

                    <div className="flex justify-between items-center text-[11px] text-[#64748B]">
                      <span>Hist. Return</span>
                      <span className="font-bold text-[#16A36A]">+{p.historicalReturnRate}%</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {selectedPortfolioName && (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="p-6 rounded-3xl border border-[#E2E8F0] bg-white shadow-sm space-y-4 max-w-md animate-in fade-in duration-300"
            >
              <h4 className="font-bold text-[#123B5D] flex items-center gap-2 font-outfit">
                <FiPlusCircle className="text-[#16A36A]" />
                Allocate Capital: {selectedPortfolioName}
              </h4>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1.5">
                  Investment Amount (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("amount", {
                    required: "Amount is required",
                    min: { value: 1.0, message: "Minimum investment is ₹1.00" },
                  })}
                  placeholder="e.g. 100.00"
                  className={`block w-full px-3.5 py-2.5 bg-white border ${
                    errors.amount ? "border-red-500" : "border-[#E2E8F0]"
                  } placeholder-[#94A3B8] text-[#1F2937] text-sm rounded-xl focus:outline-none focus:border-[#16A36A] transition-all`}
                />
                {errors.amount && (
                  <p className="mt-1 text-xs text-[#DC2626]">{errors.amount.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-[#16A36A] hover:bg-[#138959] text-white rounded-xl text-sm font-bold transition-all shadow-sm disabled:opacity-50"
              >
                {submitting ? "Processing Allocation..." : "Confirm Investment"}
              </button>
            </form>
          )}
        </div>

        {/* Existing Investments List */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-[#123B5D] font-outfit">Allocation History</h3>

          {investments.length === 0 ? (
            <div className="p-8 rounded-3xl border border-[#E2E8F0] bg-white text-center space-y-3 shadow-sm">
              <FiActivity className="w-8 h-8 text-[#94A3B8] mx-auto" />
              <p className="text-[#1F2937] font-semibold text-sm">No investment allocations yet.</p>
              <p className="text-xs text-[#64748B]">
                Choose a fund or live stock above and invest cash from your Sikka Wallet.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {investments.map((inv) => (
                <div
                  key={inv.id}
                  className="p-5 rounded-2xl border border-[#E2E8F0] bg-white hover:shadow-sm transition-all flex justify-between items-center"
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-[#1F2937] text-sm leading-tight">{inv.portfolioName}</h4>
                    <div className="flex gap-2.5 text-xs text-[#64748B]">
                      <span className="capitalize">{inv.allocation} allocation</span>
                      <span>•</span>
                      <span>{new Date(inv.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="font-mono font-extrabold text-[#16A36A] text-base">
                      ₹{parseAmount(inv.amount).toFixed(2)}
                    </div>
                    <span className="text-[9px] font-bold text-[#123B5D] bg-[#DCFCE7] px-2 py-0.5 rounded-full border border-[#BBF7D0] inline-block uppercase">
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
