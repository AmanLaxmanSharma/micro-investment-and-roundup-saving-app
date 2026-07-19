import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import api from "../services/api";
import { FiHome, FiLock, FiPlusCircle, FiTrash2, FiAlertCircle, FiCheck } from "react-icons/fi";

export default function BankAccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      bankName: "",
      accountHolderName: "",
      accountNumber: "",
      ifscCode: "",
      accountType: "checking",
      isPrimary: false,
    },
  });

  const fetchAccounts = async () => {
    try {
      const response = await api.get("/api/banks");
      // Extract from standardized payload: data: { accounts }
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

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await api.post("/api/banks", data);
      toast.success("Bank account linked successfully!");
      reset();
      fetchAccounts();
    } catch (err) {
      // Handled by Axios interceptor
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
      // Handled by Axios interceptor
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <div className="space-y-2">
        <h2 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
          <FiHome className="text-brand-500" />
          Virtual Bank Linking
        </h2>
        <p className="text-slate-400">
          Securely link checkings or savings accounts to enable automated spare change round-ups.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Linking Form */}
        <div className="lg:col-span-1 p-6 rounded-2xl border border-slate-900 bg-slate-950/40 space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FiPlusCircle className="text-brand-500" />
            Link New Account
          </h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Bank Name
              </label>
              <input
                type="text"
                {...register("bankName", { required: "Bank name is required" })}
                placeholder="e.g. JPMorgan Chase"
                className={`block w-full px-3 py-2 bg-slate-900 border ${
                  errors.bankName ? "border-rose-500" : "border-slate-800"
                } placeholder-slate-600 text-slate-200 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-transparent transition-all`}
              />
              {errors.bankName && (
                <p className="mt-1 text-xs text-rose-500">{errors.bankName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Account Holder Name
              </label>
              <input
                type="text"
                {...register("accountHolderName", { required: "Holder name is required" })}
                placeholder="John Doe"
                className={`block w-full px-3 py-2 bg-slate-900 border ${
                  errors.accountHolderName ? "border-rose-500" : "border-slate-800"
                } placeholder-slate-600 text-slate-200 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-transparent transition-all`}
              />
              {errors.accountHolderName && (
                <p className="mt-1 text-xs text-rose-500">{errors.accountHolderName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Account Number
              </label>
              <input
                type="text"
                {...register("accountNumber", {
                  required: "Account number is required",
                  pattern: { value: /^\d+$/, message: "Must be numbers only" },
                })}
                placeholder="1000182748"
                className={`block w-full px-3 py-2 bg-slate-900 border ${
                  errors.accountNumber ? "border-rose-500" : "border-slate-800"
                } placeholder-slate-600 text-slate-200 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-transparent transition-all`}
              />
              {errors.accountNumber && (
                <p className="mt-1 text-xs text-rose-500">{errors.accountNumber.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                IFSC / Routing Code
              </label>
              <input
                type="text"
                {...register("ifscCode", { required: "Routing code is required" })}
                placeholder="IFSC0001"
                className={`block w-full px-3 py-2 bg-slate-900 border ${
                  errors.ifscCode ? "border-rose-500" : "border-slate-800"
                } placeholder-slate-600 text-slate-200 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-transparent transition-all`}
              />
              {errors.ifscCode && (
                <p className="mt-1 text-xs text-rose-500">{errors.ifscCode.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Account Type
              </label>
              <select
                {...register("accountType")}
                className="block w-full px-3 py-2.5 bg-slate-900 border border-slate-800 text-slate-300 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all"
              >
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
                <option value="investment">Investment</option>
              </select>
            </div>

            <div className="flex items-center gap-2 py-1">
              <input
                type="checkbox"
                id="isPrimary"
                {...register("isPrimary")}
                className="rounded bg-slate-900 border-slate-800 text-brand-500 focus:ring-brand-500 focus:ring-offset-slate-950 focus:ring-0"
              />
              <label htmlFor="isPrimary" className="text-xs text-slate-400 cursor-pointer select-none">
                Set as Primary Billing Account
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 transition-all duration-300 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Linking...</span>
                </>
              ) : (
                <span>Link Account</span>
              )}
            </button>
          </form>
        </div>

        {/* Linked Accounts List */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-white">Linked Accounts Feed</h3>

          {loading ? (
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
              <span>Loading bank accounts...</span>
            </div>
          ) : accounts.length === 0 ? (
            <div className="p-8 rounded-2xl border border-slate-900 bg-slate-950/20 text-center space-y-3">
              <FiAlertCircle className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-slate-400 text-sm">No linked bank accounts found.</p>
              <p className="text-xs text-slate-600">
                Link an account to start simulating spending and testing round-up savings.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {accounts.map((acc) => (
                <div
                  key={acc.id}
                  className="p-6 rounded-2xl border border-slate-900 bg-slate-950/80 hover:border-slate-800 transition-all flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-white text-lg">{acc.bankName}</h4>
                      {acc.isPrimary && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20 text-green-400">
                          <FiCheck /> PRIMARY
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-mono">
                      Acc No: •••• •••• {acc.accountNumber.slice(-4) || acc.accountNumber}
                    </p>
                    <div className="flex gap-3 text-xs text-slate-400">
                      <span className="capitalize">{acc.accountType}</span>
                      <span>•</span>
                      <span>IFSC: {acc.ifscCode}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-900 pt-4">
                    <span className="text-xs text-slate-500">Holder: {acc.accountHolderName}</span>
                    <button
                      onClick={() => handleDelete(acc.id)}
                      className="p-1.5 rounded-lg border border-slate-800 hover:border-rose-900/50 hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 transition-all"
                      title="Unlink Account"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
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
