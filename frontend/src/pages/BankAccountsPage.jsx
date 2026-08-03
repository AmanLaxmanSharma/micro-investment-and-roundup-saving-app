import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import api from "../services/api";
import { FiHome, FiLock, FiPlusCircle, FiTrash2, FiShield, FiCheck, FiCheckCircle } from "react-icons/fi";

const POPULAR_BANKS = [
  { name: "HDFC Bank", code: "HDFC", logo: "🏦" },
  { name: "ICICI Bank", code: "ICIC", logo: "🏛️" },
  { name: "State Bank of India", code: "SBIN", logo: "🔵" },
  { name: "Axis Bank", code: "UTIB", logo: "🔴" },
  { name: "Kotak Mahindra", code: "KKBK", logo: "🛡️" },
];

export default function BankAccountsPage() {
  const { user } = useSelector((state) => state.auth);
  const isAdvisor = user?.role === "advisor";
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
      bankName: "",
      accountHolderName: user?.name || "",
      accountNumber: "",
      ifscCode: "",
      accountType: "savings",
      isPrimary: false,
    },
  });

  const fetchAccounts = async () => {
    try {
      const response = await api.get("/api/banks");
      setAccounts(response.data.data.accounts || []);
    } catch (err) {
      toast.error("Unable to load linked bank accounts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const selectPopularBank = (bank) => {
    setValue("bankName", bank.name);
    setValue("ifscCode", `${bank.code}0001234`);
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await api.post("/api/banks", data);
      toast.success(isAdvisor ? "Advisor payout account linked!" : "Bank account linked successfully!");
      reset();
      fetchAccounts();
    } catch (err) {
      // Intercepted
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this bank account?")) {
      return;
    }
    try {
      await api.delete(`/api/banks/${id}`);
      toast.success("Bank account unlinked successfully.");
      fetchAccounts();
    } catch (err) {
      // Intercepted
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <FiShield className="w-3.5 h-3.5" /> NPCI & Reserve Bank Compliant
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white font-outfit flex items-center gap-3">
            <FiHome className={isAdvisor ? "text-emerald-400" : "text-brand-400"} />
            {isAdvisor ? "Advisor Fee Settlement Accounts" : "Linked Bank Accounts"}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {isAdvisor
              ? "Manage linked bank accounts to receive direct consultation retainer deposits."
              : "Link savings or checking accounts for automated round-up tracking and instant withdrawals."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Add Bank */}
        <div className="lg:col-span-5 p-6 rounded-3xl border border-slate-800/90 bg-slate-900/60 backdrop-blur-xl shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 font-outfit">
              <FiPlusCircle className={isAdvisor ? "text-emerald-400" : "text-brand-400"} />
              {isAdvisor ? "Add Advisor Payout Account" : "Link New Bank Account"}
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">INSTANT MANDATE</span>
          </div>

          {/* Quick Bank Chips */}
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Popular Indian Banks:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_BANKS.map((b) => (
                <button
                  key={b.code}
                  type="button"
                  onClick={() => selectPopularBank(b)}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-950 border border-slate-800 hover:border-brand-500/50 hover:bg-brand-500/10 text-slate-300 transition-all flex items-center gap-1"
                >
                  <span>{b.logo}</span>
                  <span>{b.name}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Bank Name
              </label>
              <input
                type="text"
                {...register("bankName", { required: "Bank name is required" })}
                placeholder="e.g. HDFC Bank"
                className={`block w-full px-4 py-2.5 bg-slate-950/80 border ${
                  errors.bankName ? "border-rose-500" : "border-slate-800"
                } placeholder-slate-600 text-slate-100 text-sm rounded-xl focus:outline-none focus:border-brand-500 transition-all`}
              />
              {errors.bankName && (
                <p className="mt-1 text-xs text-rose-400 font-medium">{errors.bankName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Account Holder Name
              </label>
              <input
                type="text"
                {...register("accountHolderName", { required: "Holder name is required" })}
                placeholder="As per bank passbook"
                className={`block w-full px-4 py-2.5 bg-slate-950/80 border ${
                  errors.accountHolderName ? "border-rose-500" : "border-slate-800"
                } placeholder-slate-600 text-slate-100 text-sm rounded-xl focus:outline-none focus:border-brand-500 transition-all`}
              />
              {errors.accountHolderName && (
                <p className="mt-1 text-xs text-rose-400 font-medium">{errors.accountHolderName.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  {...register("accountNumber", {
                    required: "Account number is required",
                    minLength: { value: 8, message: "At least 8 digits" },
                  })}
                  placeholder="9 to 18 digits"
                  className={`block w-full px-4 py-2.5 bg-slate-950/80 border ${
                    errors.accountNumber ? "border-rose-500" : "border-slate-800"
                  } placeholder-slate-600 text-slate-100 text-sm rounded-xl focus:outline-none focus:border-brand-500 font-mono transition-all`}
                />
                {errors.accountNumber && (
                  <p className="mt-1 text-xs text-rose-400 font-medium">{errors.accountNumber.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  IFSC Code
                </label>
                <input
                  type="text"
                  {...register("ifscCode", {
                    required: "IFSC Code required",
                    pattern: {
                      value: /^[A-Z]{4}0[A-Z0-9]{6}$/i,
                      message: "Format: HDFC0001234",
                    },
                  })}
                  placeholder="HDFC0001234"
                  className={`block w-full px-4 py-2.5 bg-slate-950/80 border ${
                    errors.ifscCode ? "border-rose-500" : "border-slate-800"
                  } placeholder-slate-600 text-slate-100 text-sm rounded-xl focus:outline-none focus:border-brand-500 uppercase font-mono transition-all`}
                />
                {errors.ifscCode && (
                  <p className="mt-1 text-xs text-rose-400 font-medium">{errors.ifscCode.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Account Type
                </label>
                <select
                  {...register("accountType")}
                  className="block w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 text-slate-100 text-sm rounded-xl focus:outline-none focus:border-brand-500"
                >
                  <option value="savings">Savings Account</option>
                  <option value="checking">Current / Checking Account</option>
                </select>
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("isPrimary")}
                    className="w-4 h-4 rounded border-slate-800 text-brand-500 focus:ring-brand-500 bg-slate-950"
                  />
                  Set as Primary Mandate
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-gradient-to-r from-brand-600 via-sky-600 to-brand-500 hover:from-brand-500 hover:to-sky-400 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-brand-600/20 disabled:opacity-50"
            >
              {submitting ? "Linking Bank Mandate..." : "Link Bank Mandate"}
            </button>
          </form>
        </div>

        {/* Right List: Linked Accounts */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white font-outfit">Verified Bank Mandates</h3>
            <span className="text-xs text-slate-400">Total Linked: {accounts.length}</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-400 text-sm">Loading bank list...</div>
          ) : accounts.length === 0 ? (
            <div className="p-12 rounded-3xl border border-slate-800/80 bg-slate-900/40 text-center space-y-3">
              <FiHome className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-slate-300 font-semibold text-sm">No bank accounts linked yet.</p>
              <p className="text-xs text-slate-500">
                Link an account to start automated spare change round-ups.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {accounts.map((acc) => (
                <div
                  key={acc._id}
                  className={`p-6 rounded-3xl border transition-all space-y-4 relative ${
                    acc.isPrimary
                      ? "border-brand-500/50 bg-gradient-to-br from-brand-950/30 to-slate-900/80 shadow-lg shadow-brand-500/10"
                      : "border-slate-800/80 bg-slate-900/50 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl">
                        🏦
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-base">{acc.bankName}</h4>
                        <span className="text-xs text-slate-400 font-mono">
                          •••• {acc.accountNumber ? acc.accountNumber.slice(-4) : "1234"}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(acc._id)}
                      className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                      title="Unlink Bank Account"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-xs space-y-1 text-slate-400 border-t border-slate-800/80 pt-3">
                    <div className="flex justify-between">
                      <span>Holder:</span>
                      <span className="text-slate-200 font-semibold">{acc.accountHolderName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>IFSC:</span>
                      <span className="text-slate-200 font-mono">{acc.ifscCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span className="text-slate-200 uppercase text-[10px] font-bold">{acc.accountType || "Savings"}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                      <FiCheckCircle className="w-3 h-3" /> VERIFIED MANDATE
                    </span>

                    {acc.isPrimary && (
                      <span className="text-[10px] font-extrabold text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-full border border-brand-500/30 uppercase tracking-wider">
                        PRIMARY
                      </span>
                    )}
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
