import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import api from "../services/api";
import { parseAmount } from "../utils/parseAmount";
import { FiActivity, FiPlusCircle, FiArrowUpRight, FiArrowDownLeft, FiShoppingBag, FiInfo, FiShield, FiTrendingUp } from "react-icons/fi";

export default function TransactionsPage() {
  const { user } = useSelector((state) => state.auth);
  const isAdvisor = user?.role === "advisor";
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: "withdrawal",
      amount: "",
      bankAccountId: "",
      description: "",
      category: "shopping",
      status: "completed",
    },
  });

  const fetchData = async () => {
    try {
      const [txResponse, bankResponse] = await Promise.all([
        api.get("/api/transactions"),
        api.get("/api/banks"),
      ]);
      const fetchedAccounts = bankResponse.data.data.accounts || [];
      setTransactions(txResponse.data.data.transactions || []);
      setAccounts(fetchedAccounts);
      if (fetchedAccounts.length > 0) {
        const primary = fetchedAccounts.find((a) => a.isPrimary) || fetchedAccounts[0];
        const accId = primary._id || primary.id;
        setValue("bankAccountId", accId);
      }
    } catch (err) {
      toast.error("Unable to load transaction records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const selectedBankId = data.bankAccountId || (accounts.length > 0 ? (accounts[0]._id || accounts[0].id) : "");
      const response = await api.post("/api/transactions", {
        ...data,
        bankAccountId: selectedBankId,
        amount: parseFloat(data.amount),
      });

      // Check if auto-roundup was calculated
      const roundUp = response.data.data.roundUpCalculated;
      if (roundUp) {
        toast.success(
          `Transaction logged! Saved spare change: ₹${roundUp.roundUpAmount} in your piggy bank!`,
          { autoClose: 6000 }
        );
      } else {
        toast.success("Transaction recorded successfully.");
      }

      reset();
      fetchData();
    } catch (err) {
      // Handled by Axios interceptor
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <div className="space-y-2">
        <h2 className="text-3xl font-extrabold tracking-tight text-[#15231D] flex items-center gap-3 font-outfit">
          <FiActivity className="text-[#18A66A]" />
          {isAdvisor ? "Investor Client Transaction & Audit Monitor" : "Simulated Spends & Ledger"}
        </h2>
        <p className="text-sm text-[#60736A]">
          {isAdvisor
            ? "Inspect investor client spend activities, categories, and automated round-up triggers to offer personalized advice."
            : "Simulate standard checking expenses (withdrawals) to test automated spare change calculations."}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Form for Investor OR Audit Panel for Advisor */}
        {isAdvisor ? (
          <div className="lg:col-span-1 p-6 rounded-3xl border border-[#D7E2DC] bg-white shadow-sm space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-[#123B2A] uppercase tracking-widest px-2.5 py-1 bg-[#E3F5ED] rounded-full border border-[#18A66A]/30 inline-flex items-center gap-1">
                <FiShield className="text-[#18A66A]" /> SEBI Audit Suite
              </span>
              <h3 className="text-lg font-bold text-[#15231D]">Client Activity Overview</h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#F5F7F2] border border-[#D7E2DC] space-y-1">
                <span className="text-xs text-[#60736A]">Total Audited Records</span>
                <h4 className="text-2xl font-mono font-bold text-[#15231D]">{transactions.length}</h4>
              </div>

              <div className="p-4 rounded-xl bg-[#F5F7F2] border border-[#D7E2DC] space-y-1">
                <span className="text-xs text-[#60736A]">Linked Client Banks</span>
                <h4 className="text-2xl font-mono font-bold text-[#159A63]">{accounts.length} Accounts</h4>
              </div>

              <div className="p-4 rounded-xl bg-[#E3F5ED]/40 border border-[#18A66A]/30 space-y-2">
                <h5 className="text-xs font-bold text-[#123B2A] flex items-center gap-1">
                  <FiTrendingUp className="text-[#18A66A]" /> Advisor Guidance Note
                </h5>
                <p className="text-xs text-[#60736A] leading-relaxed">
                  Monitor frequent client spend categories (e.g. Dining, Shopping) to suggest adjusting round-up multipliers for faster goal achievement.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-1 p-6 rounded-3xl border border-[#D7E2DC] bg-white shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-[#15231D] flex items-center gap-2 font-outfit">
              <FiPlusCircle className="text-[#18A66A]" />
              Log Spend/Deposit
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#60736A] mb-1">
                  Transaction Type
                </label>
                <select
                  {...register("type")}
                  className="block w-full px-3 py-2 bg-white border border-[#D7E2DC] text-[#15231D] text-sm rounded-xl focus:outline-none focus:border-[#18A66A] cursor-pointer"
                >
                  <option value="withdrawal">Withdrawal (Triggers Round-Up)</option>
                  <option value="deposit">Deposit</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#60736A] mb-1">
                  Select Connected Bank
                </label>
                <select
                  {...register("bankAccountId")}
                  className="block w-full px-3 py-2 bg-white border border-[#D7E2DC] text-[#15231D] text-sm rounded-xl focus:outline-none focus:border-[#18A66A] cursor-pointer"
                >
                  {accounts.length === 0 ? (
                    <option value="">Primary Sikka Account</option>
                  ) : (
                    accounts.map((acc) => {
                      const accId = acc._id || acc.id;
                      const numSuffix = acc.accountNumber ? acc.accountNumber.slice(-4) : "xxxx";
                      return (
                        <option key={accId} value={accId}>
                          {acc.bankName || "Bank"} (•• {numSuffix}) {acc.isPrimary ? "• Primary" : ""}
                        </option>
                      );
                    })
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#60736A] mb-1">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("amount", {
                    required: "Amount is required",
                    min: { value: 0.01, message: "Must be greater than ₹0.00" },
                  })}
                  placeholder="12.45"
                  className={`block w-full px-3 py-2 bg-white border ${
                    errors.amount ? "border-rose-500" : "border-[#D7E2DC]"
                  } placeholder-[#8A9A92] text-[#15231D] text-sm rounded-xl focus:outline-none focus:border-[#18A66A] transition-all`}
                />
                {errors.amount && (
                  <p className="mt-1 text-xs text-rose-600">{errors.amount.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#60736A] mb-1">
                  Merchant / Description
                </label>
                <input
                  type="text"
                  {...register("description", { required: "Description is required" })}
                  placeholder="e.g. Starbucks Coffee"
                  className={`block w-full px-3 py-2 bg-white border ${
                    errors.description ? "border-rose-500" : "border-[#D7E2DC]"
                  } placeholder-[#8A9A92] text-[#15231D] text-sm rounded-xl focus:outline-none focus:border-[#18A66A] transition-all`}
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-rose-600">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#60736A] mb-1">
                  Category
                </label>
                <select
                  {...register("category")}
                  className="block w-full px-3 py-2 bg-white border border-[#D7E2DC] text-[#15231D] text-sm rounded-xl focus:outline-none focus:border-[#18A66A] cursor-pointer"
                >
                  <option value="shopping">Shopping</option>
                  <option value="food">Food & Dining</option>
                  <option value="utilities">Utilities</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="travel">Travel</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#18A66A] hover:bg-[#159A63] shadow-sm transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Logging...</span>
                  </>
                ) : (
                  <span>Log Transaction</span>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Recent Ledger Feed */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-[#15231D] font-outfit">Recent Ledger Activities</h3>

          {loading ? (
            <div className="flex items-center gap-2 text-[#60736A] text-sm">
              <div className="w-4 h-4 border-2 border-[#18A66A] border-t-transparent rounded-full animate-spin" />
              <span>Loading ledger history...</span>
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-8 rounded-3xl border border-[#D7E2DC] bg-white text-center space-y-3 shadow-sm">
              <FiShoppingBag className="w-8 h-8 text-[#8A9A92] mx-auto" />
              <p className="text-[#15231D] font-semibold text-sm">No transaction records found.</p>
              <p className="text-xs text-[#60736A]">
                Log a Withdrawal above to verify auto spare change calculations.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-[#D7E2DC] bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[#D7E2DC] text-[#60736A] text-xs font-bold uppercase tracking-wider bg-[#F5F7F2]">
                      <th className="py-4 px-6">Description</th>
                      <th className="py-4 px-6">Category</th>
                      <th className="py-4 px-6">Type</th>
                      <th className="py-4 px-6">Amount</th>
                      <th className="py-4 px-6">Round-up</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D7E2DC] text-[#15231D]">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-[#F5F7F2]/60 transition-all">
                        <td className="py-4 px-6">
                          <div className="font-semibold text-[#15231D]">{tx.description}</div>
                          <div className="text-[10px] text-[#8A9A92] mt-0.5">
                            {new Date(tx.createdAt).toLocaleString()}
                          </div>
                        </td>
                        <td className="py-4 px-6 capitalize text-xs text-[#60736A]">{tx.category}</td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                              tx.type === "withdrawal"
                                ? "bg-rose-50 text-rose-700 border border-rose-200"
                                : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            }`}
                          >
                            {tx.type === "withdrawal" ? <FiArrowUpRight /> : <FiArrowDownLeft />}
                            {tx.type.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-mono font-bold text-[#15231D]">
                          ₹{parseAmount(tx.amount).toFixed(2)}
                        </td>
                        <td className="py-4 px-6">
                          {tx.isRoundUpProcessed ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E3F5ED] border border-[#18A66A]/30 text-[#123B2A]">
                              PROCESSED
                            </span>
                          ) : tx.type === "withdrawal" ? (
                            <span className="text-xs text-[#8A9A92]">Pending</span>
                          ) : (
                            <span className="text-[#8A9A92]">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
