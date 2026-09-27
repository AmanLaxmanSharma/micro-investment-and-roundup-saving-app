import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import api from "../services/api";
import { parseAmount } from "../utils/parseAmount";
import { FiActivity, FiInbox, FiTrendingUp, FiClock, FiCheck } from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";

export default function RoundUpsPage() {
  const { user } = useSelector((state) => state.auth);
  const isAdvisor = user?.role === "advisor";
  const [roundUps, setRoundUps] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRoundUps = async () => {
    try {
      const response = await api.get("/api/roundups");
      // Extract from standardized envelope: data: { roundUps }
      setRoundUps(response.data.data.roundUps || []);
    } catch (err) {
      toast.error("Unable to load round-up savings records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoundUps();
  }, []);

  // Aggregated metrics
  const totalSaved = roundUps.reduce((sum, item) => sum + Number(item.roundUpAmount), 0);
  const pendingInvest = roundUps
    .filter((item) => item.status === "saved" || item.status === "pending_invest")
    .reduce((sum, item) => sum + Number(item.roundUpAmount), 0);
  const investedAmount = roundUps
    .filter((item) => item.status === "invested")
    .reduce((sum, item) => sum + Number(item.roundUpAmount), 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-extrabold tracking-tight text-[#123B5D] flex items-center gap-3 font-outfit">
          <FiActivity className="text-[#16A36A]" />
          {isAdvisor ? "Client Micro-Savings & Round-Up Analytics" : "Round-Up Savings Ledger"}
        </h2>
        <p className="text-sm text-[#64748B]">
          {isAdvisor
            ? "Monitor client spare change accumulations and automated round-up triggers to analyze savings impact."
            : "Track how spare change from daily spends is accumulated and prepared for portfolio allocation."}
        </p>
      </div>

      {/* Summary Metrics */}
      <div className="grid sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl border border-[#E2E8F0] bg-white shadow-sm space-y-4">
          <div className="flex justify-between items-center text-[#64748B]">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Total Accumulated
            </span>
            <FaRupeeSign className="text-[#16A36A] w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-4xl font-extrabold text-[#123B5D] font-mono">
              ₹{totalSaved.toFixed(2)}
            </h3>
            <p className="text-xs text-[#94A3B8]">All-time harvested spare change</p>
          </div>
        </div>

        <div className="p-6 rounded-3xl border border-[#E2E8F0] bg-white shadow-sm space-y-4">
          <div className="flex justify-between items-center text-[#64748B]">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Pending Allocation
            </span>
            <FiClock className="text-amber-500 w-5 h-5 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="text-4xl font-extrabold text-[#1F2937] font-mono">
              ₹{pendingInvest.toFixed(2)}
            </h3>
            <p className="text-xs text-[#94A3B8]">Awaiting portfolio trigger</p>
          </div>
        </div>

        <div className="p-6 rounded-3xl border border-[#E2E8F0] bg-white shadow-sm space-y-4">
          <div className="flex justify-between items-center text-[#64748B]">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Successfully Invested
            </span>
            <FiTrendingUp className="text-[#16A36A] w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-4xl font-extrabold text-[#16A36A] font-mono">
              ₹{investedAmount.toFixed(2)}
            </h3>
            <p className="text-xs text-[#94A3B8]">Allocated to growth portfolios</p>
          </div>
        </div>
      </div>

      {/* Savings Registry list */}
      <div className="p-8 rounded-3xl border border-[#E2E8F0] bg-white shadow-sm space-y-6">
        <h3 className="text-xl font-bold text-[#123B5D] font-outfit">Savings Harvesting Registry</h3>

        {loading ? (
          <div className="flex items-center gap-2 text-[#64748B] text-sm">
            <div className="w-4 h-4 border-2 border-[#16A36A] border-t-transparent rounded-full animate-spin" />
            <span>Loading savings history...</span>
          </div>
        ) : roundUps.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <FiInbox className="w-8 h-8 text-[#94A3B8] mx-auto" />
            <p className="text-[#1F2937] font-semibold text-sm">No round-up savings records found.</p>
            <p className="text-xs text-[#64748B]">
              Log a Withdrawal in the Transactions ledger to automatically trigger savings!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {roundUps.map((entry) => (
              <div
                key={entry.id}
                className="p-5 rounded-2xl border border-[#E2E8F0] bg-white hover:shadow-sm transition-all flex justify-between items-center"
              >
                <div className="space-y-1">
                  <div className="font-semibold text-[#1F2937]">
                    {entry.description || "Spare Change round-up"}
                  </div>
                  <div className="flex gap-3 text-xs text-[#64748B]">
                    <span>Spent: ₹{parseAmount(entry.transactionAmount).toFixed(2)}</span>
                    <span>•</span>
                    <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right space-y-1">
                    <div className="font-mono font-extrabold text-[#16A36A] text-lg">
                      +₹{parseAmount(entry.roundUpAmount).toFixed(2)}
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 text-[9px] font-bold px-2.5 py-0.5 rounded-full ${
                        entry.status === "invested"
                          ? "bg-[#DCFCE7] text-[#123B5D] border border-[#BBF7D0]"
                          : "bg-amber-50 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {entry.status === "invested" ? <FiCheck /> : <FiClock />}
                      {entry.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
