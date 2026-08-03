import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import api from "../services/api";
import {
  FiCreditCard,
  FiTrendingUp,
  FiArrowUpCircle,
  FiArrowDownCircle,
  FiInbox,
  FiCheckCircle,
  FiShield,
  FiZap,
  FiClock,
  FiDollarSign,
  FiSmartphone
} from "react-icons/fi";

const parseAmount = (val) => {
  if (val === null || val === undefined) return 0;
  if (typeof val === "number") return val;
  if (typeof val === "object" && val.$numberDecimal !== undefined) {
    return parseFloat(val.$numberDecimal) || 0;
  }
  const parsed = parseFloat(val);
  return isNaN(parsed) ? 0 : parsed;
};

export default function WalletPage() {
  const { user } = useSelector((state) => state.auth);
  const isAdvisor = user?.role === "advisor";
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingDeposit, setSubmittingDeposit] = useState(false);
  const [submittingWithdraw, setSubmittingWithdraw] = useState(false);
  
  // Pending payment state for simulating payment authorizations
  const [pendingPayment, setPendingPayment] = useState(null);

  const depositForm = useForm({ defaultValues: { amount: "" } });
  const withdrawForm = useForm({ defaultValues: { amount: "" } });

  const fetchWalletData = async () => {
    try {
      const [walletRes, txRes] = await Promise.all([
        api.get("/api/wallet"),
        api.get("/api/wallet/transactions"),
      ]);
      setWallet(walletRes.data.data.wallet);
      setTransactions(txRes.data.data.transactions || []);
    } catch (err) {
      toast.error("Could not retrieve wallet balance details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleDepositSubmit = async (data) => {
    const amountVal = parseFloat(data.amount);
    if (isNaN(amountVal) || amountVal < 1) {
      depositForm.setError("amount", { type: "manual", message: "Minimum deposit is ₹1.00" });
      return;
    }

    setSubmittingDeposit(true);
    try {
      const response = await api.post("/api/wallet/deposit", {
        amount: amountVal,
      });
      const order = response.data.data.order;

      const isLoaded = await loadRazorpayScript();
      const keyId = order.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID;

      if (isLoaded && window.Razorpay && keyId) {
        const options = {
          key: keyId,
          amount: order.amountInPaise || Math.round(order.amount * 100),
          currency: order.currency || "INR",
          name: "Sikka Micro Investment",
          description: "Wallet Cash Deposit",
          order_id: order.gatewayOrderId,
          handler: async function (res) {
            try {
              await api.post("/api/wallet/confirm-deposit", {
                gatewayOrderId: res.razorpay_order_id,
                gatewayPaymentId: res.razorpay_payment_id,
                razorpaySignature: res.razorpay_signature,
              });
              toast.success(`Successfully added ₹${parseFloat(order.amount).toFixed(2)} to your Sikka Wallet!`);
              depositForm.reset();
              fetchWalletData();
            } catch (err) {
              toast.error("Payment verification failed.");
            }
          },
          prefill: {
            name: user?.name || "Sikka Investor",
            email: user?.email || "",
          },
          theme: {
            color: "#0284c7",
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (res) {
          toast.error(`Payment failed: ${res.error?.description || "Transaction declined"}`);
        });
        rzp.open();
      } else {
        // Fallback simulation modal
        setPendingPayment(order);
        toast.info("Payment intent created. Complete simulated authorization.");
        depositForm.reset();
      }
    } catch (err) {
      toast.error("Could not initiate deposit order.");
    } finally {
      setSubmittingDeposit(false);
    }
  };

  const setPresetDeposit = (val) => {
    depositForm.setValue("amount", val.toString());
  };

  const confirmSimulatedPayment = async () => {
    if (!pendingPayment) return;
    try {
      await api.post("/api/wallet/confirm-deposit", {
        gatewayOrderId: pendingPayment.gatewayOrderId,
        gatewayPaymentId: `pay_${Date.now()}`,
      });
      toast.success(`Allocated ₹${parseAmount(pendingPayment.amount).toFixed(2)} to wallet balance!`);
      setPendingPayment(null);
      fetchWalletData();
    } catch (err) {
      toast.error("Could not confirm deposit.");
    }
  };

  const handleWithdrawSubmit = async (data) => {
    const amount = parseFloat(data.amount);
    const balance = parseAmount(wallet?.balance);

    if (isNaN(amount) || amount < 1) {
      withdrawForm.setError("amount", { type: "manual", message: "Minimum withdrawal is ₹1.00" });
      return;
    }

    if (amount > balance) {
      withdrawForm.setError("amount", {
        type: "manual",
        message: "Insufficient wallet balance.",
      });
      return;
    }

    setSubmittingWithdraw(true);
    try {
      await api.post("/api/wallet/withdraw", { amount });
      toast.success(`Successfully withdrew ₹${amount.toFixed(2)} from Sikka Wallet.`);
      withdrawForm.reset();
      fetchWalletData();
    } catch (err) {
      // Intercepted
    } finally {
      setSubmittingWithdraw(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center gap-3">
        <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-slate-400 font-medium">Loading wallet ledger...</span>
      </div>
    );
  }

  const walletBalance = parseAmount(wallet?.balance);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      {/* Header Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-bold uppercase tracking-wider mb-2">
            <FiShield className="w-3.5 h-3.5" /> 256-Bit Ledger Encrypted
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white font-outfit flex items-center gap-3">
            <FiCreditCard className={isAdvisor ? "text-emerald-400" : "text-brand-400"} />
            {isAdvisor ? "Advisor Fee & Retainer Settlement" : "Sikka Cash Wallet"}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {isAdvisor
              ? "Track client consultation fee settlements, monthly retainers, and bank payout logs."
              : "Top up investment funds via UPI/Razorpay, withdraw earnings, and view live ledger logs."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Wallet Status</span>
            <span className="text-xs font-extrabold text-emerald-400 flex items-center gap-1.5 justify-end">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Active Ledger
            </span>
          </div>
        </div>
      </div>

      {/* Virtual Metallic Sikka Card Showcase & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Metallic Virtual Card */}
        <div className="lg:col-span-6 relative">
          <div className="relative overflow-hidden rounded-3xl p-8 text-white shadow-2xl transition-all hover:scale-[1.01] metallic-card-silver space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">SIKKA VIRTUAL CASH CARD</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-9 h-7 rounded-md bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 border border-amber-200/50 shadow-md" />
                  <span className="text-xs font-mono text-slate-400">EMV SECURE</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-extrabold tracking-wider font-outfit text-brand-400">SIKKA.</span>
                <span className="text-[10px] font-bold uppercase block text-slate-400">PLATINUM</span>
              </div>
            </div>

            <div className="space-y-1 py-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Available Balance</span>
              <div className="text-4xl font-extrabold tracking-tight font-mono text-white">
                ₹{walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div className="flex justify-between items-end text-xs font-mono text-slate-300 pt-2 border-t border-slate-800/80">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 block">CARD HOLDER</span>
                <span className="font-bold text-slate-100 uppercase">{user?.name || "SIKKA INVESTOR"}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 block">CURRENCY</span>
                <span className="font-bold text-slate-100">{wallet?.currency || "INR"}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 block">CARD ID</span>
                <span className="font-bold text-slate-100">•••• {wallet?._id ? wallet._id.slice(-4) : "8892"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="lg:col-span-6 grid grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-xl space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FiArrowUpCircle className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Deposits</span>
            <span className="text-2xl font-extrabold text-white font-mono">
              ₹{transactions.filter(t => t.type === 'deposit').reduce((acc, curr) => acc + parseAmount(curr.amount), 0).toFixed(2)}
            </span>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-xl space-y-2">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <FiArrowDownCircle className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Withdrawals</span>
            <span className="text-2xl font-extrabold text-white font-mono">
              ₹{transactions.filter(t => t.type === 'withdrawal').reduce((acc, curr) => acc + parseAmount(curr.amount), 0).toFixed(2)}
            </span>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-xl space-y-2">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400">
              <FiZap className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Transactions</span>
            <span className="text-2xl font-extrabold text-white font-mono">{transactions.length}</span>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-xl space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <FiShield className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Auto-Roundup Reserve</span>
            <span className="text-2xl font-extrabold text-white font-mono">₹{ (walletBalance * 0.15).toFixed(2) }</span>
          </div>
        </div>
      </div>

      {/* Payment Authorization Modal (Simulated Fallback) */}
      {pendingPayment && (
        <div className="p-6 rounded-3xl border border-brand-500/40 bg-slate-900/90 backdrop-blur-2xl shadow-2xl space-y-4 max-w-lg mx-auto border-l-4 border-l-brand-500">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h4 className="font-extrabold text-white flex items-center gap-2 text-base">
              <FiCheckCircle className="text-emerald-400 w-5 h-5" />
              Simulate Razorpay Gateway Authorization
            </h4>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-500/20 text-brand-400 border border-brand-500/30">
              TEST MODE
            </span>
          </div>
          <div className="text-xs text-slate-300 space-y-1.5 font-mono bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between">
              <span className="text-slate-400">Order ID:</span>
              <span className="text-white">{pendingPayment.gatewayOrderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Gateway:</span>
              <span className="text-brand-400 font-bold">{pendingPayment.gateway.toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Amount:</span>
              <span className="text-emerald-400 font-bold">₹{parseAmount(pendingPayment.amount).toFixed(2)}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={confirmSimulatedPayment}
              className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
            >
              Authorize & Credit Funds Now
            </button>
            <button
              onClick={() => setPendingPayment(null)}
              className="px-4 py-3 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-300 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Deposit/Withdraw & Transaction Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Actions */}
        <div className="lg:col-span-5 space-y-6">
          {/* Deposit Funds Box */}
          {!isAdvisor && (
            <div className="p-6 rounded-3xl border border-slate-800/90 bg-slate-900/60 backdrop-blur-xl shadow-xl space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 font-outfit">
                  <FiArrowUpCircle className="text-emerald-400 w-5 h-5" />
                  Add Funds To Wallet
                </h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">INSTANT UPI</span>
              </div>

              <form onSubmit={depositForm.handleSubmit(handleDepositSubmit)} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Deposit Amount (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...depositForm.register("amount", {
                      required: "Deposit amount is required",
                      min: { value: 1.0, message: "Minimum deposit is ₹1.00" },
                    })}
                    placeholder="e.g. 1000.00"
                    className={`block w-full px-4 py-3 bg-slate-950/80 border ${
                      depositForm.formState.errors.amount ? "border-rose-500" : "border-slate-800"
                    } placeholder-slate-600 text-slate-100 text-sm rounded-xl focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all font-mono`}
                  />
                  {depositForm.formState.errors.amount && (
                    <p className="mt-1 text-xs text-rose-400 font-medium">
                      {depositForm.formState.errors.amount.message}
                    </p>
                  )}
                </div>

                {/* Preset Fast Buttons */}
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Quick Preset Amounts:
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {[500, 1000, 2500, 5000].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setPresetDeposit(val)}
                        className="py-2 text-xs font-bold rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-brand-500/50 hover:bg-brand-500/10 transition-all font-mono"
                      >
                        +₹{val}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submittingDeposit}
                  className="w-full py-3.5 bg-gradient-to-r from-brand-600 via-sky-600 to-brand-500 hover:from-brand-500 hover:to-sky-400 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-brand-600/20 disabled:opacity-50"
                >
                  {submittingDeposit ? "Initiating Deposit..." : "Proceed To Add Cash"}
                </button>
              </form>
            </div>
          )}

          {/* Withdraw Funds Box */}
          <div className="p-6 rounded-3xl border border-slate-800/90 bg-slate-900/60 backdrop-blur-xl shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 font-outfit">
                <FiArrowDownCircle className="text-rose-400 w-5 h-5" />
                Withdraw Cash To Bank
              </h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">NEFT / IMPS</span>
            </div>

            <form onSubmit={withdrawForm.handleSubmit(handleWithdrawSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Withdrawal Amount (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...withdrawForm.register("amount", {
                    required: "Withdrawal amount is required",
                    min: { value: 1.0, message: "Minimum withdrawal is ₹1.00" },
                  })}
                  placeholder="e.g. 500.00"
                  className={`block w-full px-4 py-3 bg-slate-950/80 border ${
                    withdrawForm.formState.errors.amount ? "border-rose-500" : "border-slate-800"
                  } placeholder-slate-600 text-slate-100 text-sm rounded-xl focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all font-mono`}
                />
                {withdrawForm.formState.errors.amount && (
                  <p className="mt-1 text-xs text-rose-400 font-medium">
                    {withdrawForm.formState.errors.amount.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={submittingWithdraw}
                className="w-full py-3.5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-rose-400 hover:bg-rose-500/10 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
              >
                {submittingWithdraw ? "Processing Bank Settlement..." : "Request Bank Payout"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Ledger Log Table */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white font-outfit flex items-center gap-2">
              <FiClock className="text-brand-400" /> Wallet Ledger Log
            </h3>
            <span className="text-xs text-slate-400">Total Entries: {transactions.length}</span>
          </div>

          {transactions.length === 0 ? (
            <div className="p-12 rounded-3xl border border-slate-800/80 bg-slate-900/40 text-center space-y-3">
              <FiInbox className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-slate-300 font-semibold text-sm">No transaction records logged yet.</p>
              <p className="text-xs text-slate-500">
                Deposit cash or allocate funds to see live ledger updates.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {transactions.map((tx) => (
                <div
                  key={tx._id}
                  className="p-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 hover:border-slate-700 transition-all flex justify-between items-center"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${
                        tx.type === 'deposit' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {tx.type === 'deposit' ? <FiArrowUpCircle className="w-4 h-4" /> : <FiArrowDownCircle className="w-4 h-4" />}
                      </div>
                      <span className="font-bold text-white capitalize text-sm">
                        {tx.type === 'deposit' ? 'Cash Deposit' : 'Cash Withdrawal'}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 font-mono">
                        #{tx._id.slice(-6).toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {new Date(tx.createdAt).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  <div className="text-right space-y-1">
                    <div
                      className={`font-mono font-extrabold text-base ${
                        tx.type === "deposit" ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {tx.type === "deposit" ? "+" : "-"}₹{parseAmount(tx.amount).toFixed(2)}
                    </div>
                    <span className="inline-block text-[9px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 uppercase tracking-wider">
                      {tx.status || 'COMPLETED'}
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
