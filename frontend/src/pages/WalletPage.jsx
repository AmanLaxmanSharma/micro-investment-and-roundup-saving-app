import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import api from "../services/api";
import {
  FiCreditCard,
  FiTrendingUp,
  FiArrowUpCircle,
  FiArrowDownCircle,
  FiInbox,
  FiActivity,
  FiCheckCircle,
} from "react-icons/fi";

export default function WalletPage() {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingDeposit, setSubmittingDeposit] = useState(false);
  const [submittingWithdraw, setSubmittingWithdraw] = useState(false);
  
  // Pending payment state for simulating Stripe/Razorpay captures
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
    setSubmittingDeposit(true);
    try {
      const response = await api.post("/api/wallet/deposit", {
        amount: parseFloat(data.amount),
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
            name: "Sikka Investor",
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
        toast.info("Payment intent created. Complete simulated payment authorization.");
        depositForm.reset();
      }
    } catch (err) {
      toast.error("Could not initiate deposit order.");
    } finally {
      setSubmittingDeposit(false);
    }
  };

  const confirmSimulatedPayment = async () => {
    if (!pendingPayment) return;
    try {
      await api.post("/api/wallet/confirm-deposit", {
        gatewayOrderId: pendingPayment.gatewayOrderId,
        gatewayPaymentId: `pay_${Date.now()}`,
      });
      toast.success(`Allocated ₹${parseFloat(pendingPayment.amount).toFixed(2)} to wallet balance!`);
      setPendingPayment(null);
      fetchWalletData();
    } catch (err) {
      toast.error("Could not confirm deposit.");
    }
  };

  const handleWithdrawSubmit = async (data) => {
    const amount = parseFloat(data.amount);
    const balance = parseFloat(wallet?.balance?.toString() || "0");

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
        <span className="text-slate-400">Loading wallet ledger...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <div className="space-y-2">
        <h2 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
          <FiCreditCard className="text-brand-500" />
          Sikka Wallet & Payments
        </h2>
        <p className="text-slate-400">
          Deposit cash via payment gateway, track historical ledgers, and manage balance withdrawals.
        </p>
      </div>

      {/* Main Balance Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-900 bg-gradient-to-br from-brand-950/20 via-slate-950 to-slate-950 p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-[110px] pointer-events-none" />
        <div className="space-y-3">
          <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">
            Available Funds
          </span>
          <h3 className="text-5xl font-extrabold text-white font-mono">
            ₹{(() => {
              const raw = parseFloat(wallet?.balance?.toString() || "0");
              return (isNaN(raw) ? 0 : raw).toFixed(2);
            })()}
          </h3>
          <p className="text-xs text-slate-500">
            Linked to account: {wallet?.currency || "INR"} Base Ledger
          </p>
        </div>

        {/* Payment Intent Simulation modal */}
        {pendingPayment && (
          <div className="p-6 rounded-2xl border border-brand-500/30 bg-slate-950/90 backdrop-blur-md max-w-sm w-full space-y-4">
            <h4 className="font-bold text-white flex items-center gap-2">
              <FiCheckCircle className="text-green-400" />
              Simulate Gateway Capture
            </h4>
            <div className="text-xs text-slate-400 space-y-1">
              <p>Order: {pendingPayment.gatewayOrderId}</p>
              <p>Gateway: {pendingPayment.gateway.toUpperCase()}</p>
              <p>Amount: ₹{parseFloat(pendingPayment.amount).toFixed(2)}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={confirmSimulatedPayment}
                className="flex-1 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-semibold transition-all"
              >
                Complete Payment
              </button>
              <button
                onClick={() => setPendingPayment(null)}
                className="px-3 py-2 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-300 rounded-lg text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Deposit/Withdraw Actions Card */}
        <div className="space-y-8">
          {/* Deposit Card */}
          <div className="p-6 rounded-2xl border border-slate-900 bg-slate-950/40 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FiArrowUpCircle className="text-green-400" />
              Deposit Cash
            </h3>
            <form onSubmit={depositForm.handleSubmit(handleDepositSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Deposit Amount (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...depositForm.register("amount", {
                    required: "Deposit amount is required",
                    min: { value: 1.0, message: "Minimum deposit is ₹1.00" },
                  })}
                  placeholder="e.g. 500.00"
                  className={`block w-full px-3 py-2.5 bg-slate-900 border ${
                    depositForm.formState.errors.amount ? "border-rose-500" : "border-slate-800"
                  } placeholder-slate-600 text-slate-200 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all`}
                />
                {depositForm.formState.errors.amount && (
                  <p className="mt-1 text-xs text-rose-500">
                    {depositForm.formState.errors.amount.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={submittingDeposit}
                className="w-full py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
              >
                {submittingDeposit ? "Initiating Intent..." : "Initiate Deposit"}
              </button>
            </form>
          </div>

          {/* Withdraw Card */}
          <div className="p-6 rounded-2xl border border-slate-900 bg-slate-950/40 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FiArrowDownCircle className="text-rose-400" />
              Withdraw Cash
            </h3>
            <form onSubmit={withdrawForm.handleSubmit(handleWithdrawSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Withdrawal Amount (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...withdrawForm.register("amount", {
                    required: "Withdrawal amount is required",
                    min: { value: 1.0, message: "Minimum withdrawal is ₹1.00" },
                  })}
                  placeholder="e.g. 200.00"
                  className={`block w-full px-3 py-2.5 bg-slate-900 border ${
                    withdrawForm.formState.errors.amount ? "border-rose-500" : "border-slate-800"
                  } placeholder-slate-600 text-slate-200 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all`}
                />
                {withdrawForm.formState.errors.amount && (
                  <p className="mt-1 text-xs text-rose-500">
                    {withdrawForm.formState.errors.amount.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={submittingWithdraw}
                className="w-full py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-rose-400 hover:bg-rose-500/5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
              >
                {submittingWithdraw ? "Processing Withdrawal..." : "Process Withdrawal"}
              </button>
            </form>
          </div>
        </div>

        {/* Ledger history */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white">Wallet Transaction Ledger</h3>

          {transactions.length === 0 ? (
            <div className="p-8 rounded-2xl border border-slate-900 bg-slate-950/20 text-center space-y-3">
              <FiInbox className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-slate-400 text-sm">No wallet transaction records found.</p>
              <p className="text-xs text-slate-600">
                Deposit cash to see logs generated dynamically.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {transactions.map((tx) => (
                <div
                  key={tx._id}
                  className="p-4 rounded-xl border border-slate-900 bg-slate-950/80 hover:border-slate-800 transition-all flex justify-between items-center"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white capitalize text-sm">
                        {tx.type}
                      </span>
                      <span className="text-[9px] font-bold text-slate-500 font-mono">
                        ID: {tx._id.slice(-6)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {new Date(tx.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-right space-y-1">
                    <div
                      className={`font-mono font-extrabold text-sm ${
                        tx.type === "deposit" ? "text-green-400" : "text-rose-400"
                      }`}
                    >
                      {tx.type === "deposit" ? "+" : "-"}₹{parseFloat(tx.amount).toFixed(2)}
                    </div>
                    <span className="text-[9px] font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                      {tx.status.toUpperCase()}
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
