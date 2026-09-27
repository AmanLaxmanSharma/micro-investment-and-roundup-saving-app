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
      ? 'bg-[#DCFCE7] text-[#123B5D] border border-[#16A36A]/30 font-bold shadow-sm' 
      : 'text-[#64748B] hover:text-[#1F2937] hover:bg-[#F5F7FA]'}
  `;

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#1F2937] flex flex-col font-sans">
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

      {/* Dynamic Top Announcement Bar - Deep Navy Blue Brand Bar */}
      <div className="bg-[#123B5D] border-b border-[#0D2A42] py-1.5 px-4 text-center text-xs font-medium text-[#DCFCE7] flex items-center justify-center gap-2 shadow-sm">
        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#16A36A] text-white uppercase tracking-wide">
          LIVE DEMO
        </span>
        <span className="text-white/90">Sikka Automated Round-Ups & Algorithmic Portfolios — Built with 256-bit AES Encryption</span>
      </div>

      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="p-2 rounded-xl transition-all duration-300 bg-[#123B5D] text-white group-hover:scale-105 shadow-sm">
                  <FiTrendingUp className="w-5 h-5 text-[#16A36A]" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-extrabold tracking-tight text-[#123B5D] font-outfit">
                    SIKKA<span className="text-[#16A36A]">.</span>
                  </span>
                  {user?.role === "advisor" ? (
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#123B5D] text-white tracking-wider">
                      Advisor Portal
                    </span>
                  ) : (
                    <span className="hidden sm:inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#DCFCE7] border border-[#E2E8F0] text-[#123B5D] tracking-wider">
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
                  <Link to="/login" className="text-sm font-semibold text-[#64748B] hover:text-[#1F2937] px-3 py-1.5 transition-colors">
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-[#16A36A] hover:bg-[#138959] text-white text-sm font-semibold rounded-xl shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
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
                    <FiMessageSquare className="w-3.5 h-3.5 text-[#16A36A]" /> Consultations
                  </Link>
                  <Link to="/investments" className={navLinkClass('/investments')}>
                    <FiPieChart className="w-3.5 h-3.5" /> Portfolios
                  </Link>
                  <Link to="/risk-profile" className={navLinkClass('/risk-profile')}>
                    <FiZap className="w-3.5 h-3.5 text-[#D97706]" /> Risk Profiling
                  </Link>
                  <Link to="/ai" className={navLinkClass('/ai')}>
                    <FiCpu className="w-3.5 h-3.5 text-[#123B5D]" /> AI Copilot
                  </Link>
                  <Link to="/kyc" className={navLinkClass('/kyc')}>
                    <FiUserCheck className="w-3.5 h-3.5" /> Compliance
                  </Link>

                  <div className="flex items-center gap-3 pl-3 border-l border-[#E2E8F0] ml-2">
                    <span className="text-[10px] font-bold px-2 py-1 bg-[#123B5D] text-white rounded-md uppercase tracking-wider">
                      ADVISOR
                    </span>
                    <button
                      onClick={handleLogout}
                      className="p-2 text-[#64748B] hover:text-[#DC2626] hover:bg-red-50 rounded-lg transition-all"
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
                    <FiLock className="w-3.5 h-3.5 text-[#123B5D]" /> Banks
                  </Link>
                  <Link to="/roundups" className={navLinkClass('/roundups')}>
                    <FiZap className="w-3.5 h-3.5 text-[#D97706]" /> Round-Ups
                  </Link>
                  <Link to="/investments" className={navLinkClass('/investments')}>
                    <FiPieChart className="w-3.5 h-3.5 text-[#16A36A]" /> Invest
                  </Link>
                  <Link to="/goals" className={navLinkClass('/goals')}>
                    <FiLayers className="w-3.5 h-3.5 text-[#8B5CF6]" /> Goals
                  </Link>
                  <Link to="/ai" className={navLinkClass('/ai')}>
                    <FiCpu className="w-3.5 h-3.5 text-[#123B5D]" /> AI Assistant
                  </Link>
                  <Link to="/advisory" className={navLinkClass('/advisory')}>
                    <FiMessageSquare className="w-3.5 h-3.5" /> Advisory
                  </Link>

                  <div className="flex items-center gap-3 pl-3 border-l border-[#E2E8F0] ml-2">
                    <div className="flex items-center gap-2 bg-[#DCFCE7] border border-[#E2E8F0] px-2.5 py-1 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-[#16A36A] animate-pulse"></div>
                      <span className="text-xs font-bold text-[#123B5D]">
                        {user?.name || user?.role?.toUpperCase()}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="p-2 text-[#64748B] hover:text-[#DC2626] hover:bg-red-50 rounded-lg transition-all"
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
                className="inline-flex items-center justify-center p-2 rounded-lg text-[#64748B] hover:text-[#1F2937] hover:bg-[#F5F7FA] transition-colors"
              >
                {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E2E8F0] bg-white px-4 pt-3 pb-5 space-y-1.5 shadow-xl">
            {!isAuthenticated ? (
              <div className="space-y-2 pt-1">
                <Link to="/login" className="block px-3 py-2.5 text-base font-semibold text-[#64748B] hover:text-[#1F2937] hover:bg-[#F5F7FA] rounded-xl">
                  Log In
                </Link>
                <Link to="/register" className="block px-3 py-2.5 text-center text-base font-semibold bg-[#16A36A] hover:bg-[#138959] text-white rounded-xl shadow-sm">
                  Register
                </Link>
              </div>
            ) : user?.role === "advisor" ? (
              <>
                <Link to="/dashboard" className="block px-3 py-2 text-sm font-semibold text-[#64748B] hover:text-[#123B5D] hover:bg-[#F5F7FA] rounded-lg">
                  Advisor Terminal
                </Link>
                <Link to="/advisory" className="block px-3 py-2 text-sm font-semibold text-[#16A36A] hover:bg-[#DCFCE7] rounded-lg">
                  Client Consultations
                </Link>
                <Link to="/investments" className="block px-3 py-2 text-sm font-semibold text-[#64748B] hover:text-[#123B5D] hover:bg-[#F5F7FA] rounded-lg">
                  Investment Funds
                </Link>
                <Link to="/risk-profile" className="block px-3 py-2 text-sm font-semibold text-[#64748B] hover:text-[#123B5D] hover:bg-[#F5F7FA] rounded-lg">
                  Risk Benchmarks
                </Link>
                <Link to="/ai" className="block px-3 py-2 text-sm font-semibold text-[#64748B] hover:text-[#123B5D] hover:bg-[#F5F7FA] rounded-lg">
                  AI Copilot
                </Link>
                <Link to="/kyc" className="block px-3 py-2 text-sm font-semibold text-[#64748B] hover:text-[#123B5D] hover:bg-[#F5F7FA] rounded-lg">
                  Compliance / KYC
                </Link>
                <div className="pt-3 border-t border-[#E2E8F0] flex justify-between items-center px-3">
                  <span className="text-xs font-bold px-2.5 py-1 bg-[#123B5D] text-white rounded-md">
                    ADVISOR
                  </span>
                  <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm font-semibold text-[#DC2626]">
                    <FiLogOut /> Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="block px-3 py-2 text-sm font-semibold text-[#64748B] hover:text-[#123B5D] hover:bg-[#F5F7FA] rounded-lg">
                  Dashboard
                </Link>
                <Link to="/wallet" className="block px-3 py-2 text-sm font-semibold text-[#64748B] hover:text-[#123B5D] hover:bg-[#F5F7FA] rounded-lg">
                  Wallet Balance
                </Link>
                <Link to="/banks" className="block px-3 py-2 text-sm font-semibold text-[#64748B] hover:text-[#123B5D] hover:bg-[#F5F7FA] rounded-lg">
                  Linked Banks
                </Link>
                <Link to="/transactions" className="block px-3 py-2 text-sm font-semibold text-[#64748B] hover:text-[#123B5D] hover:bg-[#F5F7FA] rounded-lg">
                  Transaction History
                </Link>
                <Link to="/roundups" className="block px-3 py-2 text-sm font-semibold text-[#64748B] hover:text-[#123B5D] hover:bg-[#F5F7FA] rounded-lg">
                  Round-Up Rules
                </Link>
                <Link to="/risk-profile" className="block px-3 py-2 text-sm font-semibold text-[#64748B] hover:text-[#123B5D] hover:bg-[#F5F7FA] rounded-lg">
                  Risk Profile
                </Link>
                <Link to="/investments" className="block px-3 py-2 text-sm font-semibold text-[#64748B] hover:text-[#123B5D] hover:bg-[#F5F7FA] rounded-lg">
                  Investments
                </Link>
                <Link to="/goals" className="block px-3 py-2 text-sm font-semibold text-[#64748B] hover:text-[#123B5D] hover:bg-[#F5F7FA] rounded-lg">
                  Financial Goals
                </Link>
                <Link to="/ai" className="block px-3 py-2 text-sm font-semibold text-[#64748B] hover:text-[#123B5D] hover:bg-[#F5F7FA] rounded-lg">
                  AI Financial Assistant
                </Link>
                <Link to="/advisory" className="block px-3 py-2 text-sm font-semibold text-[#64748B] hover:text-[#123B5D] hover:bg-[#F5F7FA] rounded-lg">
                  Advisory Room
                </Link>
                <Link to="/kyc" className="block px-3 py-2 text-sm font-semibold text-[#64748B] hover:text-[#123B5D] hover:bg-[#F5F7FA] rounded-lg">
                  KYC Verification
                </Link>
                <div className="pt-3 border-t border-[#E2E8F0] flex justify-between items-center px-3">
                  <span className="text-xs font-semibold px-2.5 py-1 bg-[#F5F7FA] border border-[#E2E8F0] text-[#123B5D] rounded-md">
                    {user?.name || user?.role?.toUpperCase()}
                  </span>
                  <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm font-semibold text-[#DC2626]">
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
      <footer className="border-t border-[#E2E8F0] bg-white pt-12 pb-8 text-[#64748B] text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-[#E2E8F0]">
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#123B5D] text-white rounded-lg">
                  <FiTrendingUp className="w-4 h-4 text-[#16A36A]" />
                </div>
                <span className="text-lg font-extrabold text-[#123B5D] tracking-tight">SIKKA</span>
              </div>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Smart micro-investing and spare-change roundups powered by automated risk-adjusted portfolios and AI financial copilot.
              </p>
              <div className="flex items-center gap-2 pt-1 text-[11px] text-[#16A36A] font-bold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A36A] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16A36A]"></span>
                </span>
                Ledger API Online & Synchronized
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#123B5D] mb-3">Platform</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/investments" className="hover:text-[#16A36A] transition-colors">Micro-Portfolios</Link></li>
                <li><Link to="/roundups" className="hover:text-[#16A36A] transition-colors">Auto Round-Ups</Link></li>
                <li><Link to="/goals" className="hover:text-[#16A36A] transition-colors">Goal Tracker</Link></li>
                <li><Link to="/ai" className="hover:text-[#16A36A] transition-colors">AI Financial Advisor</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#123B5D] mb-3">Security & Trust</h4>
              <ul className="space-y-2 text-xs">
                <li className="flex items-center gap-1.5 text-[#64748B]"><FiShield className="text-[#16A36A]" /> 256-Bit SSL Encryption</li>
                <li className="flex items-center gap-1.5 text-[#64748B]"><FiCheckCircle className="text-[#16A36A]" /> Razorpay Secured Checkout</li>
                <li className="flex items-center gap-1.5 text-[#64748B]"><FiLock className="text-[#123B5D]" /> Regulatory Advisory Protocol</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#123B5D] mb-3">Compliance Note</h4>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                Investments are subject to market risks. Read all scheme related documents carefully before investing. Past performance is not indicative of future returns.
              </p>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#94A3B8]">
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
