import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import { parseAmount } from "../utils/parseAmount";
import {
  FiTrendingUp,
  FiCreditCard,
  FiAward,
  FiBriefcase,
  FiActivity,
  FiUserCheck,
  FiUsers,
  FiMessageSquare,
  FiShield,
  FiArrowUpRight,
  FiCheck,
  FiX,
  FiFileText,
  FiPlus,
  FiPocket,
  FiGrid,
  FiCalendar
} from "react-icons/fi";

export default function DashboardPage() {
  const { user } = useSelector((state) => state.auth);
  
  // Profiles and KYC reviews state
  const [profile, setProfile] = useState(null);
  const [pendingKycList, setPendingKycList] = useState([]);
  const [loadingKyc, setLoadingKyc] = useState(false);
  const [rejectionReasons, setRejectionReasons] = useState({});
  const [error, setError] = useState("");

  // Investor dashboard stats state
  const [wallet, setWallet] = useState(null);
  const [roundUps, setRoundUps] = useState([]);
  const [goals, setGoals] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [loadingStats, setLoadingStats] = useState(false);

  // Fetch admin-level KYC lists
  const fetchPendingKyc = async () => {
    if (user?.role !== "admin") return;
    setLoadingKyc(true);
    try {
      const response = await api.get("/api/kyc/admin/pending");
      setPendingKycList(response.data.data.list || []);
    } catch (err) {
      toast.error("Failed to load pending KYC applications.");
    } finally {
      setLoadingKyc(false);
    }
  };

  // Fetch general user profiles
  const fetchProfile = async () => {
    try {
      const response = await api.get("/api/auth/profile");
      setProfile(response.data.data.user);
    } catch (err) {
      setError("Unable to fetch user profile details.");
    }
  };

  // Fetch investor-level stats
  const fetchInvestorStats = async () => {
    if (user?.role !== "investor") return;
    setLoadingStats(true);
    try {
      const [walletRes, roundupsRes, goalsRes, investmentsRes] = await Promise.all([
        api.get("/api/wallet").catch(() => null),
        api.get("/api/roundups").catch(() => null),
        api.get("/api/goals").catch(() => null),
        api.get("/api/investments").catch(() => null)
      ]);

      if (walletRes) setWallet(walletRes.data.data.wallet);
      if (roundupsRes) setRoundUps(roundupsRes.data.data.roundUps || []);
      if (goalsRes) setGoals(goalsRes.data.data.goals || []);
      if (investmentsRes) setInvestments(investmentsRes.data.data.investments || []);
    } catch (err) {
      toast.error("Error loading account ledger data.");
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchPendingKyc();
    fetchInvestorStats();
    fetchAdvisorStats();
  }, [user?.role]);

  const handleKycReview = async (id, status) => {
    try {
      const reason = rejectionReasons[id] || "";
      await api.put(`/api/kyc/admin/review/${id}`, {
        status,
        rejectionReason: reason,
      });
      toast.success(`Application has been successfully ${status}.`);
      fetchPendingKyc();
    } catch (err) {
      // Axios error handling captures this
    }
  };

  // Compute calculated investor variables
  const totalValuation = investments.reduce((sum, inv) => sum + parseFloat(inv.amount || 0), 0);
  const totalRoundups = roundUps.reduce((sum, ru) => sum + parseFloat(ru.roundUpAmount || 0), 0);
  const activeGoals = goals.filter(g => g.status === "active");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in-up">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-900 bg-gradient-to-br from-slate-900 to-slate-950 p-8 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-64 h-64 bg-indigo-500/5 rounded-full blur-[90px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[10px] font-bold px-2.5 py-1 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-md uppercase tracking-widest">
                {user?.role} Portal
              </span>
              {user?.role === "investor" && profile?.kycStatus && (
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-widest border ${
                  profile.kycStatus === "approved" 
                    ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400" 
                    : profile.kycStatus === "pending"
                    ? "bg-amber-500/10 border-amber-500/25 text-amber-400"
                    : "bg-rose-500/10 border-rose-500/25 text-rose-450"
                }`}>
                  KYC: {profile.kycStatus}
                </span>
              )}
            </div>
            
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
              Welcome back, {user?.firstName || "Investor"}
            </h2>
            <p className="text-slate-400 text-sm md:text-base max-w-xl leading-relaxed">
              Monitor portfolio valuations, process transaction checks, and examine your automated savings schedules.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/kyc"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-800 bg-slate-950/80 hover:bg-slate-900 hover:border-slate-700 text-slate-300 text-sm font-semibold transition-all shadow-md"
            >
              <FiUserCheck className="w-4.5 h-4.5 text-brand-400" /> Compliance Status
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl border border-rose-950 bg-rose-950/20 text-rose-400 text-sm">
          {error}
        </div>
      )}

      {/* -------------------- INVESTOR DASHBOARD -------------------- */}
      {user?.role === "investor" && (
        <div className="space-y-8">
          
          {/* Stats Grid */}
          {loadingStats ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="p-6 rounded-3xl border border-slate-900 bg-slate-950/40 space-y-4 animate-pulse">
                  <div className="h-4 bg-slate-800 rounded w-1/3" />
                  <div className="h-8 bg-slate-800 rounded w-1/2" />
                  <div className="h-3 bg-slate-800 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Stat 1 */}
              <div className="group p-6 rounded-3xl border border-slate-900 bg-slate-950/40 space-y-4 hover:border-emerald-500/25 transition-all shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-1 duration-300">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                    Total Valuation
                  </span>
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-450 border border-emerald-500/10 group-hover:scale-110 transition-transform">
                    <FiTrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-3xl font-extrabold text-white font-mono">
                    ₹{totalValuation.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h3>
                  <p className="text-xs text-slate-500">In-portfolio allocations</p>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="group p-6 rounded-3xl border border-slate-900 bg-slate-950/40 space-y-4 hover:border-brand-500/25 transition-all shadow-lg hover:shadow-brand-500/5 hover:-translate-y-1 duration-300">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                    Liquid Balance
                  </span>
                  <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/10 group-hover:scale-110 transition-transform">
                    <FiCreditCard className="w-4 h-4" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-3xl font-extrabold text-white font-mono">
                    ₹{parseAmount(wallet?.balance).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h3>
                  <p className="text-xs text-slate-500">Available to withdraw/invest</p>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="group p-6 rounded-3xl border border-slate-900 bg-slate-950/40 space-y-4 hover:border-indigo-500/25 transition-all shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1 duration-300">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                    Spare Round-Ups
                  </span>
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 group-hover:scale-110 transition-transform">
                    <FiActivity className="w-4 h-4" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-3xl font-extrabold text-white font-mono">
                    ₹{totalRoundups.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h3>
                  <p className="text-xs text-slate-500">Aggregated spare change</p>
                </div>
              </div>

              {/* Stat 4 */}
              <div className="group p-6 rounded-3xl border border-slate-900 bg-slate-950/40 space-y-4 hover:border-amber-500/25 transition-all shadow-lg hover:shadow-amber-500/5 hover:-translate-y-1 duration-300">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                    Investment Goals
                  </span>
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/10 group-hover:scale-110 transition-transform">
                    <FiAward className="w-4 h-4" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-3xl font-extrabold text-white font-mono">
                    {activeGoals.length}
                  </h3>
                  <p className="text-xs text-slate-500">Active saving targets</p>
                </div>
              </div>
            </div>
          )}

          {/* Main Dashboard Section Row (2/3 Column and 1/3 Sidepanel) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2/3 Content Column */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Active Financial Goals */}
              <div className="p-6 md:p-8 rounded-3xl border border-slate-900 bg-slate-950/20 space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <FiAward className="text-amber-500" />
                      Active Saving Targets
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">Track your goal funding milestones</p>
                  </div>
                  <Link
                    to="/goals"
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all flex items-center gap-1 text-xs font-semibold"
                  >
                    <FiPlus className="w-4.5 h-4.5" /> New Goal
                  </Link>
                </div>

                {loadingStats ? (
                  <div className="space-y-4">
                    <div className="h-16 bg-slate-900 rounded-2xl animate-pulse" />
                    <div className="h-16 bg-slate-900 rounded-2xl animate-pulse" />
                  </div>
                ) : goals.length === 0 ? (
                  <div className="border border-dashed border-slate-800 rounded-2xl p-8 text-center space-y-3">
                    <span className="text-3xl block">🎯</span>
                    <h4 className="text-sm font-semibold text-slate-300">No active goals yet</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Create investment goals for houses, vacations, or emergencies and watch them grow automatically.
                    </p>
                    <Link
                      to="/goals"
                      className="inline-block text-xs font-bold text-brand-400 hover:text-brand-300 hover:underline"
                    >
                      Define your first goal &rarr;
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {goals.slice(0, 3).map((goal) => {
                      const current = parseAmount(goal.currentAmount);
                      const target = parseAmount(goal.targetAmount) || 1;
                      const rawPct = (current / target) * 100;
                      const percent = Math.min(100, Math.max(0, isNaN(rawPct) ? 0 : rawPct)).toFixed(0);

                      return (
                        <div key={goal._id} className="p-5 rounded-2xl bg-slate-950/80 border border-slate-900/60 space-y-3 hover:border-slate-800 transition-colors">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-sm font-bold text-white">{goal.name}</h4>
                              <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                                <FiCalendar className="w-3.5 h-3.5" />
                                Target Date: {new Date(goal.targetDate).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-bold text-brand-400 font-mono">₹{current.toFixed(0)}</span>
                              <span className="text-xs text-slate-500 font-mono"> / ₹{target.toFixed(0)}</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-950">
                              <div
                                className="bg-gradient-to-r from-brand-600 to-indigo-500 h-full rounded-full transition-all duration-500"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-[10px] text-slate-500">
                              <span>Progress</span>
                              <span className="font-bold text-slate-400">{percent}% Funded</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Recent Round-ups Ledger */}
              <div className="p-6 md:p-8 rounded-3xl border border-slate-900 bg-slate-950/20 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <FiActivity className="text-indigo-400 animate-pulse" />
                    Recent Auto-Roundups
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Spare change aggregated from transactions</p>
                </div>

                {loadingStats ? (
                  <div className="space-y-3">
                    <div className="h-10 bg-slate-900 rounded-xl animate-pulse" />
                    <div className="h-10 bg-slate-900 rounded-xl animate-pulse" />
                  </div>
                ) : roundUps.length === 0 ? (
                  <div className="border border-dashed border-slate-800 rounded-2xl p-8 text-center space-y-3">
                    <span className="text-3xl block">💳</span>
                    <h4 className="text-sm font-semibold text-slate-300">No round-up logs yet</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Link your bank account and process transaction mock records to begin automatically investing your change.
                    </p>
                    <Link
                      to="/banks"
                      className="inline-block text-xs font-bold text-brand-400 hover:text-brand-300 hover:underline"
                    >
                      Connect bank credentials &rarr;
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-slate-900 rounded-2xl bg-slate-950/50">
                    <table className="min-w-full divide-y divide-slate-900 text-left">
                      <thead className="bg-slate-950">
                        <tr>
                          <th className="px-5 py-3 text-[10px] font-bold text-slate-450 uppercase tracking-widest">Description</th>
                          <th className="px-5 py-3 text-[10px] font-bold text-slate-450 uppercase tracking-widest text-center">Amount</th>
                          <th className="px-5 py-3 text-[10px] font-bold text-slate-450 uppercase tracking-widest text-right">Round-up</th>
                          <th className="px-5 py-3 text-[10px] font-bold text-slate-450 uppercase tracking-widest text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900/60 bg-slate-950/20">
                        {roundUps.slice(0, 4).map((ru) => (
                          <tr key={ru._id} className="hover:bg-slate-900/20 transition-colors">
                            <td className="px-5 py-4 whitespace-nowrap text-sm font-semibold text-slate-200">
                              {ru.description || "General Purchase"}
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-400 text-center font-mono">
                              ₹{parseAmount(ru.amount).toFixed(2)}
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap text-sm font-bold text-brand-400 text-right font-mono">
                              +₹{parseAmount(ru.roundUpAmount).toFixed(2)}
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap text-center">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                ru.status === "saved" 
                                  ? "bg-green-500/10 border border-green-500/15 text-green-400" 
                                  : "bg-amber-500/10 border border-amber-500/15 text-amber-400"
                              }`}>
                                {ru.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>

            {/* Right 1/3 Sidepanel Column */}
            <div className="space-y-8">
              
              {/* Quick Actions Panel */}
              <div className="p-6 md:p-8 rounded-3xl border border-slate-900 bg-slate-950/20 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <FiGrid className="text-brand-400" />
                    Quick Actions
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Shortcuts to manage investments</p>
                </div>

                <div className="grid grid-cols-1 gap-3.5">
                  <Link
                    to="/wallet"
                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/80 hover:bg-slate-900/60 border border-slate-900 hover:border-slate-800 text-sm font-bold text-white transition-all shadow-sm"
                  >
                    <span>Deposit / Withdraw Funds</span>
                    <FiArrowUpRight className="text-slate-500" />
                  </Link>

                  <Link
                    to="/risk-profile"
                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/80 hover:bg-slate-900/60 border border-slate-900 hover:border-slate-800 text-sm font-bold text-white transition-all shadow-sm"
                  >
                    <span>Configure Risk Profile</span>
                    <FiArrowUpRight className="text-slate-500" />
                  </Link>

                  <Link
                    to="/investments"
                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/80 hover:bg-slate-900/60 border border-slate-900 hover:border-slate-800 text-sm font-bold text-white transition-all shadow-sm"
                  >
                    <span>Allocate Portfolio</span>
                    <FiArrowUpRight className="text-slate-500" />
                  </Link>

                  <Link
                    to="/ai"
                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/80 hover:bg-slate-900/60 border border-slate-900 hover:border-slate-800 text-sm font-bold text-white transition-all shadow-sm"
                  >
                    <span>Chat with AI Advisor</span>
                    <FiArrowUpRight className="text-slate-500" />
                  </Link>
                </div>
              </div>

              {/* Asset Allocation Portfolio */}
              <div className="p-6 md:p-8 rounded-3xl border border-slate-900 bg-slate-950/20 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <FiBriefcase className="text-emerald-400" />
                    Asset Allocation
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Your active portfolio investments</p>
                </div>

                {loadingStats ? (
                  <div className="space-y-3">
                    <div className="h-10 bg-slate-900 rounded-xl animate-pulse" />
                  </div>
                ) : investments.length === 0 ? (
                  <div className="p-5 border border-dashed border-slate-850 rounded-2xl text-center space-y-2.5">
                    <p className="text-xs text-slate-500">No active assets holding</p>
                    <Link
                      to="/investments"
                      className="inline-block px-4 py-2 bg-slate-900 border border-slate-800 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors"
                    >
                      Invest Funds Now
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {investments.slice(0, 4).map((inv) => (
                      <div key={inv._id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-900 flex justify-between items-center">
                        <div>
                          <h4 className="text-xs font-bold text-white">{inv.portfolioName}</h4>
                          <span className={`text-[9px] font-semibold px-2.5 py-0.5 rounded-full inline-block mt-1 capitalize ${
                            inv.riskLevel === "aggressive" 
                              ? "bg-rose-500/10 text-rose-450 border border-rose-500/10" 
                              : inv.riskLevel === "moderate"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/10"
                              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10"
                          }`}>
                            {inv.riskLevel}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-emerald-400 font-mono">
                            ₹{parseAmount(inv.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </span>
                          <span className="text-[10px] text-slate-500 block uppercase font-mono tracking-wider">{inv.allocation}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      )}

      {/* -------------------- ADVISOR DASHBOARD -------------------- */}
      {user?.role === "advisor" && (
        <div className="space-y-10">
          {/* Advisor Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/30 via-slate-950 to-slate-950 p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="space-y-3 relative z-10">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                  Certified Advisory Terminal
                </span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Welcome back, Advisor {user?.name || ""}
              </h2>
              <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
                Monitor assigned investor accounts, review risk profiles, and issue personalized micro-investment recommendations.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 relative z-10">
              <Link
                to="/advisory"
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all hover:scale-105"
              >
                <FiMessageSquare className="w-4 h-4" /> Open Advisory Room
              </Link>
              <Link
                to="/investments"
                className="px-5 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 rounded-xl text-xs font-bold transition-all"
              >
                Explore Portfolios
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl border border-slate-900 bg-slate-950/40 space-y-3 hover:border-emerald-500/30 transition-all shadow-lg">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-xs font-semibold uppercase tracking-widest">Active Investor Clients</span>
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <FiUsers className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-3xl font-extrabold text-white font-mono">{advisorContacts.length}</h3>
              <p className="text-xs text-slate-500">Registered investor accounts</p>
            </div>

            <div className="p-6 rounded-3xl border border-slate-900 bg-slate-950/40 space-y-3 hover:border-indigo-500/30 transition-all shadow-lg">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-xs font-semibold uppercase tracking-widest">Consultation Threads</span>
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <FiMessageSquare className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-3xl font-extrabold text-white font-mono">{advisorContacts.length}</h3>
              <p className="text-xs text-slate-500">Active advisory channels</p>
            </div>

            <div className="p-6 rounded-3xl border border-slate-900 bg-slate-950/40 space-y-3 hover:border-amber-500/30 transition-all shadow-lg">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-xs font-semibold uppercase tracking-widest">Asset Allocation Models</span>
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <FiTrendingUp className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-3xl font-extrabold text-white font-mono">3 Active</h3>
              <p className="text-xs text-slate-500">Conservative, Moderate, Aggressive</p>
            </div>

            <div className="p-6 rounded-3xl border border-slate-900 bg-slate-950/40 space-y-3 hover:border-purple-500/30 transition-all shadow-lg">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-xs font-semibold uppercase tracking-widest">Compliance Status</span>
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <FiShield className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-3xl font-extrabold text-emerald-400 font-mono">VERIFIED</h3>
              <p className="text-xs text-slate-500">Certified Sikka Advisory License</p>
            </div>
          </div>

          {/* Investor Clients Directory & Consultation Actions */}
          <div className="p-8 rounded-3xl border border-slate-900 bg-slate-950/40 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <FiUsers className="text-emerald-400" />
                  Assigned Investor Directory
                </h3>
                <p className="text-xs text-slate-400">Select an investor client to open direct advisory communications</p>
              </div>
              <Link
                to="/advisory"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-emerald-400 text-xs font-bold rounded-xl transition-all inline-flex items-center gap-1.5"
              >
                Go to Advisory Room &rarr;
              </Link>
            </div>

            {loadingAdvisorData ? (
              <div className="flex items-center gap-2 text-slate-400 text-sm py-6">
                <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <span>Loading investor directory...</span>
              </div>
            ) : advisorContacts.length === 0 ? (
              <div className="p-8 text-center space-y-3 border border-dashed border-slate-900 rounded-2xl">
                <FiUsers className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-slate-400 text-sm">No registered investor clients found yet.</p>
                <p className="text-xs text-slate-600">
                  When new investors register, they will appear here for advisory guidance.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {advisorContacts.map((client) => (
                  <div
                    key={client._id || client.id}
                    className="p-5 rounded-2xl border border-slate-900 bg-slate-950/80 hover:border-emerald-500/30 transition-all flex flex-col justify-between gap-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h4 className="font-bold text-white text-base">{client.name}</h4>
                        <p className="text-xs text-slate-500 font-mono">{client.email}</p>
                      </div>
                      <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase">
                        INVESTOR
                      </span>
                    </div>

                    <div className="border-t border-slate-900/60 pt-3 flex justify-between items-center">
                      <span className="text-[11px] text-slate-400">Advisory Channel</span>
                      <Link
                        to="/advisory"
                        className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1"
                      >
                        <FiMessageSquare /> Consult Client
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* -------------------- ADMIN DASHBOARD -------------------- */}
      {user?.role === "admin" && (
        <div className="space-y-8">
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="group p-6 rounded-3xl border border-slate-900 bg-slate-950/50 space-y-4 hover:border-brand-500/20 transition-all duration-300">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-widest">
                  Platform Users
                </span>
                <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/10 group-hover:scale-110 transition-transform">
                  <FiUsers className="w-4.5 h-4.5" />
                </div>
              </div>
              <h3 className="text-3xl font-extrabold text-white font-mono">1</h3>
            </div>

            <div className="group p-6 rounded-3xl border border-slate-900 bg-slate-950/50 space-y-4 hover:border-indigo-500/20 transition-all duration-300">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-widest">
                  Pending KYC Reviews
                </span>
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 group-hover:scale-110 transition-transform">
                  <FiUserCheck className="w-4.5 h-4.5" />
                </div>
              </div>
              <h3 className="text-3xl font-extrabold text-white font-mono">
                {pendingKycList.length}
              </h3>
            </div>

            <div className="group p-6 rounded-3xl border border-slate-900 bg-slate-950/50 space-y-4 hover:border-green-500/20 transition-all duration-300">
              <div className="flex justify-between items-center text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-widest">
                  System Warnings
                </span>
                <div className="p-2 rounded-xl bg-green-500/10 text-green-400 border border-green-500/10 group-hover:scale-110 transition-transform">
                  <FiShield className="w-4.5 h-4.5" />
                </div>
              </div>
              <h3 className="text-3xl font-extrabold text-green-400 font-mono animate-pulse">
                OK
              </h3>
            </div>
          </div>

          {/* Pending KYC Applications Section */}
          <div className="p-8 rounded-3xl border border-slate-900 bg-slate-950/30 space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <FiUserCheck className="text-brand-500" />
              Pending Compliance Reviews
            </h3>

            {loadingKyc ? (
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                <span>Loading applications...</span>
              </div>
            ) : pendingKycList.length === 0 ? (
              <p className="text-slate-500 text-sm">
                No pending KYC applications found. All users are current.
              </p>
            ) : (
              <div className="space-y-4">
                {pendingKycList.map((kyc) => (
                  <div
                    key={kyc._id}
                    className="p-6 rounded-2xl border border-slate-900 bg-slate-950/80 flex flex-col md:flex-row justify-between gap-6"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-2.5">
                        <span className="font-semibold text-white">
                          {kyc.userId?.firstName} {kyc.userId?.lastName}
                        </span>
                        <span className="text-xs text-slate-550">
                          ({kyc.userId?.email})
                        </span>
                      </div>
                      <div className="flex gap-4 text-xs font-mono text-slate-400">
                        <span>Doc: {kyc.documentType.toUpperCase()}</span>
                        <span>Doc No: {kyc.documentNumber}</span>
                      </div>
                      <div>
                        <a
                          href={kyc.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 underline"
                        >
                          <FiFileText /> View Attached Document
                        </a>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                      <input
                        type="text"
                        placeholder="Rejection reason (optional)"
                        value={rejectionReasons[kyc._id] || ""}
                        onChange={(e) =>
                          setRejectionReasons({
                            ...rejectionReasons,
                            [kyc._id]: e.target.value,
                          })
                        }
                        className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-brand-500 text-slate-200"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleKycReview(kyc._id, "approved")}
                          className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <FiCheck /> Approve
                        </button>
                        <button
                          onClick={() => handleKycReview(kyc._id, "rejected")}
                          className="flex-1 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <FiX /> Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
