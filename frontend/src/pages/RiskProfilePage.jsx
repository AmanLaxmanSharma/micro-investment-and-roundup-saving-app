import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import api from "../services/api";
import { FiSliders, FiShield, FiPercent, FiTrendingUp, FiActivity, FiArrowRight, FiInfo } from "react-icons/fi";

const questions = [
  {
    key: "marketVolatility",
    label: "How do you react to market volatility?",
    options: [
      { value: "low", title: "Conservative", desc: "Panic & withdraw. Prefer safety of principal." },
      { value: "moderate", title: "Moderate", desc: "Concerned but hold. Tolerate minor fluctuations." },
      { value: "high", title: "Aggressive", desc: "See opportunity. Ready to buy during drops." },
    ],
  },
  {
    key: "investmentHorizon",
    label: "How long can you keep money invested?",
    options: [
      { value: "low", title: "Short Term", desc: "Less than 2 years. Need liquidity soon." },
      { value: "moderate", title: "Medium Term", desc: "2 to 7 years. Mid-range investments." },
      { value: "high", title: "Long Term", desc: "Over 7 years. Focused on wealth growth." },
    ],
  },
  {
    key: "lossTolerance",
    label: "How much temporary loss can you tolerate?",
    options: [
      { value: "low", title: "Minimal (<5%)", desc: "Losses keep you awake. Focus on bonds/cash." },
      { value: "moderate", title: "Moderate (5% - 15%)", desc: "Accept slight drops for higher returns." },
      { value: "high", title: "Aggressive (15%+)", desc: "Prepared for big market swings to maximize growth." },
    ],
  },
];

export default function RiskProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      marketVolatility: "moderate",
      investmentHorizon: "medium",
      lossTolerance: "low",
    },
  });

  const fetchProfile = async () => {
    try {
      const response = await api.get("/api/risk-profile");
      // Extract from unified structure data: { riskProfile }
      if (response.data.data.riskProfile) {
        setProfile(response.data.data.riskProfile);
      }
    } catch (err) {
      // Profile not set is treated as normal status
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const response = await api.post("/api/risk-profile", {
        answers: data,
      });
      toast.success("Risk tolerance profile updated!");
      setProfile(response.data.data.riskProfile);
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
        <span className="text-[#64748B]">Loading risk metrics...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <div className="space-y-2">
        <h2 className="text-3xl font-extrabold tracking-tight text-[#123B5D] flex items-center gap-3 font-outfit">
          <FiSliders className="text-[#16A36A]" />
          Risk Appetite Questionnaire
        </h2>
        <p className="text-sm text-[#64748B]">
          Answer the questions below to evaluate your compliance levels and obtain a recommended asset portfolio.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-10 items-start">
        {/* Questionnaire Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-3 space-y-8">
          {questions.map((q) => (
            <div key={q.key} className="space-y-3">
              <label className="block text-sm font-bold text-[#1F2937]">
                {q.label}
              </label>

              <Controller
                name={q.key}
                control={control}
                render={({ field }) => (
                  <div className="grid sm:grid-cols-3 gap-4">
                    {q.options.map((opt) => {
                      const isSelected = field.value === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => field.onChange(opt.value)}
                          className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all ${
                            isSelected
                              ? "bg-[#DCFCE7]/50 border-[#16A36A] ring-1 ring-[#16A36A] shadow-sm"
                              : "bg-white border-[#E2E8F0] hover:border-[#123B5D]/30"
                          }`}
                        >
                          <div>
                            <span
                              className={`text-xs font-bold uppercase tracking-wider ${
                                isSelected ? "text-[#123B5D]" : "text-[#64748B]"
                              }`}
                            >
                              {opt.title}
                            </span>
                            <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                              {opt.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto flex justify-center items-center gap-2 py-3.5 px-8 rounded-xl text-sm font-bold text-white bg-[#16A36A] hover:bg-[#138959] shadow-sm transition-all disabled:opacity-50 hover:scale-[1.01]"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Assessing Risk Profile...</span>
              </>
            ) : (
              <>
                <span>Evaluate Risk Profile</span>
                <FiArrowRight />
              </>
            )}
          </button>
        </form>

        {/* Recommended Portfolio Panel */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-[#123B5D] font-outfit">Recommended Allocation</h3>

          {profile ? (
            <div className="p-6 rounded-3xl border border-[#E2E8F0] bg-white space-y-6 shadow-sm relative overflow-hidden">
              {/* Score and Level Banners */}
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold px-2.5 py-1 bg-[#F5F7FA] border border-[#E2E8F0] text-[#64748B] rounded-lg">
                  Score: {profile.score}
                </span>

                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                    profile.level === "aggressive"
                      ? "bg-purple-50 border border-purple-200 text-purple-800"
                      : profile.level === "moderate"
                      ? "bg-amber-50 border border-amber-200 text-amber-800"
                      : "bg-[#DCFCE7] border border-[#BBF7D0] text-[#16A36A]"
                  }`}
                >
                  {profile.level}
                </span>
              </div>

              {/* Fund info */}
              {profile.recommendedPortfolio ? (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-lg font-extrabold text-[#1F2937]">
                      {profile.recommendedPortfolio.name}
                    </h4>
                    <p className="text-xs text-[#64748B] leading-relaxed">
                      {profile.recommendedPortfolio.description}
                    </p>
                  </div>

                  {/* Return rate banner */}
                  <div className="flex items-center gap-2 p-3 rounded-xl border border-[#E2E8F0] bg-[#F5F7FA]">
                    <FiTrendingUp className="text-[#16A36A] w-4 h-4" />
                    <span className="text-xs text-[#64748B]">
                      Historical Return Rate:{" "}
                      <strong className="text-[#1F2937]">
                        {profile.recommendedPortfolio.historicalReturnRate}%
                      </strong>{" "}
                      annualized
                    </span>
                  </div>

                  {/* Asset Allocation Percentage Bar Visual */}
                  <div className="space-y-3 pt-2">
                    <h5 className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                      Asset Allocation Breakdown
                    </h5>
                    
                    {/* Visual Segmented Bar */}
                    <div className="h-2.5 w-full bg-[#F5F7FA] rounded-full overflow-hidden flex border border-[#E2E8F0]">
                      {profile.recommendedPortfolio.assetAllocation.map((asset, i) => {
                        const colors = [
                          "bg-[#16A36A]",
                          "bg-[#123B5D]",
                          "bg-[#8B5CF6]",
                          "bg-[#3B82F6]",
                        ];
                        return (
                          <div
                            key={asset.asset}
                            className={colors[i % colors.length]}
                            style={{ width: `${asset.percentage}%` }}
                          />
                        );
                      })}
                    </div>

                    {/* Legends and details */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      {profile.recommendedPortfolio.assetAllocation.map((asset, i) => {
                        const colors = [
                          "bg-[#16A36A]",
                          "bg-[#123B5D]",
                          "bg-[#8B5CF6]",
                          "bg-[#3B82F6]",
                        ];
                        return (
                          <div key={asset.asset} className="flex items-center gap-2 text-xs">
                            <span className={`w-2.5 h-2.5 rounded ${colors[i % colors.length]}`} />
                            <span className="text-[#64748B]">{asset.asset}</span>
                            <span className="font-bold text-[#1F2937] font-mono ml-auto">
                              {asset.percentage}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-[#94A3B8]">Recommended portfolio metadata loading...</p>
              )}
            </div>
          ) : (
            <div className="p-8 border border-[#E2E8F0] bg-white rounded-3xl text-center space-y-3 shadow-sm">
              <FiShield className="w-8 h-8 text-[#94A3B8] mx-auto" />
              <p className="text-[#1F2937] font-semibold text-sm">No evaluated profile found.</p>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Please complete the questions on the left. The Sikka ledger will match you to a matching investment pool automatically.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
