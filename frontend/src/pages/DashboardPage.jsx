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

  // Advisor dashboard stats state
  const [advisorContacts, setAdvisorContacts] = useState([]);
  const [loadingAdvisorData, setLoadingAdvisorData] = useState(false);

  const fetchAdvisorStats = async () => {
    if (user?.role !== "advisor") return;
    setLoadingAdvisorData(true);
    try {
      const response = await api.get("/api/messages/contacts");
      setAdvisorContacts(response.data.data.contacts || []);
    } catch (err) {
      console.error("Advisor contacts load error:", err);
    } finally {
      setLoadingAdvisorData(false);
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
      
      {/* Welcome Banner - Deep Navy Blue Component */}
      <div className="relative overflow-hidden rounded-3xl border border-[#0D2A42] bg-[#123B5D] p-8 md:p-10 shadow-xl text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#16A36A]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-64 h-64 bg-[#1E5380]/20 rounded-full blur-[90px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[10px] font-bold px-2.5 py-1 bg-[#0D2A42] border border-[#16A36A]/40 text-[#4ADE80] rounded-md uppercase tracking-widest">
                {user?.role} Portal
              </span>
              {user?.role === "investor" && profile?.kycStatus && (
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-widest border ${
                  profile.kycStatus === "approved" 
                    ? "bg-[#0D2A42] border-[#16A36A]/40 text-[#4ADE80]" 
                    : profile.kycStatus === "pending"
                    ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                    : "bg-red-500/20 border-red-500/40 text-red-300"
                }`}>
                  KYC: {profile.kycStatus}
                </span>
              )}
            </div>
            
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
              Welcome back, {user?.firstName || "Investor"}
            </h2>
            <p className="text-[#94A3B8] text-sm md:text-base max-w-xl leading-relaxed">
              Monitor portfolio valuations, process transaction checks, and examine your automated savings schedules.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/kyc"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-[#16A36A]/40 bg-[#0D2A42] hover:bg-[#16A36A] text-white text-sm font-semibold transition-all shadow-sm"
            >
              <FiUserCheck className="w-4.5 h-4.5 text-[#4ADE80]" /> Compliance Status
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl border border-red-200 bg-red-50 text-[#DC2626] text-sm">
          {error}
        </div>
      )}

      {/* -------------------- INVESTOR DASHBOARD -------------------- */}
      {user?.role === "investor" && (
        <div className="space-y-8">
          
          {/* Stats Grid - Crisp White Card Surfaces with Subtle #E2E8F0 Borders */}
          {loadingStats ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="p-6 rounded-3xl border border-[#E2E8F0] bg-white space-y-4 animate-pulse">
                  <div className="h-4 bg-[#DCFCE7] rounded w-1/3" />
                  <div className="h-8 bg-[#DCFCE7] rounded w-1/2" />
                  <div className="h-3 bg-[#DCFCE7] rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Stat 1 */}
              <div className="group p-6 rounded-3xl border border-[#E2E8F0] bg-white space-y-4 hover:border-[#16A36A]/50 transition-all shadow-card-light hover:shadow-md hover:-translate-y-0.5 duration-200">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-[#64748B] uppercase tracking-widest">
                    Total Valuation
                  </span>
                  <div className="p-2 rounded-xl bg-[#DCFCE7] text-[#16A36A] border border-[#BBF7D0] group-hover:scale-105 transition-transform">
                    <FiTrendingUp className="w-4 h-4 text-[#16A36A]" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-3xl font-extrabold text-[#123B5D] font-mono">
                    ₹{totalValuation.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h3>
                  <p className="text-xs text-[#94A3B8]">In-portfolio allocations</p>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="group p-6 rounded-3xl border border-[#E2E8F0] bg-white space-y-4 hover:border-[#16A36A]/50 transition-all shadow-card-light hover:shadow-md hover:-translate-y-0.5 duration-200">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-[#64748B] uppercase tracking-widest">
                    Liquid Balance
                  </span>
                  <div className="p-2 rounded-xl bg-[#F0F6FA] text-[#123B5D] border border-[#E2E8F0] group-hover:scale-105 transition-transform">
                    <FiCreditCard className="w-4 h-4 text-[#123B5D]" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-3xl font-extrabold text-[#1F2937] font-mono">
                    ₹{parseAmount(wallet?.balance).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h3>
                  <p className="text-xs text-[#94A3B8]">Available to withdraw/invest</p>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="group p-6 rounded-3xl border border-[#E2E8F0] bg-white space-y-4 hover:border-[#16A36A]/50 transition-all shadow-card-light hover:shadow-md hover:-translate-y-0.5 duration-200">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-[#64748B] uppercase tracking-widest">
                    Spare Round-Ups
                  </span>
                  <div className="p-2 rounded-xl bg-[#DCFCE7] text-[#16A36A] border border-[#BBF7D0] group-hover:scale-105 transition-transform">
                    <FiActivity className="w-4 h-4 text-[#16A36A]" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-3xl font-extrabold text-[#16A36A] font-mono">
                    ₹{totalRoundups.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h3>
                  <p className="text-xs text-[#94A3B8]">Aggregated spare change</p>
                </div>
              </div>

              {/* Stat 4 */}
              <div className="group p-6 rounded-3xl border border-[#E2E8F0] bg-white space-y-4 hover:border-[#16A36A]/50 transition-all shadow-card-light hover:shadow-md hover:-translate-y-0.5 duration-200">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-[#64748B] uppercase tracking-widest">
                    Investment Goals
                  </span>
                  <div className="p-2 rounded-xl bg-[#F0F6FA] text-[#8B5CF6] border border-[#E2E8F0] group-hover:scale-105 transition-transform">
                    <FiAward className="w-4 h-4 text-[#8B5CF6]" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-3xl font-extrabold text-[#1F2937] font-mono">
                    {activeGoals.length}
                  </h3>
                  <p className="text-xs text-[#94A3B8]">Active saving targets</p>
                </div>
              </div>
            </div>
          )}

          {/* Main Dashboard Section Row (2/3 Column and 1/3 Sidepanel) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2/3 Content Column */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Active Financial Goals */}
              <div className="p-6 md:p-8 rounded-3xl border border-[#E2E8F0] bg-white shadow-sm space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-[#123B5D] flex items-center gap-2 font-outfit">
                      <FiAward className="text-[#16A36A]" />
                      Active Saving Targets
                    </h3>
                    <p className="text-xs text-[#64748B] mt-0.5">Track your goal funding milestones</p>
                  </div>
                  <Link
                    to="/goals"
                    className="p-2 rounded-xl bg-[#DCFCE7] hover:bg-[#16A36A] border border-[#16A36A]/30 text-[#123B5D] hover:text-white transition-all flex items-center gap-1 text-xs font-bold"
                  >
                    <FiPlus className="w-4 h-4" /> New Goal
                  </Link>
                </div>

                {loadingStats ? (
                  <div className="space-y-4">
                    <div className="h-16 bg-[#F5F7FA] rounded-2xl animate-pulse" />
                    <div className="h-16 bg-[#F5F7FA] rounded-2xl animate-pulse" />
                  </div>
                ) : goals.length === 0 ? (
                  <div className="border border-dashed border-[#E2E8F0] bg-[#F5F7FA] rounded-2xl p-8 text-center space-y-3">
                    <span className="text-3xl block">🎯</span>
                    <h4 className="text-sm font-semibold text-[#1F2937]">No active goals yet</h4>
                    <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                      Create investment goals for houses, vacations, or emergencies and watch them grow automatically.
                    </p>
                    <Link
                      to="/goals"
                      className="inline-block text-xs font-bold text-[#16A36A] hover:underline"
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
                        <div key={goal._id} className="p-5 rounded-2xl bg-[#F5F7FA] border border-[#E2E8F0] space-y-3 hover:border-[#16A36A]/50 transition-colors">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-sm font-bold text-[#1F2937]">{goal.name}</h4>
                              <span className="text-[10px] text-[#64748B] flex items-center gap-1 mt-0.5">
                                <FiCalendar className="w-3.5 h-3.5 text-[#16A36A]" />
                                Target Date: {new Date(goal.targetDate).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-bold text-[#16A36A] font-mono">₹{current.toFixed(0)}</span>
                              <span className="text-xs text-[#64748B] font-mono"> / ₹{target.toFixed(0)}</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="w-full bg-white rounded-full h-2 overflow-hidden border border-[#E2E8F0]">
                              <div
                                className="bg-[#16A36A] h-full rounded-full transition-all duration-500"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-[10px] text-[#64748B]">
                              <span>Progress</span>
                              <span className="font-bold text-[#1F2937]">{percent}% Funded</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Recent Round-ups Ledger */}
              <div className="p-6 md:p-8 rounded-3xl border border-[#E2E8F0] bg-white shadow-sm space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-[#123B5D] flex items-center gap-2 font-outfit">
                    <FiActivity className="text-[#16A36A] animate-pulse" />
                    Recent Auto-Roundups
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5">Spare change aggregated from transactions</p>
                </div>

                {loadingStats ? (
                  <div className="space-y-3">
                    <div className="h-10 bg-[#F5F7FA] rounded-xl animate-pulse" />
                    <div className="h-10 bg-[#F5F7FA] rounded-xl animate-pulse" />
                  </div>
                ) : roundUps.length === 0 ? (
                  <div className="border border-dashed border-[#E2E8F0] bg-[#F5F7FA] rounded-2xl p-8 text-center space-y-3">
                    <span className="text-3xl block">💳</span>
                    <h4 className="text-sm font-semibold text-[#1F2937]">No round-up logs yet</h4>
                    <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                      Link your bank account and process transaction mock records to begin automatically investing your change.
                    </p>
                    <Link
                      to="/banks"
                      className="inline-block text-xs font-bold text-[#16A36A] hover:underline"
                    >
                      Connect bank credentials &rarr;
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-[#E2E8F0] rounded-2xl bg-white shadow-2xs">
                    <table className="min-w-full divide-y divide-[#E2E8F0] text-left">
                      <thead className="bg-[#F5F7FA]">
                        <tr>
                          <th className="px-5 py-3 text-[10px] font-bold text-[#64748B] uppercase tracking-widest">Description</th>
                          <th className="px-5 py-3 text-[10px] font-bold text-[#64748B] uppercase tracking-widest text-center">Amount</th>
                          <th className="px-5 py-3 text-[10px] font-bold text-[#64748B] uppercase tracking-widest text-right">Round-up</th>
                          <th className="px-5 py-3 text-[10px] font-bold text-[#64748B] uppercase tracking-widest text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E2E8F0] bg-white">
                        {roundUps.slice(0, 4).map((ru) => (
                          <tr key={ru._id} className="hover:bg-[#F5F7FA]/80 transition-colors">
                            <td className="px-5 py-4 whitespace-nowrap text-sm font-semibold text-[#1F2937]">
                              {ru.description || "General Purchase"}
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap text-sm text-[#64748B] text-center font-mono">
                              ₹{parseAmount(ru.amount).toFixed(2)}
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap text-sm font-bold text-[#16A36A] text-right font-mono">
                              +₹{parseAmount(ru.roundUpAmount).toFixed(2)}
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap text-center">
                              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${
                                ru.status === "saved" 
                                  ? "bg-[#DCFCE7] border-[#BBF7D0] text-[#16A36A]" 
                                  : "bg-amber-50 border-amber-200 text-amber-700"
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
              <div className="p-6 md:p-8 rounded-3xl border border-[#E2E8F0] bg-white shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[#123B5D] flex items-center gap-2 font-outfit">
                    <FiGrid className="text-[#16A36A]" />
                    Quick Actions
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5">Shortcuts to manage investments</p>
                </div>

                <div className="grid grid-cols-1 gap-3.5">
                  <Link
                    to="/wallet"
                    className="flex items-center justify-between p-4 rounded-2xl bg-[#F5F7FA] hover:bg-[#DCFCE7]/50 border border-[#E2E8F0] hover:border-[#16A36A]/40 text-sm font-bold text-[#1F2937] transition-all shadow-2xs"
                  >
                    <span>Deposit / Withdraw Funds</span>
                    <FiArrowUpRight className="text-[#64748B]" />
                  </Link>

                  <Link
                    to="/risk-profile"
                    className="flex items-center justify-between p-4 rounded-2xl bg-[#F5F7FA] hover:bg-[#DCFCE7]/50 border border-[#E2E8F0] hover:border-[#16A36A]/40 text-sm font-bold text-[#1F2937] transition-all shadow-2xs"
                  >
                    <span>Configure Risk Profile</span>
                    <FiArrowUpRight className="text-[#64748B]" />
                  </Link>

                  <Link
                    to="/investments"
                    className="flex items-center justify-between p-4 rounded-2xl bg-[#F5F7FA] hover:bg-[#DCFCE7]/50 border border-[#E2E8F0] hover:border-[#16A36A]/40 text-sm font-bold text-[#1F2937] transition-all shadow-2xs"
                  >
                    <span>Allocate Portfolio</span>
                    <FiArrowUpRight className="text-[#64748B]" />
                  </Link>

                  <Link
                    to="/ai"
                    className="flex items-center justify-between p-4 rounded-2xl bg-[#F5F7FA] hover:bg-[#DCFCE7]/50 border border-[#E2E8F0] hover:border-[#16A36A]/40 text-sm font-bold text-[#1F2937] transition-all shadow-2xs"
                  >
                    <span>Chat with AI Advisor</span>
                    <FiArrowUpRight className="text-[#64748B]" />
                  </Link>
                </div>
              </div>

              {/* Asset Allocation Portfolio */}
              <div className="p-6 md:p-8 rounded-3xl border border-[#E2E8F0] bg-white shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[#123B5D] flex items-center gap-2 font-outfit">
                    <FiBriefcase className="text-[#16A36A]" />
                    Asset Allocation
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5">Your active portfolio investments</p>
                </div>

                {loadingStats ? (
                  <div className="space-y-3">
                    <div className="h-10 bg-[#F5F7FA] rounded-xl animate-pulse" />
                  </div>
                ) : investments.length === 0 ? (
                  <div className="p-5 border border-dashed border-[#E2E8F0] bg-[#F5F7FA] rounded-2xl text-center space-y-2.5">
                    <p className="text-xs text-[#64748B]">No active assets holding</p>
                    <Link
                      to="/investments"
                      className="inline-block px-4 py-2 bg-[#16A36A] hover:bg-[#138959] text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                    >
                      Invest Funds Now
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {investments.slice(0, 4).map((inv) => (
                      <div key={inv._id} className="p-4 rounded-2xl bg-[#F5F7FA] border border-[#E2E8F0] flex justify-between items-center">
                        <div>
                          <h4 className="text-xs font-bold text-[#1F2937]">{inv.portfolioName}</h4>
                          <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full inline-block mt-1 capitalize border ${
                            inv.riskLevel === "aggressive" 
                              ? "bg-red-50 border-red-200 text-[#DC2626]" 
                              : inv.riskLevel === "moderate"
                              ? "bg-amber-50 border-amber-200 text-amber-700"
                              : "bg-[#DCFCE7] border-[#BBF7D0] text-[#16A36A]"
                          }`}>
                            {inv.riskLevel}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-[#16A36A] font-mono">
                            ₹{parseAmount(inv.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </span>
                          <span className="text-[10px] text-[#64748B] block uppercase font-mono tracking-wider">{inv.allocation}</span>
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
          <div className="relative overflow-hidden rounded-3xl border border-[#0D2A42] bg-[#123B5D] p-8 shadow-xl text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#16A36A]/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="space-y-3 relative z-10">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#4ADE80] uppercase tracking-widest px-3 py-1 bg-[#0D2A42] rounded-full border border-[#16A36A]/40">
                  Certified Advisory Terminal
                </span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A36A] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16A36A]" />
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Welcome back, Advisor {user?.name || ""}
              </h2>
              <p className="text-sm text-[#94A3B8] max-w-xl leading-relaxed">
                Monitor assigned investor accounts, review risk profiles, and issue personalized micro-investment recommendations.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 relative z-10">
              <Link
                to="/advisory"
                className="px-5 py-3 bg-[#16A36A] hover:bg-[#138959] text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 transition-all hover:scale-105"
              >
                <FiMessageSquare className="w-4 h-4" /> Open Advisory Room
              </Link>
              <Link
                to="/investments"
                className="px-5 py-3 bg-[#0D2A42] hover:bg-[#123B5D] border border-[#16A36A]/30 text-white rounded-xl text-xs font-bold transition-all"
              >
                Explore Portfolios
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl border border-[#E2E8F0] bg-white space-y-3 hover:border-[#16A36A]/30 transition-all shadow-sm">
              <div className="flex justify-between items-center text-[#64748B]">
                <span className="text-xs font-semibold uppercase tracking-widest">Active Investor Clients</span>
                <div className="p-2 rounded-xl bg-[#DCFCE7] text-[#16A36A] border border-[#BBF7D0]">
                  <FiUsers className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-3xl font-extrabold text-[#123B5D] font-mono">{advisorContacts.length}</h3>
              <p className="text-xs text-[#94A3B8]">Registered investor accounts</p>
            </div>

            <div className="p-6 rounded-3xl border border-[#E2E8F0] bg-white space-y-3 hover:border-[#16A36A]/30 transition-all shadow-sm">
              <div className="flex justify-between items-center text-[#64748B]">
                <span className="text-xs font-semibold uppercase tracking-widest">Consultation Threads</span>
                <div className="p-2 rounded-xl bg-[#DCFCE7] text-[#16A36A] border border-[#BBF7D0]">
                  <FiMessageSquare className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-3xl font-extrabold text-[#123B5D] font-mono">{advisorContacts.length}</h3>
              <p className="text-xs text-[#94A3B8]">Active advisory channels</p>
            </div>

            <div className="p-6 rounded-3xl border border-[#E2E8F0] bg-white space-y-3 hover:border-[#16A36A]/30 transition-all shadow-sm">
              <div className="flex justify-between items-center text-[#64748B]">
                <span className="text-xs font-semibold uppercase tracking-widest">Asset Allocation Models</span>
                <div className="p-2 rounded-xl bg-[#DCFCE7] text-[#16A36A] border border-[#BBF7D0]">
                  <FiTrendingUp className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-3xl font-extrabold text-[#123B5D] font-mono">3 Active</h3>
              <p className="text-xs text-[#94A3B8]">Conservative, Moderate, Aggressive</p>
            </div>

            <div className="p-6 rounded-3xl border border-[#E2E8F0] bg-white space-y-3 hover:border-[#16A36A]/30 transition-all shadow-sm">
              <div className="flex justify-between items-center text-[#64748B]">
                <span className="text-xs font-semibold uppercase tracking-widest">Compliance Status</span>
                <div className="p-2 rounded-xl bg-[#DCFCE7] text-[#16A36A] border border-[#BBF7D0]">
                  <FiShield className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-3xl font-extrabold text-[#16A36A] font-mono">VERIFIED</h3>
              <p className="text-xs text-[#94A3B8]">Certified Sikka Advisory License</p>
            </div>
          </div>

          {/* Investor Clients Directory & Consultation Actions */}
          <div className="p-8 rounded-3xl border border-[#E2E8F0] bg-white shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-xl font-bold text-[#123B5D] flex items-center gap-2 font-outfit">
                  <FiUsers className="text-[#16A36A]" />
                  Assigned Investor Directory
                </h3>
                <p className="text-xs text-[#64748B]">Select an investor client to open direct advisory communications</p>
              </div>
              <Link
                to="/advisory"
                className="px-4 py-2 bg-[#DCFCE7] hover:bg-[#16A36A] border border-[#BBF7D0] text-[#123B5D] hover:text-white text-xs font-bold rounded-xl transition-all inline-flex items-center gap-1.5"
              >
                Go to Advisory Room &rarr;
              </Link>
            </div>

            {loadingAdvisorData ? (
              <div className="flex items-center gap-2 text-[#64748B] text-sm py-6">
                <div className="w-4 h-4 border-2 border-[#16A36A] border-t-transparent rounded-full animate-spin" />
                <span>Loading investor directory...</span>
              </div>
            ) : advisorContacts.length === 0 ? (
              <div className="p-8 text-center space-y-3 border border-dashed border-[#E2E8F0] bg-[#F5F7FA] rounded-2xl">
                <FiUsers className="w-8 h-8 text-[#94A3B8] mx-auto" />
                <p className="text-[#1F2937] font-semibold text-sm">No registered investor clients found yet.</p>
                <p className="text-xs text-[#64748B]">
                  When new investors register, they will appear here for advisory guidance.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {advisorContacts.map((client) => (
                  <div
                    key={client._id || client.id}
                    className="p-5 rounded-2xl border border-[#E2E8F0] bg-[#F5F7FA] hover:border-[#16A36A]/40 transition-all flex flex-col justify-between gap-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h4 className="font-bold text-[#1F2937] text-base">{client.name}</h4>
                        <p className="text-xs text-[#64748B] font-mono">{client.email}</p>
                      </div>
                      <span className="text-[9px] font-bold text-[#123B5D] bg-[#DCFCE7] px-2 py-0.5 rounded border border-[#BBF7D0] uppercase">
                        INVESTOR
                      </span>
                    </div>

                    <div className="border-t border-[#E2E8F0] pt-3 flex justify-between items-center">
                      <span className="text-[11px] text-[#64748B]">Advisory Channel</span>
                      <Link
                        to="/advisory"
                        className="px-3 py-1.5 bg-[#DCFCE7] hover:bg-[#16A36A] text-[#123B5D] hover:text-white rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1"
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
            <div className="group p-6 rounded-3xl border border-[#E2E8F0] bg-white shadow-sm space-y-4 hover:border-[#16A36A]/30 transition-all duration-300">
              <div className="flex justify-between items-center text-[#64748B]">
                <span className="text-xs font-semibold uppercase tracking-widest">
                  Platform Users
                </span>
                <div className="p-2 rounded-xl bg-[#DCFCE7] text-[#16A36A] border border-[#BBF7D0] group-hover:scale-110 transition-transform">
                  <FiUsers className="w-4.5 h-4.5" />
                </div>
              </div>
              <h3 className="text-3xl font-extrabold text-[#123B5D] font-mono">1</h3>
            </div>

            <div className="group p-6 rounded-3xl border border-[#E2E8F0] bg-white shadow-sm space-y-4 hover:border-[#16A36A]/30 transition-all duration-300">
              <div className="flex justify-between items-center text-[#64748B]">
                <span className="text-xs font-semibold uppercase tracking-widest">
                  Pending KYC Reviews
                </span>
                <div className="p-2 rounded-xl bg-[#DCFCE7] text-[#16A36A] border border-[#BBF7D0] group-hover:scale-110 transition-transform">
                  <FiUserCheck className="w-4.5 h-4.5" />
                </div>
              </div>
              <h3 className="text-3xl font-extrabold text-[#123B5D] font-mono">
                {pendingKycList.length}
              </h3>
            </div>

            <div className="group p-6 rounded-3xl border border-[#E2E8F0] bg-white shadow-sm space-y-4 hover:border-[#16A36A]/30 transition-all duration-300">
              <div className="flex justify-between items-center text-[#64748B]">
                <span className="text-xs font-semibold uppercase tracking-widest">
                  System Warnings
                </span>
                <div className="p-2 rounded-xl bg-[#DCFCE7] text-[#16A36A] border border-[#BBF7D0] group-hover:scale-110 transition-transform">
                  <FiShield className="w-4.5 h-4.5" />
                </div>
              </div>
              <h3 className="text-3xl font-extrabold text-[#16A36A] font-mono animate-pulse">
                OK
              </h3>
            </div>
          </div>

          {/* Pending KYC Applications Section */}
          <div className="p-8 rounded-3xl border border-[#E2E8F0] bg-white shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-[#123B5D] flex items-center gap-2 font-outfit">
              <FiUserCheck className="text-[#16A36A]" />
              Pending Compliance Reviews
            </h3>

            {loadingKyc ? (
              <div className="flex items-center gap-2 text-[#64748B] text-sm">
                <div className="w-4 h-4 border-2 border-[#16A36A] border-t-transparent rounded-full animate-spin" />
                <span>Loading applications...</span>
              </div>
            ) : pendingKycList.length === 0 ? (
              <p className="text-[#64748B] text-sm">
                No pending KYC applications found. All users are current.
              </p>
            ) : (
              <div className="space-y-4">
                {pendingKycList.map((kyc) => (
                  <div
                    key={kyc._id}
                    className="p-6 rounded-2xl border border-[#E2E8F0] bg-[#F5F7FA] flex flex-col md:flex-row justify-between gap-6"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-2.5">
                        <span className="font-semibold text-[#1F2937]">
                          {kyc.userId?.firstName} {kyc.userId?.lastName}
                        </span>
                        <span className="text-xs text-[#64748B]">
                          ({kyc.userId?.email})
                        </span>
                      </div>
                      <div className="flex gap-4 text-xs font-mono text-[#64748B]">
                        <span>Doc: {kyc.documentType.toUpperCase()}</span>
                        <span>Doc No: {kyc.documentNumber}</span>
                      </div>
                      <div>
                        <a
                          href={kyc.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-[#16A36A] hover:underline font-semibold"
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
                        className="px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-lg text-xs placeholder-[#94A3B8] focus:outline-none focus:border-[#16A36A] text-[#1F2937]"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleKycReview(kyc._id, "approved")}
                          className="flex-1 px-4 py-2 bg-[#16A36A] hover:bg-[#138959] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                        >
                          <FiCheck /> Approve
                        </button>
                        <button
                          onClick={() => handleKycReview(kyc._id, "rejected")}
                          className="flex-1 px-4 py-2 bg-[#DC2626] hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
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
