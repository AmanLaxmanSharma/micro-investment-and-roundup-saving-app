import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "./services/api";
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
import { FiTrendingUp, FiActivity, FiUser, FiUnlock, FiLogOut, FiMenu, FiX } from "react-icons/fi";

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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
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
        theme="dark"
      />

      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/75 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl ${
                  user?.role === "advisor"
                    ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                    : "bg-brand-500/10 border border-brand-500/20 text-brand-400"
                }`}>
                  <FiTrendingUp className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold tracking-tight text-white">
                    Sikka
                  </span>
                  {user?.role === "advisor" && (
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 tracking-wider">
                      Advisor Portal
                    </span>
                  )}
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {!isAuthenticated ? (
                <>
                  <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
                  >
                    Register
                  </Link>
                </>
              ) : user?.role === "advisor" ? (
                <>
                  <Link to="/dashboard" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                    Advisor Terminal
                  </Link>
                  <Link to="/advisory" className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors font-semibold flex items-center gap-1">
                    Client Consultations
                  </Link>
                  <Link to="/investments" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                    Investment Funds
                  </Link>
                  <Link to="/risk-profile" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                    Risk Benchmarks
                  </Link>
                  <Link to="/ai" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                    AI Copilot
                  </Link>
                  <Link to="/kyc" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                    Compliance / KYC
                  </Link>

                  <div className="flex items-center gap-4 pl-4 border-l border-slate-800">
                    <span className="text-xs font-bold px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-md uppercase tracking-wider">
                      ADVISOR
                    </span>
                    <button
                      onClick={handleLogout}
                      className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                      title="Logout"
                    >
                      <FiLogOut className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                    Dashboard
                  </Link>
                  <Link to="/wallet" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                    Wallet
                  </Link>
                  <Link to="/banks" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                    Bank Accounts
                  </Link>
                  <Link to="/transactions" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                    Transactions
                  </Link>
                  <Link to="/roundups" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                    Round-Ups
                  </Link>
                  <Link to="/risk-profile" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                    Risk Profile
                  </Link>
                  <Link to="/investments" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                    Investments
                  </Link>
                  <Link to="/goals" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                    Goals
                  </Link>
                  <Link to="/ai" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                    AI Assistant
                  </Link>
                  <Link to="/advisory" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                    Advisory Room
                  </Link>
                  <Link to="/kyc" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                    KYC Verification
                  </Link>

                  <div className="flex items-center gap-4 pl-4 border-l border-slate-800">
                    <span className="text-xs font-semibold px-2.5 py-1 bg-slate-900 border border-slate-800 text-slate-400 rounded-md">
                      {user?.role?.toUpperCase()}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                      title="Logout"
                    >
                      <FiLogOut className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
              >
                {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-900 bg-slate-950 px-4 pt-2 pb-4 space-y-1">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg">
                  Login
                </Link>
                <Link to="/register" className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg">
                  Register
                </Link>
              </>
            ) : user?.role === "advisor" ? (
              <>
                <Link to="/dashboard" className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg">
                  Advisor Terminal
                </Link>
                <Link to="/advisory" className="block px-3 py-2 text-base font-medium text-emerald-400 hover:bg-slate-900 rounded-lg">
                  Client Consultations
                </Link>
                <Link to="/investments" className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg">
                  Investment Funds
                </Link>
                <Link to="/risk-profile" className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg">
                  Risk Benchmarks
                </Link>
                <Link to="/ai" className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg">
                  AI Copilot
                </Link>
                <Link to="/kyc" className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg">
                  Compliance / KYC
                </Link>
                <div className="pt-4 border-t border-slate-900 flex justify-between items-center px-3">
                  <span className="text-xs font-bold px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded">
                    ADVISOR
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 text-sm font-semibold text-rose-400 hover:text-rose-300"
                  >
                    <FiLogOut /> Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg">
                  Dashboard
                </Link>
                <Link to="/wallet" className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg">
                  Wallet
                </Link>
                <Link to="/banks" className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg">
                  Bank Accounts
                </Link>
                <Link to="/transactions" className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg">
                  Transactions
                </Link>
                <Link to="/roundups" className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg">
                  Round-Ups
                </Link>
                <Link to="/risk-profile" className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg">
                  Risk Profile
                </Link>
                <Link to="/investments" className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg">
                  Investments
                </Link>
                <Link to="/goals" className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg">
                  Goals
                </Link>
                <Link to="/ai" className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg">
                  AI Assistant
                </Link>
                <Link to="/advisory" className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg">
                  Advisory Room
                </Link>
                <Link to="/kyc" className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg">
                  KYC Verification
                </Link>
                <div className="pt-4 border-t border-slate-900 flex justify-between items-center px-3">
                  <span className="text-xs font-semibold px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-400 rounded">
                    {user?.role?.toUpperCase()}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 text-sm font-semibold text-rose-400 hover:text-rose-300"
                  >
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
    </div>
  );
}

