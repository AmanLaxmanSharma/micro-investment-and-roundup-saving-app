import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import BankAccountsPage from "./pages/BankAccountsPage";
import TransactionsPage from "./pages/TransactionsPage";
import RoundUpsPage from "./pages/RoundUpsPage";
import RiskProfilePage from "./pages/RiskProfilePage";
import InvestmentsPage from "./pages/InvestmentsPage";
import KycPage from "./pages/KycPage";
import WalletPage from "./pages/WalletPage";
import GoalsPage from "./pages/GoalsPage";
import AiPage from "./pages/AiPage";
import AdvisoryPage from "./pages/AdvisoryPage";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./routes/ProtectedRoute";
import { clearCredentials } from "./redux/authSlice";
import { 
  FiTrendingUp, 
  FiLogOut, 
  FiMenu, 
  FiX, 
  FiShield, 
  FiCheckCircle, 
  FiLock,
  FiZap,
  FiPieChart,
  FiGrid,
  FiDollarSign,
  FiUserCheck,
  FiCpu,
  FiMessageSquare,
  FiLayers
} from "react-icons/fi";

export default function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(clearCredentials());
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) => `
    text-xs font-semibold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5
    ${isActive(path) 
      ? 'bg-[#E3F5ED] text-[#123B2A] border border-[#18A66A]/30 font-bold shadow-sm' 
      : 'text-[#60736A] hover:text-[#15231D] hover:bg-[#E3F5ED]/50'}
  `;

  return (
    <div className="min-h-screen bg-[#F5F7F2] text-[#15231D] flex flex-col font-sans">
      {/* Toast Notification Container */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Dynamic Top Announcement Bar - Rich Forest Green Dark Component */}
      <div className="bg-[#123B2A] border-b border-[#1B4D38] py-1.5 px-4 text-center text-xs font-medium text-[#E3F5ED] flex items-center justify-center gap-2 shadow-sm">
        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#18A66A] text-white uppercase tracking-wide">
          LIVE DEMO
        </span>
        <span>Sikka Automated Round-Ups & Algorithmic Portfolios — Built with 256-bit AES Encryption</span>
      </div>

      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 bg-white/95 border-b border-[#D7E2DC] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-3 group">
                <div className={`p-2 rounded-xl transition-all duration-300 ${
                  user?.role === "advisor"
                    ? "bg-[#123B2A] text-[#55CFA0] group-hover:scale-105"
                    : "bg-[#123B2A] text-[#55CFA0] group-hover:scale-105 shadow-sm"
                }`}>
                  <FiTrendingUp className="w-5 h-5 text-[#55CFA0]" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-extrabold tracking-tight text-[#15231D] font-outfit">
                    SIKKA<span className="text-[#18A66A]">.</span>
                  </span>
                  {user?.role === "advisor" ? (
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#123B2A] text-[#55CFA0] tracking-wider">
                      Advisor Portal
                    </span>
                  ) : (
                    <span className="hidden sm:inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#E3F5ED] border border-[#D7E2DC] text-[#123B2A] tracking-wider">
                      FINTECH
                    </span>
                  )}
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1.5">
              {!isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <Link to="/login" className="text-sm font-semibold text-[#60736A] hover:text-[#15231D] px-3 py-1.5 transition-colors">
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-[#18A66A] hover:bg-[#159A63] text-white text-sm font-semibold rounded-xl shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Get Started Free
                  </Link>
                </div>
              ) : user?.role === "advisor" ? (
                <>
                  <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                    <FiGrid className="w-3.5 h-3.5" /> Advisor Terminal
                  </Link>
                  <Link to="/advisory" className={navLinkClass('/advisory')}>
                    <FiMessageSquare className="w-3.5 h-3.5 text-[#18A66A]" /> Consultations
                  </Link>
                  <Link to="/investments" className={navLinkClass('/investments')}>
                    <FiPieChart className="w-3.5 h-3.5" /> Portfolios
                  </Link>
                  <Link to="/risk-profile" className={navLinkClass('/risk-profile')}>
                    <FiZap className="w-3.5 h-3.5 text-[#D69A35]" /> Risk Profiling
                  </Link>
                  <Link to="/ai" className={navLinkClass('/ai')}>
                    <FiCpu className="w-3.5 h-3.5 text-[#4778D9]" /> AI Copilot
                  </Link>
                  <Link to="/kyc" className={navLinkClass('/kyc')}>
                    <FiUserCheck className="w-3.5 h-3.5" /> Compliance
                  </Link>

                  <div className="flex items-center gap-3 pl-3 border-l border-[#D7E2DC] ml-2">
                    <span className="text-[10px] font-bold px-2 py-1 bg-[#123B2A] text-[#55CFA0] rounded-md uppercase tracking-wider">
                      ADVISOR
                    </span>
                    <button
                      onClick={handleLogout}
                      className="p-2 text-[#60736A] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      title="Logout"
                    >
                      <FiLogOut className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                    <FiGrid className="w-3.5 h-3.5" /> Dashboard
                  </Link>
                  <Link to="/wallet" className={navLinkClass('/wallet')}>
                    <FiDollarSign className="w-3.5 h-3.5" /> Wallet
                  </Link>
                  <Link to="/banks" className={navLinkClass('/banks')}>
                    <FiLock className="w-3.5 h-3.5 text-[#4778D9]" /> Banks
                  </Link>
                  <Link to="/roundups" className={navLinkClass('/roundups')}>
                    <FiZap className="w-3.5 h-3.5 text-[#D69A35]" /> Round-Ups
                  </Link>
                  <Link to="/investments" className={navLinkClass('/investments')}>
                    <FiPieChart className="w-3.5 h-3.5 text-[#18A66A]" /> Invest
                  </Link>
                  <Link to="/goals" className={navLinkClass('/goals')}>
                    <FiLayers className="w-3.5 h-3.5 text-[#7658C9]" /> Goals
                  </Link>
                  <Link to="/ai" className={navLinkClass('/ai')}>
                    <FiCpu className="w-3.5 h-3.5 text-[#4778D9]" /> AI Assistant
                  </Link>
                  <Link to="/advisory" className={navLinkClass('/advisory')}>
                    <FiMessageSquare className="w-3.5 h-3.5" /> Advisory
                  </Link>

                  <div className="flex items-center gap-3 pl-3 border-l border-[#D7E2DC] ml-2">
                    <div className="flex items-center gap-2 bg-[#E3F5ED] border border-[#D7E2DC] px-2.5 py-1 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-[#18A66A] animate-pulse"></div>
                      <span className="text-xs font-bold text-[#123B2A]">
                        {user?.name || user?.role?.toUpperCase()}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="p-2 text-[#60736A] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      title="Logout"
                    >
                      <FiLogOut className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-lg text-[#60736A] hover:text-[#15231D] hover:bg-[#E3F5ED] transition-colors"
              >
                {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-4 pt-3 pb-5 space-y-1.5 shadow-2xl">
            {!isAuthenticated ? (
              <div className="space-y-2 pt-1">
                <Link to="/login" className="block px-3 py-2.5 text-base font-semibold text-slate-300 hover:text-white hover:bg-slate-900 rounded-xl">
                  Log In
                </Link>
                <Link to="/register" className="block px-3 py-2.5 text-center text-base font-semibold bg-brand-600 hover:bg-brand-500 text-white rounded-xl">
                  Register
                </Link>
              </div>
            ) : user?.role === "advisor" ? (
              <>
                <Link to="/dashboard" className="block px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-900 rounded-lg">
                  Advisor Terminal
                </Link>
                <Link to="/advisory" className="block px-3 py-2 text-sm font-medium text-emerald-400 hover:bg-slate-900 rounded-lg">
                  Client Consultations
                </Link>
                <Link to="/investments" className="block px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-900 rounded-lg">
                  Investment Funds
                </Link>
                <Link to="/risk-profile" className="block px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-900 rounded-lg">
                  Risk Benchmarks
                </Link>
                <Link to="/ai" className="block px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-900 rounded-lg">
                  AI Copilot
                </Link>
                <Link to="/kyc" className="block px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-900 rounded-lg">
                  Compliance / KYC
                </Link>
                <div className="pt-3 border-t border-slate-900 flex justify-between items-center px-3">
                  <span className="text-xs font-bold px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-md">
                    ADVISOR
                  </span>
                  <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm font-semibold text-rose-400">
                    <FiLogOut /> Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="block px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-900 rounded-lg">
                  Dashboard
                </Link>
                <Link to="/wallet" className="block px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-900 rounded-lg">
                  Wallet Balance
                </Link>
                <Link to="/banks" className="block px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-900 rounded-lg">
                  Linked Banks
                </Link>
                <Link to="/transactions" className="block px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-900 rounded-lg">
                  Transaction History
                </Link>
                <Link to="/roundups" className="block px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-900 rounded-lg">
                  Round-Up Rules
                </Link>
                <Link to="/risk-profile" className="block px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-900 rounded-lg">
                  Risk Profile
                </Link>
                <Link to="/investments" className="block px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-900 rounded-lg">
                  Investments
                </Link>
                <Link to="/goals" className="block px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-900 rounded-lg">
                  Financial Goals
                </Link>
                <Link to="/ai" className="block px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-900 rounded-lg">
                  AI Financial Assistant
                </Link>
                <Link to="/advisory" className="block px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-900 rounded-lg">
                  Advisory Room
                </Link>
                <Link to="/kyc" className="block px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-900 rounded-lg">
                  KYC Verification
                </Link>
                <div className="pt-3 border-t border-slate-900 flex justify-between items-center px-3">
                  <span className="text-xs font-semibold px-2.5 py-1 bg-slate-900 border border-slate-800 text-slate-300 rounded-md">
                    {user?.name || user?.role?.toUpperCase()}
                  </span>
                  <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm font-semibold text-rose-400">
                    <FiLogOut /> Logout
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <LoginPage />
              )
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <RegisterPage />
              )
            }
          />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/banks" element={<BankAccountsPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/roundups" element={<RoundUpsPage />} />
            <Route path="/risk-profile" element={<RiskProfilePage />} />
            <Route path="/investments" element={<InvestmentsPage />} />
            <Route path="/goals" element={<GoalsPage />} />
            <Route path="/ai" element={<AiPage />} />
            <Route path="/advisory" element={<AdvisoryPage />} />
            <Route path="/kyc" element={<KycPage />} />
          </Route>
        </Routes>
      </main>

      {/* Corporate Footer */}
      <footer className="border-t border-[#D7E2DC] bg-[#F5F7F2] pt-12 pb-8 text-[#60736A] text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-[#D7E2DC]">
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#123B2A] text-[#55CFA0] rounded-lg">
                  <FiTrendingUp className="w-4 h-4 text-[#55CFA0]" />
                </div>
                <span className="text-lg font-extrabold text-[#15231D] tracking-tight">SIKKA</span>
              </div>
              <p className="text-xs text-[#60736A] leading-relaxed">
                Smart micro-investing and spare-change roundups powered by automated risk-adjusted portfolios and AI financial copilot.
              </p>
              <div className="flex items-center gap-2 pt-1 text-[11px] text-[#18A66A] font-bold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#18A66A] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#18A66A]"></span>
                </span>
                Ledger API Online & Synchronized
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#15231D] mb-3">Platform</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/investments" className="hover:text-[#18A66A] transition-colors">Micro-Portfolios</Link></li>
                <li><Link to="/roundups" className="hover:text-[#18A66A] transition-colors">Auto Round-Ups</Link></li>
                <li><Link to="/goals" className="hover:text-[#18A66A] transition-colors">Goal Tracker</Link></li>
                <li><Link to="/ai" className="hover:text-[#18A66A] transition-colors">AI Financial Advisor</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#15231D] mb-3">Security & Trust</h4>
              <ul className="space-y-2 text-xs">
                <li className="flex items-center gap-1.5 text-[#60736A]"><FiShield className="text-[#18A66A]" /> 256-Bit SSL Encryption</li>
                <li className="flex items-center gap-1.5 text-[#60736A]"><FiCheckCircle className="text-[#159A63]" /> Razorpay Secured Checkout</li>
                <li className="flex items-center gap-1.5 text-[#60736A]"><FiLock className="text-[#4778D9]" /> Regulatory Advisory Protocol</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#15231D] mb-3">Compliance Note</h4>
              <p className="text-[11px] text-[#8A9A92] leading-relaxed">
                Investments are subject to market risks. Read all scheme related documents carefully before investing. Past performance is not indicative of future returns.
              </p>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#8A9A92]">
            <p>© {new Date().getFullYear()} Sikka Micro-Investment Platform. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Security Standards</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
