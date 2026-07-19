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
    const P = monthlyInvestment;
    const r = interestRate / 100 / 12;
    const n = years * 12;
    if (r === 0) return P * n;
    
    // FV = P * (((1 + r)^n - 1) / r) * (1 + r)
    const futureValue = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const totalInvested = P * n;
    const returns = futureValue - totalInvested;

    return {
      total: futureValue.toLocaleString("en-US", { maximumFractionDigits: 0 }),
      invested: totalInvested.toLocaleString("en-US", { maximumFractionDigits: 0 }),
      returns: returns.toLocaleString("en-US", { maximumFractionDigits: 0 }),
      rawFutureValue: futureValue
    };
  };

  const results = computeCompoundInterest();

  return (
    <div className="relative min-h-[calc(100vh-73px)] w-full overflow-hidden bg-slate-950 text-slate-100 pb-20">
      
      {/* Background Decorative Mesh Gradients */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-brand-950/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-500/10 blur-[130px] animate-pulse-slow pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-[150px] animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-[10%] left-[15%] w-[450px] h-[450px] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-28 text-center space-y-8 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-500/20 bg-brand-500/5 backdrop-blur-md text-xs font-semibold text-brand-400">
          <FiZap className="w-4 h-4 text-yellow-400 animate-bounce" />
          <span>V2.0: Smart Compound & Ledger Diagnostics Enabled</span>
        </div>

        <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-none bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
          Invest Spare Change <br className="hidden md:inline" />
          <span className="bg-gradient-to-r from-brand-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Automagically.
          </span>
        </h1>

        <p className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-normal">
          Sikka connects your daily purchases with micro-investments. Round up transaction spare change to build diversified portfolios tailored to your personalized risk tolerance.
        </p>

        <div className="flex flex-wrap justify-center gap-5 pt-4">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="group px-8 py-4 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold rounded-xl shadow-lg shadow-brand-500/25 transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
            >
              Go to Dashboard
              <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="group px-8 py-4 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold rounded-xl shadow-lg shadow-brand-500/25 transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
              >
                Get Started
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/register"
                className="px-8 py-4 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold rounded-xl transition-all duration-300 shadow-sm"
              >
                Register Account
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Live Round-up Simulator & Interactive Interest Calculator Row */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 md:mt-36 grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Dynamic Round-up Simulator */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden animate-fade-in-up-delayed">
          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
            <FiCreditCard className="w-48 h-48 text-brand-400" />
          </div>

          <div className="space-y-6 relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">Interactive Live Demo</span>
                <h3 className="text-2xl font-bold text-white mt-1">Sikka Auto-Roundups</h3>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-xs font-semibold text-green-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block animate-ping" />
                Live Feed
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed">
              Every time you spend, Sikka rounds up to the nearest dollar and auto-invests. Watch how it works in real-time below:
            </p>

            {/* Simulated Feed */}
            <div className="space-y-3.5 mt-4 min-h-[220px]">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/80 border border-slate-900/60 shadow-sm transition-all duration-500 hover:border-slate-800"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="text-2xl w-10 h-10 rounded-xl bg-slate-900 border border-slate-850 flex items-center justify-center">
                      {tx.logo}
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{tx.merchant}</h4>
                      <p className="text-xs text-slate-500">Transaction: ${tx.spent.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-brand-400">+${tx.rounded.toFixed(2)}</span>
                    <p className="text-xs text-slate-500">Rounded Up</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80 mt-6 flex justify-between items-center bg-gradient-to-r from-brand-950/20 to-transparent p-4 rounded-2xl">
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Total Invested This Month</p>
              <h4 className="text-3xl font-extrabold text-white mt-1">${simulatorTotal.toFixed(2)}</h4>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold px-2 py-1 rounded bg-brand-500/10 text-brand-400">Compounding 8.5% APY</span>
            </div>
          </div>
        </div>

        {/* Interactive Compound Calculator */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden animate-fade-in-up-delayed">
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Growth Estimator</span>
              <h3 className="text-2xl font-bold text-white mt-1">See Your Money Compound</h3>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed">
              Find out how investing small amounts of spare change consistently grows over time.
            </p>

            <div className="space-y-5">
              {/* Slider 1: Monthly Investment */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-medium">Monthly Contribution</span>
                  <span className="text-brand-400 font-bold">${monthlyInvestment}/mo</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="500"
                  step="10"
                  value={monthlyInvestment}
                  onChange={(e) => setMonthlyInvestment(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-brand-500"
                />
              </div>

              {/* Slider 2: Years */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-medium">Investment Horizon</span>
                  <span className="text-indigo-400 font-bold">{years} Years</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={years}
                  onChange={(e) => setYears(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              {/* Slider 3: Interest Rate */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-medium">Expected Annual Yield</span>
                  <span className="text-purple-400 font-bold">{interestRate}% APY</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="15"
                  step="0.5"
                  value={interestRate}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80 mt-6 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-900/60">
              <span className="text-xs text-slate-500 block">Total Invested</span>
              <span className="text-xl font-bold text-slate-300">${results.invested}</span>
            </div>
            <div className="p-4 rounded-2xl bg-brand-500/5 border border-brand-500/10">
              <span className="text-xs text-brand-400 block font-semibold">Total Wealth Value</span>
              <span className="text-2xl font-black text-white">${results.total}</span>
              <span className="text-[10px] text-green-400 block mt-0.5">+${results.returns} earnings</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Timeline */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32 md:mt-48 text-center space-y-16">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
            As Simple As Spending Cash
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Sikka works in the background of your life. Get started in four simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="relative group p-6 rounded-2xl border border-slate-900 bg-slate-950/40 hover:border-slate-800 transition-all">
            <div className="absolute top-4 left-4 text-4xl font-extrabold text-slate-800 group-hover:text-brand-500/20 transition-colors">01</div>
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mx-auto mb-6 text-xl font-bold relative z-10">
              ⚡
            </div>
            <h4 className="text-lg font-bold text-white mb-2 relative z-10">Link Accounts</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Connect your banks safely through our encrypted, bank-grade ledger protocols.
            </p>
          </div>

          <div className="relative group p-6 rounded-2xl border border-slate-900 bg-slate-950/40 hover:border-slate-800 transition-all">
            <div className="absolute top-4 left-4 text-4xl font-extrabold text-slate-800 group-hover:text-indigo-500/20 transition-colors">02</div>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-6 text-xl font-bold relative z-10">
              📋
            </div>
            <h4 className="text-lg font-bold text-white mb-2 relative z-10">Assess Risk</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Take a quick interactive quiz to match your investment style: conservative, moderate, or aggressive.
            </p>
          </div>

          <div className="relative group p-6 rounded-2xl border border-slate-900 bg-slate-950/40 hover:border-slate-800 transition-all">
            <div className="absolute top-4 left-4 text-4xl font-extrabold text-slate-800 group-hover:text-purple-500/20 transition-colors">03</div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto mb-6 text-xl font-bold relative z-10">
              ☕
            </div>
            <h4 className="text-lg font-bold text-white mb-2 relative z-10">Spend Normally</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Pay for daily things like coffee or utilities. Sikka rounds up automatically in the background.
            </p>
          </div>

          <div className="relative group p-6 rounded-2xl border border-slate-900 bg-slate-950/40 hover:border-slate-800 transition-all">
            <div className="absolute top-4 left-4 text-4xl font-extrabold text-slate-800 group-hover:text-pink-500/20 transition-colors">04</div>
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center mx-auto mb-6 text-xl font-bold relative z-10">
              📈
            </div>
            <h4 className="text-lg font-bold text-white mb-2 relative z-10">Scale & Prosper</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Watch your spare change compound into real diversified assets and track your metrics.
            </p>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32 md:mt-48 space-y-16">
        <div className="text-center space-y-4">
          <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">Comprehensive Wealth Infrastructure</span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
            Engineered For Micro-Investing
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="group p-8 rounded-3xl border border-slate-900 bg-slate-950/50 backdrop-blur-md hover:border-brand-500/35 transition-all duration-300 hover:-translate-y-1.5">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FiTrendingUp className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-white mb-3">Dynamic Roundups</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Link multiple debit or credit cards. Our engine captures transactions and processes fraction roundups securely.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group p-8 rounded-3xl border border-slate-900 bg-slate-950/50 backdrop-blur-md hover:border-indigo-500/35 transition-all duration-300 hover:-translate-y-1.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FiCompass className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-white mb-3">Algorithmic Risk Profiling</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Take an interactive profiling test designed to calculate your exact financial goals, age-based models, and risk threshold.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group p-8 rounded-3xl border border-slate-900 bg-slate-950/50 backdrop-blur-md hover:border-purple-500/35 transition-all duration-300 hover:-translate-y-1.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FiTarget className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-white mb-3">Goal-Based Targets</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Create targets for vacations, downpayments, or emergency cash reserves. Allocate automatic recurring streams.
            </p>
          </div>

          {/* Card 4 */}
          <div className="group p-8 rounded-3xl border border-slate-900 bg-slate-950/50 backdrop-blur-md hover:border-pink-500/35 transition-all duration-300 hover:-translate-y-1.5">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FiCpu className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-white mb-3">AI Financial Advisor</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Interact with a custom AI chatbot that checks transaction tables, evaluates savings habits, and suggests optimizations.
            </p>
          </div>

          {/* Card 5 */}
          <div className="group p-8 rounded-3xl border border-slate-900 bg-slate-950/50 backdrop-blur-md hover:border-teal-500/35 transition-all duration-300 hover:-translate-y-1.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FiMessageSquare className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-white mb-3">Peer Advisory Rooms</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Access real-time advisory chat rooms to bounce strategies off professional investment advisors and community peers.
            </p>
          </div>

          {/* Card 6 */}
          <div className="group p-8 rounded-3xl border border-slate-900 bg-slate-950/50 backdrop-blur-md hover:border-amber-500/35 transition-all duration-300 hover:-translate-y-1.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FiShield className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-white mb-3">Bank-Grade Ledger Security</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              End-to-end tokenization, SSL layers, rigid KYC checkflows, and fully encrypted database access rules.
            </p>
          </div>
        </div>
      </section>

      {/* Security & Health Diagnostics Node */}
      <section className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-32 md:mt-44 text-center animate-fade-in-up-more-delayed">
        <div className="p-8 rounded-3xl border border-slate-900 bg-slate-950/80 backdrop-blur-xl relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-brand-500 to-transparent" />
          
          <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-500 mb-5 flex items-center justify-center gap-2">
            <FiActivity className="text-brand-400 animate-pulse" />
            Sikka Ledger Gateway Diagnostic
          </h3>

          {healthData ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left mt-2">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-850">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Node Status</span>
                <span className="font-mono text-sm text-green-400 font-semibold flex items-center gap-1.5 mt-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block animate-ping" />
                  {healthData.status.toUpperCase()}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-850">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Ledger Ping</span>
                <span className="font-mono text-sm text-slate-300 font-semibold block mt-1">
                  {new Date(healthData.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-850">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Port Connection</span>
                <span className="font-mono text-sm text-brand-400 font-semibold block mt-1">
                  SECURE HTTPS
                </span>
              </div>
            </div>
          ) : error ? (
            <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-rose-450 font-medium text-sm">
              {error}
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3 text-sm text-slate-400 py-4">
              <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
              <span>Checking network node ledger diagnostics...</span>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
