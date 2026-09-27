// Sikka Micro-Investment Platform - Home Page
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import api from "../services/api";
import {
  FiTrendingUp,
  FiActivity,
  FiArrowRight,
  FiTarget,
  FiCpu,
  FiCheckCircle,
  FiDollarSign,
  FiShield,
  FiCompass,
  FiMessageSquare,
  FiCreditCard,
  FiZap
} from "react-icons/fi";

export default function HomePage() {
  const [healthData, setHealthData] = useState(null);
  const [error, setError] = useState("");
  const { isAuthenticated } = useSelector((state) => state.auth);

  // States for Calculator
  const [monthlyInvestment, setMonthlyInvestment] = useState(50);
  const [years, setYears] = useState(10);
  const [interestRate, setInterestRate] = useState(8);

  // States for Live Round-up Simulator
  const sampleTransactions = [
    { title: "Morning Espresso", category: "Cafe & Snacks", amount: 142.5 },
    { title: "Grocery Supplies", category: "Daily Essentials", amount: 684.0 },
    { title: "Ride Sharing", category: "Commute", amount: 215.2 },
  ];
  const [simulatedTx, setSimulatedTx] = useState(sampleTransactions[0]);

  // States for Growth Estimator
  const [dailyRoundup, setDailyRoundup] = useState(30);
  const [annualReturn, setAnnualReturn] = useState(12);

  const [simulatorTotal, setSimulatorTotal] = useState(42.6);
  const [transactions, setTransactions] = useState([
    { id: 1, merchant: "Starbucks Coffee", spent: 4.2, rounded: 0.8, logo: "☕" },
    { id: 2, merchant: "Uber Ride", spent: 12.5, rounded: 0.5, logo: "🚗" },
    { id: 3, merchant: "Netflix Premium", spent: 15.4, rounded: 0.6, logo: "🎬" },
  ]);

  // Fetch API Health
  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await api.get("/api/health");
        setHealthData(response.data.data);
      } catch (err) {
        setError("Unable to connect to the Sikka secure backend ledger.");
      }
    };
    fetchHealth();
  }, []);

  // Simulator dynamic updates
  useEffect(() => {
    const merchants = [
      { name: "Supermarket", logos: "🛒" },
      { name: "Spotify Premium", logos: "🎵" },
      { name: "Steam Store", logos: "🎮" },
      { name: "Amazon Delivery", logos: "📦" },
      { name: "Gas Station", logos: "⛽" },
      { name: "McDonalds Meals", logos: "🍔" }
    ];

    const interval = setInterval(() => {
      const selectedMerchant = merchants[Math.floor(Math.random() * merchants.length)];
      const spent = parseFloat((Math.random() * 20 + 2).toFixed(2));
      const roundedVal = Math.ceil(spent) - spent;
      const rounded = parseFloat((roundedVal === 0 ? 1.0 : roundedVal).toFixed(2));

      setTransactions((prev) => {
        const updated = [
          {
            id: Date.now(),
            merchant: selectedMerchant.name,
            spent,
            rounded,
            logo: selectedMerchant.logos
          },
          ...prev.slice(0, 2)
        ];
        return updated;
      });

      setSimulatorTotal((prev) => parseFloat((prev + rounded).toFixed(2)));
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // Compute Compound Interest
  const computeCompoundInterest = () => {
    const months = 10 * 12;
    const monthlyDeposit = dailyRoundup * 30;
    const r = annualReturn / 100 / 12;

    let total = 0;
    for (let i = 0; i < months; i++) {
      total = (total + monthlyDeposit) * (1 + r);
    }
    const principal = monthlyDeposit * months;

    return {
      principal: Math.round(principal),
      futureValue: Math.round(total),
    };
  };

  const results = computeCompoundInterest();

  return (
    <div className="relative min-h-[calc(100vh-73px)] w-full overflow-hidden bg-[#F5F7FA] text-[#1F2937] pb-20">

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-28 text-center space-y-8 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#E2E8F0] bg-[#DCFCE7] text-xs font-bold text-[#123B5D]">
          <FiZap className="w-4 h-4 text-[#16A36A]" />
          <span>V2.0: Smart Compound & Ledger Diagnostics Enabled</span>
        </div>

        <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-none text-[#123B5D]">
          Invest Spare Change <br className="hidden md:inline" />
          <span className="gradient-text-brand">
            Automagically.
          </span>
        </h1>

        <p className="text-lg md:text-2xl text-[#64748B] max-w-3xl mx-auto leading-relaxed font-normal">
          Sikka connects your daily purchases with micro-investments. Round up transaction spare change to build diversified portfolios tailored to your personalized risk tolerance.
        </p>

        <div className="flex flex-wrap justify-center gap-5 pt-4">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="group px-8 py-4 bg-[#16A36A] hover:bg-[#138959] text-white font-bold rounded-xl shadow-sm transition-all duration-200 transform hover:-translate-y-1 flex items-center gap-2"
            >
              Go to Dashboard
              <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="group px-8 py-4 bg-[#16A36A] hover:bg-[#138959] text-white font-bold rounded-xl shadow-sm transition-all duration-200 transform hover:-translate-y-1 flex items-center gap-2"
              >
                Get Started
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/register"
                className="px-8 py-4 bg-white border border-[#E2E8F0] hover:border-[#16A36A] text-[#1F2937] font-bold rounded-xl transition-all duration-200 shadow-sm"
              >
                Register Account
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Live Round-up Simulator & Interactive Interest Calculator Row */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 md:mt-36 grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Dynamic Round-up Simulator - Deep Navy Blue Dark Component */}
        <div className="bg-[#123B5D] border border-[#0D2A42] rounded-3xl p-8 flex flex-col justify-between shadow-xl text-white relative overflow-hidden animate-fade-in-up-delayed">
          <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
            <FiCreditCard className="w-48 h-48 text-[#16A36A]" />
          </div>

          <div className="space-y-6 relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-[#4ADE80] uppercase tracking-widest">Interactive Live Demo</span>
                <h3 className="text-2xl font-bold text-white mt-1">Sikka Auto-Roundups</h3>
              </div>
              <span className="px-3 py-1 bg-[#0D2A42] border border-[#16A36A]/40 text-[#4ADE80] text-xs font-bold rounded-full">
                Active Ledger Sync
              </span>
            </div>

            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Select a simulated daily transaction below to witness how Sikka automatically rounds up purchases to the nearest ₹10 or ₹100 and redirects spare change into high-yield mutual funds.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {sampleTransactions.map((tx, idx) => {
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSimulatedTx(tx)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      simulatedTx.title === tx.title
                        ? "bg-[#0D2A42] border-[#16A36A] shadow-sm"
                        : "bg-[#123B5D] border-[#1E5380] hover:bg-[#0D2A42]/70"
                    }`}
                  >
                    <div className="text-[11px] font-bold text-[#94A3B8]">{tx.category}</div>
                    <div className="text-sm font-bold text-white mt-0.5 truncate">{tx.title}</div>
                    <div className="text-xs font-semibold text-[#4ADE80] mt-1">₹{tx.amount}</div>
                  </button>
                );
              })}
            </div>

            {/* Selected Transaction Ledger Receipt Mock */}
            <div className="p-5 rounded-2xl bg-[#0D2A42] border border-[#16A36A]/30 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#94A3B8]">Transaction Cost</span>
                <span className="font-mono font-bold text-white">₹{simulatedTx.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#94A3B8]">Rounded Up Target</span>
                <span className="font-mono font-bold text-white">₹{(Math.ceil(simulatedTx.amount / 10) * 10).toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-[#123B5D] flex justify-between items-center">
                <span className="text-xs font-bold text-white">Automated Micro-Investment</span>
                <span className="font-mono text-base font-extrabold text-[#4ADE80]">
                  +₹{((Math.ceil(simulatedTx.amount / 10) * 10) - simulatedTx.amount).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Compound Interest Estimator Card - Crisp White Card Surface */}
        <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 shadow-sm space-y-6">
          <div>
            <span className="text-xs font-bold text-[#16A36A] uppercase tracking-widest">Growth Estimator</span>
            <h3 className="text-2xl font-bold text-[#123B5D] mt-1">10-Year Wealth Projection</h3>
            <p className="text-xs text-[#64748B] mt-1">
              Estimate compounding potential from consistent daily spare-change micro-deposits.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-[#64748B]">Daily Roundup Amount</span>
                <span className="text-[#16A36A]">₹{dailyRoundup} / day</span>
              </div>
              <input
                type="range"
                min="10"
                max="200"
                step="5"
                value={dailyRoundup}
                onChange={(e) => setDailyRoundup(Number(e.target.value))}
                className="w-full accent-[#16A36A] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-[#64748B]">Expected Annual Return (CAGR)</span>
                <span className="text-[#16A36A]">{annualReturn}%</span>
              </div>
              <input
                type="range"
                min="6"
                max="18"
                step="0.5"
                value={annualReturn}
                onChange={(e) => setAnnualReturn(Number(e.target.value))}
                className="w-full accent-[#16A36A] cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-[#F5F7FA] border border-[#E2E8F0]">
              <span className="text-xs text-[#64748B] block font-medium">Total Principal Invested</span>
              <span className="text-xl font-extrabold text-[#1F2937] font-mono mt-1 block">
                ₹{results.principal.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-[#DCFCE7] border border-[#BBF7D0]">
              <span className="text-xs text-[#123B5D] block font-medium">Projected Total Corpus</span>
              <span className="text-xl font-extrabold text-[#16A36A] font-mono mt-1 block">
                ₹{results.futureValue.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Timeline */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32 md:mt-48 text-center space-y-16">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#123B5D]">
            As Simple As Spending Cash
          </h2>
          <p className="text-[#64748B] max-w-xl mx-auto">
            Sikka works in the background of your life. Get started in four simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="relative group p-6 rounded-2xl border border-[#E2E8F0] bg-white shadow-card-light hover:border-[#16A36A]/40 transition-all">
            <div className="absolute top-4 left-4 text-4xl font-extrabold text-[#E2E8F0] group-hover:text-[#16A36A]/20 transition-colors">01</div>
            <div className="w-12 h-12 rounded-xl bg-[#DCFCE7] border border-[#E2E8F0] text-[#16A36A] flex items-center justify-center mx-auto mb-6 text-xl font-bold relative z-10">
              ⚡
            </div>
            <h4 className="text-lg font-bold text-[#123B5D] mb-2 relative z-10">Link Accounts</h4>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Connect your banks safely through our encrypted, bank-grade ledger protocols.
            </p>
          </div>

          <div className="relative group p-6 rounded-2xl border border-[#E2E8F0] bg-white shadow-card-light hover:border-[#123B5D]/40 transition-all">
            <div className="absolute top-4 left-4 text-4xl font-extrabold text-[#E2E8F0] group-hover:text-[#123B5D]/20 transition-colors">02</div>
            <div className="w-12 h-12 rounded-xl bg-[#DCFCE7] border border-[#E2E8F0] text-[#123B5D] flex items-center justify-center mx-auto mb-6 text-xl font-bold relative z-10">
              📋
            </div>
            <h4 className="text-lg font-bold text-[#123B5D] mb-2 relative z-10">Assess Risk</h4>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Take a quick interactive quiz to match your investment style: conservative, moderate, or aggressive.
            </p>
          </div>

          <div className="relative group p-6 rounded-2xl border border-[#E2E8F0] bg-white shadow-card-light hover:border-[#8B5CF6]/40 transition-all">
            <div className="absolute top-4 left-4 text-4xl font-extrabold text-[#E2E8F0] group-hover:text-[#8B5CF6]/20 transition-colors">03</div>
            <div className="w-12 h-12 rounded-xl bg-[#DCFCE7] border border-[#E2E8F0] text-[#8B5CF6] flex items-center justify-center mx-auto mb-6 text-xl font-bold relative z-10">
              ☕
            </div>
            <h4 className="text-lg font-bold text-[#123B5D] mb-2 relative z-10">Spend Normally</h4>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Pay for daily things like coffee or utilities. Sikka rounds up automatically in the background.
            </p>
          </div>

          <div className="relative group p-6 rounded-2xl border border-[#E2E8F0] bg-white shadow-card-light hover:border-[#16A36A]/40 transition-all">
            <div className="absolute top-4 left-4 text-4xl font-extrabold text-[#E2E8F0] group-hover:text-[#16A36A]/20 transition-colors">04</div>
            <div className="w-12 h-12 rounded-xl bg-[#DCFCE7] border border-[#E2E8F0] text-[#16A36A] flex items-center justify-center mx-auto mb-6 text-xl font-bold relative z-10">
              📈
            </div>
            <h4 className="text-lg font-bold text-[#123B5D] mb-2 relative z-10">Scale & Prosper</h4>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Watch your spare change compound into real diversified assets and track your metrics.
            </p>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32 md:mt-48 space-y-16">
        <div className="text-center space-y-4">
          <span className="text-xs font-bold text-[#16A36A] uppercase tracking-widest">Comprehensive Wealth Infrastructure</span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#123B5D]">
            Engineered For Micro-Investing
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="group p-8 rounded-3xl border border-[#E2E8F0] bg-white hover:border-[#16A36A]/40 transition-all duration-200 hover:-translate-y-0.5 shadow-card-light">
            <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7] text-[#16A36A] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform border border-[#BBF7D0]">
              <FiTrendingUp className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-[#123B5D] mb-3">Dynamic Roundups</h4>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Link multiple debit or credit cards. Our engine captures transactions and processes fraction roundups securely.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group p-8 rounded-3xl border border-[#E2E8F0] bg-white hover:border-[#16A36A]/40 transition-all duration-200 hover:-translate-y-0.5 shadow-card-light">
            <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7] text-[#16A36A] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform border border-[#BBF7D0]">
              <FiCompass className="w-6 h-6 text-[#16A36A]" />
            </div>
            <h4 className="text-xl font-bold text-[#123B5D] mb-3">Algorithmic Risk Profiling</h4>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Take an interactive profiling test designed to calculate your exact financial goals, age-based models, and risk threshold.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group p-8 rounded-3xl border border-[#E2E8F0] bg-white hover:border-[#8B5CF6]/40 transition-all duration-200 hover:-translate-y-0.5 shadow-card-light">
            <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7] text-[#8B5CF6] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform border border-[#BBF7D0]">
              <FiTarget className="w-6 h-6 text-[#8B5CF6]" />
            </div>
            <h4 className="text-xl font-bold text-[#123B5D] mb-3">Goal-Based Targets</h4>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Create targets for vacations, downpayments, or emergency cash reserves. Allocate automatic recurring streams.
            </p>
          </div>

          {/* Card 4 */}
          <div className="group p-8 rounded-3xl border border-[#E2E8F0] bg-white hover:border-[#123B5D]/40 transition-all duration-200 hover:-translate-y-0.5 shadow-card-light">
            <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7] text-[#123B5D] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform border border-[#BBF7D0]">
              <FiCpu className="w-6 h-6 text-[#123B5D]" />
            </div>
            <h4 className="text-xl font-bold text-[#123B5D] mb-3">AI Financial Advisor</h4>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Interact with a custom AI chatbot that checks transaction tables, evaluates savings habits, and suggests optimizations.
            </p>
          </div>

          {/* Card 5 */}
          <div className="group p-8 rounded-3xl border border-[#E2E8F0] bg-white hover:border-[#16A36A]/40 transition-all duration-200 hover:-translate-y-0.5 shadow-card-light">
            <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7] text-[#16A36A] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform border border-[#BBF7D0]">
              <FiMessageSquare className="w-6 h-6 text-[#16A36A]" />
            </div>
            <h4 className="text-xl font-bold text-[#123B5D] mb-3">Peer Advisory Rooms</h4>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Access real-time advisory chat rooms to bounce strategies off professional investment advisors and community peers.
            </p>
          </div>

          {/* Card 6 */}
          <div className="group p-8 rounded-3xl border border-[#E2E8F0] bg-white hover:border-[#16A36A]/40 transition-all duration-200 hover:-translate-y-0.5 shadow-card-light">
            <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7] text-[#16A36A] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform border border-[#BBF7D0]">
              <FiShield className="w-6 h-6 text-[#16A36A]" />
            </div>
            <h4 className="text-xl font-bold text-[#123B5D] mb-3">Bank-Grade Ledger Security</h4>
            <p className="text-sm text-[#64748B] leading-relaxed">
              End-to-end tokenization, SSL layers, rigid KYC checkflows, and fully encrypted database access rules.
            </p>
          </div>
        </div>
      </section>

      {/* Security & Health Diagnostics Node */}
      <section className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-32 md:mt-44 text-center animate-fade-in-up-more-delayed">
        <div className="p-8 rounded-3xl border border-[#E2E8F0] bg-white relative overflow-hidden shadow-sm">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-[#16A36A]" />

          <h3 className="text-sm font-bold uppercase tracking-widest text-[#64748B] mb-5 flex items-center justify-center gap-2">
            <FiActivity className="text-[#16A36A] animate-pulse" />
            Sikka Ledger Gateway Diagnostic
          </h3>

          {healthData ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left mt-2">
              <div className="p-4 rounded-2xl bg-[#DCFCE7] border border-[#BBF7D0]">
                <span className="text-[10px] text-[#123B5D] uppercase font-bold">Node Status</span>
                <span className="font-mono text-sm text-[#16A36A] font-bold flex items-center gap-1.5 mt-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#16A36A] inline-block animate-ping" />
                  {healthData.status.toUpperCase()}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#F5F7FA] border border-[#E2E8F0]">
                <span className="text-[10px] text-[#64748B] uppercase font-bold">Ledger Ping</span>
                <span className="font-mono text-sm text-[#1F2937] font-bold block mt-1">
                  {new Date(healthData.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#DCFCE7] border border-[#BBF7D0]">
                <span className="text-[10px] text-[#123B5D] uppercase font-bold">Port Connection</span>
                <span className="font-mono text-sm text-[#16A36A] font-bold block mt-1">
                  SECURE HTTPS
                </span>
              </div>
            </div>
          ) : error ? (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-[#DC2626] font-medium text-sm">
              {error}
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3 text-sm text-[#64748B] py-4">
              <div className="w-5 h-5 border-2 border-[#16A36A] border-t-transparent rounded-full animate-spin" />
              <span>Checking network node ledger diagnostics...</span>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
