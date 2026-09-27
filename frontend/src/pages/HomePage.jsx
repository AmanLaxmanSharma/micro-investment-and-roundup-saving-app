// Sikka Micro-Investment Platform - Home Page
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  FiTrendingUp,
  FiArrowRight,
  FiTarget,
  FiCpu,
  FiCheckCircle,
  FiDollarSign,
  FiShield,
  FiCompass,
  FiMessageSquare,
  FiCreditCard,
  FiZap,
  FiLock,
  FiStar,
  FiChevronDown,
  FiChevronUp,
  FiLayers,
  FiPieChart,
  FiPercent,
  FiAward,
  FiRefreshCw
} from "react-icons/fi";

export default function HomePage() {
  const { isAuthenticated } = useSelector((state) => state.auth);

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

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(0);

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
      gain: Math.round(total - principal)
    };
  };

  const results = computeCompoundInterest();

  const faqs = [
    {
      q: "How does automated spare change round-up work?",
      a: "Every time you spend using your connected card or UPI ID (e.g. ₹142.50 for a coffee), Sikka automatically calculates the rounded difference to the nearest ₹10 or ₹100 (₹7.50). Once accumulated, the change is seamlessly invested into your chosen risk-adjusted diversified portfolio."
    },
    {
      q: "Is my bank account and financial data safe?",
      a: "Yes. Sikka employs bank-grade 256-bit AES encryption and tokenized NPCI-compliant mandate protocols. We never store raw debit card credentials or sensitive banking passwords."
    },
    {
      q: "When and how can I withdraw my funds?",
      a: "You have 100% liquidity. You can initiate a withdrawal directly from your Sikka Wallet back to your verified primary bank account via instant IMPS or NEFT with zero lock-in penalties."
    },
    {
      q: "What types of asset portfolios does Sikka invest in?",
      a: "Sikka offers three primary algorithmic portfolios curated according to your risk tolerance: Conservative (focus on Debt Funds & Gold), Balanced (Index Funds & Fixed Income), and Aggressive (High-growth Equity & Thematic ETFs)."
    },
    {
      q: "Are there any hidden fees or account maintenance charges?",
      a: "No hidden fees. Sikka operates with complete pricing transparency. Account setup, wallet top-ups, and automated round-up tracking are completely free."
    }
  ];

  const testimonials = [
    {
      name: "Rohit Deshmukh",
      role: "Software Engineer, Bengaluru",
      content: "I never realized how quickly loose spare change adds up. In 8 months of daily cab rides and food deliveries, Sikka automated ₹24,000 into high-yield funds without me feeling any pinch!",
      avatar: "RD",
      portfolio: "Aggressive Equity Fund",
      returns: "+16.4%"
    },
    {
      name: "Priyanka Mehra",
      role: "Product Designer, Mumbai",
      content: "The combination of automated roundups and the AI Copilot is genius. I reached my Goa vacation fund goal 3 months ahead of schedule simply by letting Sikka round up my transactions.",
      avatar: "PM",
      portfolio: "Balanced Growth Portfolio",
      returns: "+12.8%"
    },
    {
      name: "Anand Verma",
      role: "Financial Analyst, Delhi NCR",
      content: "As someone who works in finance, I love the disciplined rupee-cost averaging. Sikka turns micro-habits into a real compounding asset with zero friction.",
      avatar: "AV",
      portfolio: "Conservative Index Fund",
      returns: "+9.2%"
    }
  ];

  return (
    <div className="relative min-h-[calc(100vh-73px)] w-full overflow-hidden bg-[#F5F7FA] text-[#1F2937]">

      {/* 1. HERO SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24 pb-16 text-center space-y-8 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#E2E8F0] bg-[#DCFCE7] text-xs font-bold text-[#123B5D] shadow-2xs">
          <FiZap className="w-4 h-4 text-[#16A36A]" />
          <span>India's Smartest Micro-Investing & Round-Ups Platform</span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.08] text-[#123B5D]">
          Turn Spare Change Into <br className="hidden md:inline" />
          <span className="gradient-text-brand">
            Compounding Wealth.
          </span>
        </h1>

        <p className="text-lg md:text-2xl text-[#64748B] max-w-3xl mx-auto leading-relaxed font-normal">
          Sikka automatically rounds up your everyday UPI and card transactions to the nearest ₹10 or ₹100, investing the difference into tailored risk-adjusted portfolios.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-2">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="group px-8 py-4 bg-[#16A36A] hover:bg-[#138959] text-white font-bold rounded-xl shadow-sm transition-all duration-200 transform hover:-translate-y-0.5 flex items-center gap-2 text-base"
            >
              Open Your Dashboard
              <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="group px-8 py-4 bg-[#16A36A] hover:bg-[#138959] text-white font-bold rounded-xl shadow-sm transition-all duration-200 transform hover:-translate-y-0.5 flex items-center gap-2 text-base"
              >
                Start Investing Free
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 bg-white border border-[#E2E8F0] hover:border-[#123B5D] text-[#123B5D] font-bold rounded-xl transition-all duration-200 shadow-sm text-base"
              >
                Sign In
              </Link>
            </>
          )}
        </div>

        {/* Trust Badges Bar */}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-[#64748B] border-t border-[#E2E8F0]/80 max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <FiShield className="text-[#16A36A] w-4 h-4" />
            <span>256-Bit SSL Encrypted</span>
          </div>
          <div className="flex items-center gap-2">
            <FiCheckCircle className="text-[#16A36A] w-4 h-4" />
            <span>NPCI UPI Mandate Ready</span>
          </div>
          <div className="flex items-center gap-2">
            <FiLock className="text-[#123B5D] w-4 h-4" />
            <span>Razorpay Secure Gateway</span>
          </div>
          <div className="flex items-center gap-2">
            <FiAward className="text-[#16A36A] w-4 h-4" />
            <span>SEBI-Compliant Architecture</span>
          </div>
        </div>
      </section>

      {/* 2. STATS AT A GLANCE BANNER */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-6 md:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm">
          <div className="space-y-1 text-center border-r border-[#E2E8F0] last:border-none">
            <span className="text-2xl md:text-4xl font-extrabold text-[#123B5D] font-mono">₹4.8 Cr+</span>
            <p className="text-xs text-[#64748B] font-medium">Spare Change Invested</p>
          </div>
          <div className="space-y-1 text-center md:border-r border-[#E2E8F0]">
            <span className="text-2xl md:text-4xl font-extrabold text-[#16A36A] font-mono">1.2M+</span>
            <p className="text-xs text-[#64748B] font-medium">Auto-Roundups Harvested</p>
          </div>
          <div className="space-y-1 text-center border-r border-[#E2E8F0] last:border-none">
            <span className="text-2xl md:text-4xl font-extrabold text-[#123B5D] font-mono">14.8%</span>
            <p className="text-xs text-[#64748B] font-medium">Avg. Portfolio CAGR</p>
          </div>
          <div className="space-y-1 text-center">
            <span className="text-2xl md:text-4xl font-extrabold text-[#16A36A] font-mono">4.9 / 5</span>
            <p className="text-xs text-[#64748B] font-medium">Investor Trust Rating</p>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE SIMULATOR & COMPOUND GROWTH ESTIMATOR */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold text-[#16A36A] uppercase tracking-widest">Interactive Calculator & Demo</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#123B5D] tracking-tight">
            See Your Spare Change in Action
          </h2>
          <p className="text-sm md:text-base text-[#64748B] max-w-2xl mx-auto">
            Experience how micro-transactions turn into long-term compounding assets with zero lifestyle friction.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Interactive Live Round-up Demo Card (Deep Navy) */}
          <div className="bg-[#123B5D] border border-[#0D2A42] rounded-3xl p-8 flex flex-col justify-between shadow-xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
              <FiCreditCard className="w-48 h-48 text-[#16A36A]" />
            </div>

            <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-[#4ADE80] uppercase tracking-widest">Live Simulator</span>
                  <h3 className="text-2xl font-bold text-white mt-1">Sikka Auto-Roundups</h3>
                </div>
                <span className="px-3 py-1 bg-[#0D2A42] border border-[#16A36A]/40 text-[#4ADE80] text-xs font-bold rounded-full">
                  Instant Round-Up
                </span>
              </div>

              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Click any simulated transaction below to test how Sikka rounds up purchases and redirects spare change into wealth portfolios:
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
                  <span className="text-[#94A3B8]">Transaction Spend</span>
                  <span className="font-mono font-bold text-white">₹{simulatedTx.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#94A3B8]">Rounded Up Target (Nearest ₹10)</span>
                  <span className="font-mono font-bold text-white">₹{(Math.ceil(simulatedTx.amount / 10) * 10).toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-[#123B5D] flex justify-between items-center">
                  <span className="text-xs font-bold text-white">Harvested Micro-Investment</span>
                  <span className="font-mono text-base font-extrabold text-[#4ADE80]">
                    +₹{((Math.ceil(simulatedTx.amount / 10) * 10) - simulatedTx.amount).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Compound Interest Estimator Card (Crisp White) */}
          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs font-bold text-[#16A36A] uppercase tracking-widest">Growth Projection</span>
              <h3 className="text-2xl font-bold text-[#123B5D] mt-1">10-Year Wealth Compounding</h3>
              <p className="text-xs text-[#64748B] mt-1">
                Estimate how much daily spare change can grow into over a 10-year horizon.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-[#64748B]">Daily Spare Change Saved</span>
                  <span className="text-[#16A36A] font-mono text-sm">₹{dailyRoundup} / day</span>
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
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-[#64748B]">Expected Annual Return (CAGR)</span>
                  <span className="text-[#123B5D] font-mono text-sm">{annualReturn}%</span>
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
                <span className="text-xs text-[#64748B] block font-medium">Total Principal Saved</span>
                <span className="text-xl font-extrabold text-[#1F2937] font-mono mt-1 block">
                  ₹{results.principal.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#DCFCE7] border border-[#BBF7D0]">
                <span className="text-xs text-[#123B5D] block font-medium">Projected Future Value</span>
                <span className="text-xl font-extrabold text-[#16A36A] font-mono mt-1 block">
                  ₹{results.futureValue.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS (4 STEP FLOW) */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs font-bold text-[#16A36A] uppercase tracking-widest">Effortless Automation</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#123B5D] tracking-tight">
            How Sikka Works In 4 Steps
          </h2>
          <p className="text-sm md:text-base text-[#64748B] max-w-xl mx-auto">
            Set it up once in 2 minutes. Sikka runs quietly in the background of your life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="relative p-6 rounded-3xl border border-[#E2E8F0] bg-white shadow-card-light hover:border-[#16A36A]/50 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7] border border-[#BBF7D0] text-[#16A36A] flex items-center justify-center mb-6 text-xl font-bold">
              ⚡
            </div>
            <span className="text-xs font-bold text-[#16A36A] uppercase tracking-wider block mb-1">Step 01</span>
            <h4 className="text-lg font-bold text-[#123B5D] mb-2">Link Bank / UPI</h4>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Connect your primary bank or UPI ID using NPCI-grade tokenized authentication.
            </p>
          </div>

          <div className="relative p-6 rounded-3xl border border-[#E2E8F0] bg-white shadow-card-light hover:border-[#123B5D]/50 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7] border border-[#BBF7D0] text-[#123B5D] flex items-center justify-center mb-6 text-xl font-bold">
              🎯
            </div>
            <span className="text-xs font-bold text-[#123B5D] uppercase tracking-wider block mb-1">Step 02</span>
            <h4 className="text-lg font-bold text-[#123B5D] mb-2">Set Risk & Goals</h4>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Answer 3 quick questions to discover your optimal asset allocation strategy.
            </p>
          </div>

          <div className="relative p-6 rounded-3xl border border-[#E2E8F0] bg-white shadow-card-light hover:border-[#8B5CF6]/50 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7] border border-[#BBF7D0] text-[#8B5CF6] flex items-center justify-center mb-6 text-xl font-bold">
              ☕
            </div>
            <span className="text-xs font-bold text-[#8B5CF6] uppercase tracking-wider block mb-1">Step 03</span>
            <h4 className="text-lg font-bold text-[#123B5D] mb-2">Spend Normally</h4>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Pay for morning coffee, fuel, or groceries. Sikka auto-captures and rounds up spare change.
            </p>
          </div>

          <div className="relative p-6 rounded-3xl border border-[#E2E8F0] bg-white shadow-card-light hover:border-[#16A36A]/50 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7] border border-[#BBF7D0] text-[#16A36A] flex items-center justify-center mb-6 text-xl font-bold">
              📈
            </div>
            <span className="text-xs font-bold text-[#16A36A] uppercase tracking-wider block mb-1">Step 04</span>
            <h4 className="text-lg font-bold text-[#123B5D] mb-2">Watch It Grow</h4>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Track your portfolio compounding in real time with our live ledger and AI Copilot.
            </p>
          </div>
        </div>
      </section>

      {/* 5. MANAGED PORTFOLIOS COMPARISON */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs font-bold text-[#16A36A] uppercase tracking-widest">Algorithmic Strategies</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#123B5D] tracking-tight">
            Curated Portfolios For Every Risk Profile
          </h2>
          <p className="text-sm md:text-base text-[#64748B] max-w-2xl mx-auto">
            Choose an automated allocation built by institutional analysts or let Sikka's risk algorithm pick for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Conservative Fund */}
          <div className="p-8 rounded-3xl border border-[#E2E8F0] bg-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="text-[10px] font-bold px-3 py-1 rounded-full uppercase bg-[#DCFCE7] text-[#16A36A] border border-[#BBF7D0]">
                Low Risk
              </span>
              <h3 className="text-2xl font-bold text-[#123B5D]">Conservative Shield</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Prioritizes capital preservation, liquid fixed-income instruments, and sovereign debt funds with minimal volatility.
              </p>
            </div>

            <div className="space-y-3 p-4 rounded-2xl bg-[#F5F7FA] border border-[#E2E8F0]">
              <div className="flex justify-between text-xs">
                <span className="text-[#64748B]">Govt Bonds & Debt</span>
                <span className="font-bold text-[#1F2937]">70%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#64748B]">Large Cap Index</span>
                <span className="font-bold text-[#1F2937]">20%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#64748B]">Physical Gold ETF</span>
                <span className="font-bold text-[#1F2937]">10%</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#E2E8F0] flex justify-between items-center">
              <div>
                <span className="text-[10px] text-[#64748B] uppercase font-bold block">Historical Return</span>
                <span className="text-lg font-extrabold text-[#16A36A] font-mono">+8.5% p.a.</span>
              </div>
              <Link
                to="/investments"
                className="px-4 py-2 bg-[#DCFCE7] hover:bg-[#16A36A] text-[#123B5D] hover:text-white rounded-xl text-xs font-bold transition-colors"
              >
                View Fund
              </Link>
            </div>
          </div>

          {/* Balanced Growth (Featured) */}
          <div className="p-8 rounded-3xl border-2 border-[#16A36A] bg-white shadow-xl relative flex flex-col justify-between space-y-6 transform md:-translate-y-2">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#16A36A] text-white text-[10px] font-extrabold uppercase rounded-full tracking-wider shadow-sm">
              MOST POPULAR
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-bold px-3 py-1 rounded-full uppercase bg-[#DCFCE7] text-[#123B5D] border border-[#BBF7D0]">
                Moderate Risk
              </span>
              <h3 className="text-2xl font-bold text-[#123B5D]">Balanced Horizon</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                The golden mean between robust capital growth and downside risk mitigation across bluechip equities and fixed yield.
              </p>
            </div>

            <div className="space-y-3 p-4 rounded-2xl bg-[#DCFCE7]/30 border border-[#BBF7D0]">
              <div className="flex justify-between text-xs">
                <span className="text-[#64748B]">Nifty 50 Bluechip</span>
                <span className="font-bold text-[#1F2937]">50%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#64748B]">High-Yield Corporate Debt</span>
                <span className="font-bold text-[#1F2937]">35%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#64748B]">Gold & Hedging Assets</span>
                <span className="font-bold text-[#1F2937]">15%</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#E2E8F0] flex justify-between items-center">
              <div>
                <span className="text-[10px] text-[#64748B] uppercase font-bold block">Historical Return</span>
                <span className="text-lg font-extrabold text-[#16A36A] font-mono">+13.2% p.a.</span>
              </div>
              <Link
                to="/investments"
                className="px-4 py-2 bg-[#16A36A] hover:bg-[#138959] text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                Invest Now
              </Link>
            </div>
          </div>

          {/* Aggressive Alpha */}
          <div className="p-8 rounded-3xl border border-[#E2E8F0] bg-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="text-[10px] font-bold px-3 py-1 rounded-full uppercase bg-purple-50 text-purple-700 border border-purple-200">
                High Growth
              </span>
              <h3 className="text-2xl font-bold text-[#123B5D]">Aggressive Alpha</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Maximized wealth generation focused on mid-cap growth stocks, tech sectors, and high-beta thematic funds.
              </p>
            </div>

            <div className="space-y-3 p-4 rounded-2xl bg-[#F5F7FA] border border-[#E2E8F0]">
              <div className="flex justify-between text-xs">
                <span className="text-[#64748B]">Mid & Small Cap Growth</span>
                <span className="font-bold text-[#1F2937]">60%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#64748B]">Tech & Green Energy ETFs</span>
                <span className="font-bold text-[#1F2937]">25%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#64748B]">Tactical Cash Reserve</span>
                <span className="font-bold text-[#1F2937]">15%</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#E2E8F0] flex justify-between items-center">
              <div>
                <span className="text-[10px] text-[#64748B] uppercase font-bold block">Historical Return</span>
                <span className="text-lg font-extrabold text-[#16A36A] font-mono">+17.5% p.a.</span>
              </div>
              <Link
                to="/investments"
                className="px-4 py-2 bg-[#DCFCE7] hover:bg-[#16A36A] text-[#123B5D] hover:text-white rounded-xl text-xs font-bold transition-colors"
              >
                View Fund
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PLATFORM FEATURES SUITE */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-[#16A36A] uppercase tracking-widest">Built For Modern Wealth</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#123B5D] tracking-tight">
            Everything You Need To Build Capital
          </h2>
          <p className="text-sm md:text-base text-[#64748B] max-w-xl mx-auto">
            A complete fintech infrastructure built with precision, transparency, and top-tier security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl border border-[#E2E8F0] bg-white hover:border-[#16A36A]/40 transition-all shadow-card-light">
            <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7] text-[#16A36A] flex items-center justify-center mb-6 border border-[#BBF7D0]">
              <FiTrendingUp className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-[#123B5D] mb-3">Dynamic Roundups</h4>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Link multiple debit cards or UPI IDs. Sikka rounds up daily purchases and aggregates fractional investments automatically.
            </p>
          </div>

          <div className="p-8 rounded-3xl border border-[#E2E8F0] bg-white hover:border-[#16A36A]/40 transition-all shadow-card-light">
            <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7] text-[#16A36A] flex items-center justify-center mb-6 border border-[#BBF7D0]">
              <FiCompass className="w-6 h-6 text-[#16A36A]" />
            </div>
            <h4 className="text-xl font-bold text-[#123B5D] mb-3">Algorithmic Risk Profiling</h4>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Take an interactive questionnaire to evaluate your risk appetite and receive mathematically sound asset allocations.
            </p>
          </div>

          <div className="p-8 rounded-3xl border border-[#E2E8F0] bg-white hover:border-[#8B5CF6]/40 transition-all shadow-card-light">
            <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7] text-[#8B5CF6] flex items-center justify-center mb-6 border border-[#BBF7D0]">
              <FiTarget className="w-6 h-6 text-[#8B5CF6]" />
            </div>
            <h4 className="text-xl font-bold text-[#123B5D] mb-3">Goal-Based Targets</h4>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Define goals for downpayments, travel, or emergency reserves. Track automated milestone progress visually.
            </p>
          </div>

          <div className="p-8 rounded-3xl border border-[#E2E8F0] bg-white hover:border-[#123B5D]/40 transition-all shadow-card-light">
            <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7] text-[#123B5D] flex items-center justify-center mb-6 border border-[#BBF7D0]">
              <FiCpu className="w-6 h-6 text-[#123B5D]" />
            </div>
            <h4 className="text-xl font-bold text-[#123B5D] mb-3">AI Financial Advisor</h4>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Chat in real time with our intelligent copilot to analyze spending patterns, goal completion dates, and tax efficiency.
            </p>
          </div>

          <div className="p-8 rounded-3xl border border-[#E2E8F0] bg-white hover:border-[#16A36A]/40 transition-all shadow-card-light">
            <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7] text-[#16A36A] flex items-center justify-center mb-6 border border-[#BBF7D0]">
              <FiMessageSquare className="w-6 h-6 text-[#16A36A]" />
            </div>
            <h4 className="text-xl font-bold text-[#123B5D] mb-3">Advisor Consultation Rooms</h4>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Connect with certified wealth managers directly inside dedicated advisory consultation channels.
            </p>
          </div>

          <div className="p-8 rounded-3xl border border-[#E2E8F0] bg-white hover:border-[#16A36A]/40 transition-all shadow-card-light">
            <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7] text-[#16A36A] flex items-center justify-center mb-6 border border-[#BBF7D0]">
              <FiShield className="w-6 h-6 text-[#16A36A]" />
            </div>
            <h4 className="text-xl font-bold text-[#123B5D] mb-3">Bank-Grade Ledger Security</h4>
            <p className="text-sm text-[#64748B] leading-relaxed">
              End-to-end tokenization, 256-bit encryption, KYC verification workflows, and zero unauthorized data access.
            </p>
          </div>
        </div>
      </section>

      {/* 7. INVESTOR TESTIMONIALS */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs font-bold text-[#16A36A] uppercase tracking-widest">Loved by Savers</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#123B5D] tracking-tight">
            Trusted by Thousands of Investors
          </h2>
          <p className="text-sm md:text-base text-[#64748B] max-w-xl mx-auto">
            See how everyday spenders are creating long-term wealth with Sikka.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className="p-8 rounded-3xl border border-[#E2E8F0] bg-white shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex text-amber-400 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-[#1F2937] leading-relaxed italic">
                  "{t.content}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#123B5D] text-white flex items-center justify-center font-bold text-xs">
                    {t.avatar}
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-[#123B5D]">{t.name}</h5>
                    <span className="text-[11px] text-[#64748B] block">{t.role}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-[#16A36A] bg-[#DCFCE7] px-2 py-0.5 rounded-md font-mono">
                    {t.returns}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FAQ ACCORDION */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold text-[#16A36A] uppercase tracking-widest">Questions & Answers</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#123B5D] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[#64748B]">
            Have questions about micro-investing? We have answers.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-[#E2E8F0] rounded-2xl bg-white overflow-hidden shadow-2xs transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-base text-[#123B5D] hover:bg-[#F5F7FA]/60 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <FiChevronUp className="w-5 h-5 text-[#16A36A] shrink-0" />
                  ) : (
                    <FiChevronDown className="w-5 h-5 text-[#64748B] shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-[#64748B] leading-relaxed border-t border-[#E2E8F0]/60">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. BOTTOM CALL TO ACTION BANNER */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative overflow-hidden rounded-3xl border border-[#0D2A42] bg-[#123B5D] p-10 md:p-16 text-center text-white shadow-2xl space-y-8">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#16A36A]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#1E5380]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <span className="inline-block px-3 py-1 bg-[#0D2A42] border border-[#16A36A]/40 text-[#4ADE80] text-xs font-bold uppercase rounded-full tracking-wider">
              Start in under 2 minutes
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight">
              Ready to Turn Your Daily Spends Into Wealth?
            </h2>
            <p className="text-[#94A3B8] text-base md:text-lg leading-relaxed">
              Join thousands of investors building long-term financial security effortlessly. No minimum balances, zero hidden fees.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap justify-center gap-4 pt-2">
            <Link
              to="/register"
              className="px-8 py-4 bg-[#16A36A] hover:bg-[#138959] text-white font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 text-base flex items-center gap-2"
            >
              Create Your Free Account
              <FiArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-[#0D2A42] hover:bg-[#081C2E] border border-[#1E5380] text-white font-bold rounded-xl transition-all text-base"
            >
              Sign In To Terminal
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
