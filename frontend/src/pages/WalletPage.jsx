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
            color: "#123B5D",
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
        <div className="w-6 h-6 border-2 border-[#16A36A] border-t-transparent rounded-full animate-spin" />
        <span className="text-[#64748B] font-medium">Loading wallet ledger...</span>
      </div>
    );
  }

  const walletBalance = parseAmount(wallet?.balance);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      {/* Header Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCFCE7] border border-[#16A36A]/30 text-[#123B5D] text-xs font-bold uppercase tracking-wider mb-2">
            <FiShield className="w-3.5 h-3.5 text-[#16A36A]" /> 256-Bit Ledger Encrypted
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#123B5D] font-outfit flex items-center gap-3">
            <FiCreditCard className="text-[#16A36A]" />
            {isAdvisor ? "Advisor Fee & Retainer Settlement" : "Sikka Cash Wallet"}
          </h2>
          <p className="text-sm text-[#64748B] mt-1">
            {isAdvisor
              ? "Track client consultation fee settlements, monthly retainers, and bank payout logs."
              : "Top up investment funds via UPI/Razorpay, withdraw earnings, and view live ledger logs."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-3 rounded-2xl bg-white border border-[#E2E8F0] text-right shadow-2xs">
            <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block">Wallet Status</span>
            <span className="text-xs font-extrabold text-[#16A36A] flex items-center gap-1.5 justify-end">
              <span className="w-2 h-2 rounded-full bg-[#16A36A] animate-pulse" /> Active Ledger
            </span>
          </div>
        </div>
      </div>

      {/* Virtual Metallic Sikka Card Showcase & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Metallic Virtual Card */}
        <div className="lg:col-span-6 relative">
          <div className="relative overflow-hidden rounded-3xl p-8 text-white shadow-xl transition-all hover:scale-[1.01] bg-gradient-to-br from-[#123B5D] via-[#0D2A42] to-[#081C2E] border border-[#1E5380] space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#4ADE80]">SIKKA VIRTUAL CASH CARD</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-9 h-7 rounded-md bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 border border-amber-200/50 shadow-md" />
                  <span className="text-xs font-mono text-[#94A3B8]">EMV SECURE</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-extrabold tracking-wider font-outfit text-white">SIKKA<span className="text-[#16A36A]">.</span></span>
                <span className="text-[10px] font-bold uppercase block text-[#94A3B8]">PLATINUM</span>
              </div>
            </div>

            <div className="space-y-1 py-2">
              <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Available Balance</span>
              <div className="text-4xl font-extrabold tracking-tight font-mono text-white">
                ₹{walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div className="flex justify-between items-end text-xs font-mono text-[#DCFCE7] pt-2 border-t border-[#1E5380]">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-[#94A3B8] block">CARD HOLDER</span>
                <span className="font-bold text-white uppercase">{user?.name || "SIKKA INVESTOR"}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-[#94A3B8] block">CURRENCY</span>
                <span className="font-bold text-white">{wallet?.currency || "INR"}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] uppercase tracking-wider text-[#94A3B8] block">CARD ID</span>
                <span className="font-bold text-white">•••• {wallet?._id ? wallet._id.slice(-4) : "8892"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="lg:col-span-6 grid grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl border border-[#E2E8F0] bg-white shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] border border-[#BBF7D0] flex items-center justify-center text-[#16A36A]">
              <FiArrowUpCircle className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">Total Deposits</span>
            <span className="text-2xl font-extrabold text-[#1F2937] font-mono">
              ₹{transactions.filter(t => t.type === 'deposit').reduce((acc, curr) => acc + parseAmount(curr.amount), 0).toFixed(2)}
            </span>
          </div>

          <div className="p-6 rounded-2xl border border-[#E2E8F0] bg-white shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-[#DC2626]">
              <FiArrowDownCircle className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">Total Withdrawals</span>
            <span className="text-2xl font-extrabold text-[#1F2937] font-mono">
              ₹{transactions.filter(t => t.type === 'withdrawal').reduce((acc, curr) => acc + parseAmount(curr.amount), 0).toFixed(2)}
            </span>
          </div>

          <div className="p-6 rounded-2xl border border-[#E2E8F0] bg-white shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] border border-[#BBF7D0] flex items-center justify-center text-[#16A36A]">
              <FiZap className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">Total Transactions</span>
            <span className="text-2xl font-extrabold text-[#1F2937] font-mono">{transactions.length}</span>
          </div>

          <div className="p-6 rounded-2xl border border-[#E2E8F0] bg-white shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <FiShield className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">Auto-Roundup Reserve</span>
            <span className="text-2xl font-extrabold text-[#1F2937] font-mono">₹{ (walletBalance * 0.15).toFixed(2) }</span>
          </div>
        </div>
      </div>

      {/* Payment Authorization Modal (Simulated Fallback) */}
      {pendingPayment && (
        <div className="p-6 rounded-3xl border border-[#16A36A]/40 bg-white shadow-xl space-y-4 max-w-lg mx-auto border-l-4 border-l-[#16A36A]">
          <div className="flex justify-between items-center border-b border-[#E2E8F0] pb-3">
            <h4 className="font-extrabold text-[#1F2937] flex items-center gap-2 text-base">
              <FiCheckCircle className="text-[#16A36A] w-5 h-5" />
              Simulate Razorpay Gateway Authorization
            </h4>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#DCFCE7] text-[#123B5D] border border-[#16A36A]/30">
              TEST MODE
            </span>
          </div>
          <div className="text-xs text-[#1F2937] space-y-1.5 font-mono bg-[#F5F7FA] p-4 rounded-xl border border-[#E2E8F0]">
            <div className="flex justify-between">
              <span className="text-[#64748B]">Order ID:</span>
              <span className="text-[#1F2937] font-bold">{pendingPayment.gatewayOrderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Gateway:</span>
              <span className="text-[#123B5D] font-bold">{pendingPayment.gateway.toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Amount:</span>
              <span className="text-[#16A36A] font-bold">₹{parseAmount(pendingPayment.amount).toFixed(2)}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={confirmSimulatedPayment}
              className="flex-1 py-3 bg-[#16A36A] hover:bg-[#138959] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              Authorize & Credit Funds Now
            </button>
            <button
              onClick={() => setPendingPayment(null)}
              className="px-4 py-3 border border-[#E2E8F0] hover:bg-[#F5F7FA] text-[#64748B] rounded-xl text-xs font-semibold"
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
            <div className="p-6 rounded-3xl border border-[#E2E8F0] bg-white shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#123B5D] flex items-center gap-2 font-outfit">
                  <FiArrowUpCircle className="text-[#16A36A] w-5 h-5" />
                  Add Funds To Wallet
                </h3>
                <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">INSTANT UPI</span>
              </div>

              <form onSubmit={depositForm.handleSubmit(handleDepositSubmit)} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
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
                    className={`block w-full px-4 py-3 bg-white border ${
                      depositForm.formState.errors.amount ? "border-red-500" : "border-[#E2E8F0]"
                    } placeholder-[#94A3B8] text-[#1F2937] text-sm rounded-xl focus:outline-none focus:border-[#16A36A] focus:ring-1 focus:ring-[#16A36A] transition-all font-mono`}
                  />
                  {depositForm.formState.errors.amount && (
                    <p className="mt-1 text-xs text-[#DC2626] font-medium">
                      {depositForm.formState.errors.amount.message}
                    </p>
                  )}
                </div>

                {/* Preset Fast Buttons */}
                <div>
                  <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block mb-2">
                    Quick Preset Amounts:
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {[500, 1000, 2500, 5000].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setPresetDeposit(val)}
                        className="py-2 text-xs font-bold rounded-xl bg-[#F5F7FA] border border-[#E2E8F0] text-[#1F2937] hover:bg-[#DCFCE7] hover:border-[#16A36A] transition-all font-mono"
                      >
                        +₹{val}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submittingDeposit}
                  className="w-full py-3.5 bg-[#16A36A] hover:bg-[#138959] text-white rounded-xl text-sm font-bold transition-all shadow-sm disabled:opacity-50 hover:scale-[1.01]"
                >
                  {submittingDeposit ? "Initiating Deposit..." : "Proceed To Add Cash"}
                </button>
              </form>
            </div>
          )}

          {/* Withdraw Funds Box */}
          <div className="p-6 rounded-3xl border border-[#E2E8F0] bg-white shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#123B5D] flex items-center gap-2 font-outfit">
                <FiArrowDownCircle className="text-[#DC2626] w-5 h-5" />
                Withdraw Cash To Bank
              </h3>
              <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">NEFT / IMPS</span>
            </div>

            <form onSubmit={withdrawForm.handleSubmit(handleWithdrawSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
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
                  className={`block w-full px-4 py-3 bg-white border ${
                    withdrawForm.formState.errors.amount ? "border-red-500" : "border-[#E2E8F0]"
                  } placeholder-[#94A3B8] text-[#1F2937] text-sm rounded-xl focus:outline-none focus:border-[#16A36A] focus:ring-1 focus:ring-[#16A36A] transition-all font-mono`}
                />
                {withdrawForm.formState.errors.amount && (
                  <p className="mt-1 text-xs text-[#DC2626] font-medium">
                    {withdrawForm.formState.errors.amount.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={submittingWithdraw}
                className="w-full py-3.5 bg-red-50 border border-red-200 text-[#DC2626] hover:bg-red-100 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
              >
                {submittingWithdraw ? "Processing Bank Settlement..." : "Request Bank Payout"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Ledger Log Table */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#123B5D] font-outfit flex items-center gap-2">
              <FiClock className="text-[#16A36A]" /> Wallet Ledger Log
            </h3>
            <span className="text-xs font-semibold text-[#64748B]">Total Entries: {transactions.length}</span>
          </div>

          {transactions.length === 0 ? (
            <div className="p-12 rounded-3xl border border-[#E2E8F0] bg-white text-center space-y-3 shadow-sm">
              <FiInbox className="w-10 h-10 text-[#94A3B8] mx-auto" />
              <p className="text-[#1F2937] font-semibold text-sm">No transaction records logged yet.</p>
              <p className="text-xs text-[#64748B]">
                Deposit cash or allocate funds to see live ledger updates.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {transactions.map((tx) => (
                <div
                  key={tx._id}
                  className="p-4 rounded-2xl border border-[#E2E8F0] bg-white hover:shadow-sm transition-all flex justify-between items-center"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${
                        tx.type === 'deposit' ? 'bg-[#DCFCE7] text-[#16A36A]' : 'bg-red-50 text-[#DC2626]'
                      }`}>
                        {tx.type === 'deposit' ? <FiArrowUpCircle className="w-4 h-4" /> : <FiArrowDownCircle className="w-4 h-4" />}
                      </div>
                      <span className="font-bold text-[#1F2937] capitalize text-sm">
                        {tx.type === 'deposit' ? 'Cash Deposit' : 'Cash Withdrawal'}
                      </span>
                      <span className="text-[10px] font-bold text-[#94A3B8] font-mono">
                        #{tx._id.slice(-6).toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-[#64748B]">
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
                        tx.type === "deposit" ? "text-[#16A36A]" : "text-[#DC2626]"
                      }`}
                    >
                      {tx.type === "deposit" ? "+" : "-"}₹{parseAmount(tx.amount).toFixed(2)}
                    </div>
                    <span className="inline-block text-[9px] font-extrabold text-[#123B5D] bg-[#DCFCE7] px-2 py-0.5 rounded-md border border-[#BBF7D0] uppercase tracking-wider">
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
