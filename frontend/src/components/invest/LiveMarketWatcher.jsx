import { useState, useEffect, useRef } from "react";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiActivity,
  FiSearch,
  FiRadio,
  FiRefreshCw,
  FiZap,
  FiArrowUpRight,
  FiCheck,
  FiDollarSign,
  FiMaximize2,
  FiX,
  FiShield,
} from "react-icons/fi";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import api from "../../services/api";
import { getSocket } from "../../services/socket";

export default function LiveMarketWatcher({ onSelectStockForInvestment }) {
  const [stocks, setStocks] = useState([]);
  const [indices, setIndices] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [lastTickTime, setLastTickTime] = useState(null);
  const [flashingStocks, setFlashingStocks] = useState({}); // { [symbol]: 'up' | 'down' }
  const [selectedStockModal, setSelectedStockModal] = useState(null);
  const [loading, setLoading] = useState(true);

  const socketRef = useRef(null);
  const flashTimers = useRef({});

  // 1. Initial REST API Fetch
  const fetchMarketData = async () => {
    try {
      const res = await api.get("/api/market/stocks");
      if (res.data?.data) {
        setStocks(res.data.data.stocks || []);
        if (res.data.data.indices) {
          setIndices(res.data.data.indices);
        }
      }
    } catch (err) {
      console.warn("Market REST fetch warning:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. Socket.IO Real-time Connection
  useEffect(() => {
    fetchMarketData();

    const socket = getSocket();
    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("market:init", (data) => {
      if (data?.stocks) setStocks(data.stocks);
      if (data?.indices) setIndices(data.indices);
      setIsConnected(true);
      setLoading(false);
    });

    // Real-time market tick event
    socket.on("market:tick", (data) => {
      const { ticks, indices: updatedIndices, timestamp } = data;
      setLastTickTime(timestamp);

      if (updatedIndices) {
        setIndices(updatedIndices);
      }

      if (ticks && ticks.length > 0) {
        const newFlashMap = {};

        setStocks((prevStocks) => {
          const map = new Map(prevStocks.map((s) => [s.symbol, s]));

          ticks.forEach((tick) => {
            const existing = map.get(tick.symbol);
            if (existing) {
              const direction = tick.direction || (tick.currentPrice >= existing.currentPrice ? "up" : "down");
              newFlashMap[tick.symbol] = direction;

              map.set(tick.symbol, {
                ...existing,
                currentPrice: tick.currentPrice,
                change: tick.change,
                changePercent: tick.changePercent,
                dayHigh: tick.dayHigh,
                dayLow: tick.dayLow,
                sparkline: tick.sparkline || existing.sparkline,
                lastUpdated: new Date().toISOString(),
              });
            }
          });

          return Array.from(map.values());
        });

        // Set flash highlights
        setFlashingStocks((prev) => ({ ...prev, ...newFlashMap }));

        // Clear flashes after 900ms
        ticks.forEach((tick) => {
          if (flashTimers.current[tick.symbol]) {
            clearTimeout(flashTimers.current[tick.symbol]);
          }
          flashTimers.current[tick.symbol] = setTimeout(() => {
            setFlashingStocks((prev) => {
              const updated = { ...prev };
              delete updated[tick.symbol];
              return updated;
            });
          }, 900);
        });
      }
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("market:init");
      socket.off("market:tick");
    };
  }, []);

  // Filter stocks by category & search query
  const filteredStocks = stocks.filter((stock) => {
    const matchesCategory =
      activeCategory === "all" || stock.category === activeCategory;
    const matchesSearch =
      stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.sector.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleQuickInvest = (stock) => {
    if (onSelectStockForInvestment) {
      onSelectStockForInvestment(stock);
    }
    setSelectedStockModal(null);
  };

  return (
    <div className="space-y-6">
      {/* Header & Live Stream Status */}
      <div className="p-6 rounded-3xl border border-[#E2E8F0] bg-white shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-[#DCFCE7] text-[#16A36A] rounded-xl border border-[#BBF7D0]">
                <FiRadio className="w-5 h-5 animate-pulse" />
              </span>
              <div>
                <h3 className="text-xl font-extrabold text-[#123B5D] font-outfit flex items-center gap-2">
                  Live Share Market & ETF Exchange
                </h3>
                <p className="text-xs text-[#64748B]">
                  Real-time market quotes powered by Free Financial APIs & Socket.io WebSockets
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                isConnected
                  ? "bg-[#DCFCE7] text-[#16A36A] border-[#BBF7D0]"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isConnected ? "bg-[#16A36A] animate-ping" : "bg-amber-500"
                }`}
              />
              {isConnected ? "SOCKET.IO CONNECTED (2.5s Ticks)" : "CONNECTING TO FEED..."}
            </div>

            <button
              onClick={fetchMarketData}
              title="Manual Refresh"
              className="p-2 text-[#64748B] hover:text-[#123B5D] hover:bg-[#F5F7FA] rounded-xl border border-[#E2E8F0] transition-colors"
            >
              <FiRefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Indices Strip */}
        {indices.length > 0 && (
          <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3 pt-5 border-t border-[#E2E8F0]">
            {indices.map((idx) => (
              <div
                key={idx.name}
                className="p-3 bg-[#F5F7FA] rounded-2xl border border-[#E2E8F0] flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                    {idx.name}
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white text-[#123B5D] border border-[#E2E8F0]">
                    {idx.exchange}
                  </span>
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="font-mono font-bold text-sm text-[#1F2937]">
                    {idx.level}
                  </span>
                  <span
                    className={`text-xs font-bold inline-flex items-center gap-0.5 ${
                      idx.isPositive ? "text-[#16A36A]" : "text-[#DC2626]"
                    }`}
                  >
                    {idx.isPositive ? <FiTrendingUp /> : <FiTrendingDown />}
                    {idx.changePercent}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Categories */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "all", label: "All Assets" },
            { id: "indian_equity", label: "NSE / BSE Bluechips" },
            { id: "etf_gold", label: "Micro-ETFs & Gold" },
            { id: "global_tech", label: "US Tech Giants" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeCategory === cat.id
                  ? "bg-[#123B5D] text-white shadow-sm"
                  : "bg-white text-[#64748B] hover:text-[#123B5D] border border-[#E2E8F0]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stock, ETF, or sector..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#1F2937] placeholder-[#94A3B8] focus:outline-none focus:border-[#16A36A] transition-all"
          />
        </div>
      </div>

      {/* Stocks Cards Grid */}
      {loading ? (
        <div className="p-12 text-center space-y-3 bg-white rounded-3xl border border-[#E2E8F0]">
          <div className="w-8 h-8 border-2 border-[#16A36A] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#64748B]">Connecting to Live Socket Market Stream...</p>
        </div>
      ) : filteredStocks.length === 0 ? (
        <div className="p-12 text-center space-y-2 bg-white rounded-3xl border border-[#E2E8F0]">
          <FiSearch className="w-8 h-8 text-[#94A3B8] mx-auto" />
          <p className="text-sm font-bold text-[#1F2937]">No shares matching your criteria</p>
          <p className="text-xs text-[#64748B]">Try searching for a different ticker or category.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredStocks.map((stock) => {
            const isPositive = stock.change >= 0;
            const flash = flashingStocks[stock.symbol];
            const sparkData = (stock.sparkline || [stock.previousClose, stock.currentPrice]).map(
              (val, idx) => ({ i: idx, price: val })
            );

            return (
              <div
                key={stock.symbol}
                className={`p-5 rounded-3xl border bg-white flex flex-col justify-between gap-4 transition-all duration-300 relative overflow-hidden ${
                  flash === "up"
                    ? "border-[#16A36A] ring-2 ring-[#16A36A]/30 bg-[#DCFCE7]/20"
                    : flash === "down"
                    ? "border-[#DC2626] ring-2 ring-[#DC2626]/30 bg-red-50/20"
                    : "border-[#E2E8F0] hover:border-[#123B5D]/40 hover:shadow-sm"
                }`}
              >
                {/* Top Info */}
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-[#123B5D] text-sm tracking-tight font-mono">
                        {stock.ticker}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-[#64748B] bg-[#F5F7FA] px-1.5 py-0.5 rounded border border-[#E2E8F0]">
                        {stock.currency}
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold text-[#1F2937] line-clamp-1" title={stock.name}>
                      {stock.name}
                    </h4>
                    <span className="text-[10px] text-[#64748B] block">{stock.sector}</span>
                  </div>

                  <button
                    onClick={() => setSelectedStockModal(stock)}
                    title="View Full Live Chart"
                    className="p-1.5 text-[#94A3B8] hover:text-[#123B5D] hover:bg-[#F5F7FA] rounded-lg transition-colors"
                  >
                    <FiMaximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Price & % Change */}
                <div className="flex items-baseline justify-between">
                  <div>
                    <div
                      className={`font-mono text-xl font-extrabold tracking-tight transition-colors duration-300 ${
                        flash === "up"
                          ? "text-[#16A36A]"
                          : flash === "down"
                          ? "text-[#DC2626]"
                          : "text-[#1F2937]"
                      }`}
                    >
                      {stock.currency === "INR" ? "₹" : "$"}
                      {Number(stock.currentPrice).toFixed(2)}
                    </div>
                    <div className="text-[10px] text-[#94A3B8] font-mono">
                      Prev: {stock.currency === "INR" ? "₹" : "$"}{Number(stock.previousClose).toFixed(2)}
                    </div>
                  </div>

                  <div
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold ${
                      isPositive
                        ? "bg-[#DCFCE7] text-[#16A36A] border border-[#BBF7D0]"
                        : "bg-red-50 text-[#DC2626] border border-red-200"
                    }`}
                  >
                    {isPositive ? <FiTrendingUp className="w-3.5 h-3.5" /> : <FiTrendingDown className="w-3.5 h-3.5" />}
                    <span>{isPositive ? `+${stock.changePercent}%` : `${stock.changePercent}%`}</span>
                  </div>
                </div>

                {/* Mini Live Sparkline */}
                <div className="h-14 w-full -mx-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sparkData}>
                      <defs>
                        <linearGradient id={`grad-${stock.ticker}`} x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor={isPositive ? "#16A36A" : "#DC2626"}
                            stopOpacity={0.25}
                          />
                          <stop
                            offset="95%"
                            stopColor={isPositive ? "#16A36A" : "#DC2626"}
                            stopOpacity={0.0}
                          />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke={isPositive ? "#16A36A" : "#DC2626"}
                        strokeWidth={2}
                        fill={`url(#grad-${stock.ticker})`}
                        isAnimationActive={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Day Range Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-[#64748B] font-mono">
                    <span>L: {stock.currency === "INR" ? "₹" : "$"}{stock.dayLow}</span>
                    <span>H: {stock.currency === "INR" ? "₹" : "$"}{stock.dayHigh}</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#F5F7FA] rounded-full overflow-hidden border border-[#E2E8F0]">
                    {(() => {
                      const range = stock.dayHigh - stock.dayLow || 1;
                      const progress = Math.min(
                        100,
                        Math.max(0, ((stock.currentPrice - stock.dayLow) / range) * 100)
                      );
                      return (
                        <div
                          className={`h-full ${isPositive ? "bg-[#16A36A]" : "bg-[#DC2626]"}`}
                          style={{ width: `${progress}%` }}
                        />
                      );
                    })()}
                  </div>
                </div>

                {/* Quick Action Button */}
                <button
                  onClick={() => handleQuickInvest(stock)}
                  className="w-full mt-1 py-2 bg-[#F5F7FA] hover:bg-[#123B5D] text-[#123B5D] hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-[#E2E8F0] hover:border-[#123B5D]"
                >
                  <FiZap className="w-3.5 h-3.5 text-[#16A36A]" />
                  <span>Allocate via Sikka</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Stock Detailed Chart Modal */}
      {selectedStockModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-xl max-w-2xl w-full p-6 space-y-6 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xl text-[#123B5D] font-mono">
                    {selectedStockModal.ticker}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#16A36A] font-bold border border-[#BBF7D0]">
                    LIVE SOCKET FEED
                  </span>
                </div>
                <h3 className="font-bold text-base text-[#1F2937]">{selectedStockModal.name}</h3>
                <p className="text-xs text-[#64748B]">{selectedStockModal.sector} • {selectedStockModal.category}</p>
              </div>
              <button
                onClick={() => setSelectedStockModal(null)}
                className="p-2 text-[#64748B] hover:text-[#123B5D] hover:bg-[#F5F7FA] rounded-xl"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Current Metrics */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-[#F5F7FA] rounded-2xl border border-[#E2E8F0]">
              <div>
                <span className="text-[10px] text-[#64748B] font-semibold uppercase">Real-Time Price</span>
                <div className="font-mono text-xl font-extrabold text-[#1F2937]">
                  {selectedStockModal.currency === "INR" ? "₹" : "$"}
                  {Number(selectedStockModal.currentPrice).toFixed(2)}
                </div>
              </div>
              <div>
                <span className="text-[10px] text-[#64748B] font-semibold uppercase">Net Movement</span>
                <div
                  className={`font-mono text-base font-bold ${
                    selectedStockModal.change >= 0 ? "text-[#16A36A]" : "text-[#DC2626]"
                  }`}
                >
                  {selectedStockModal.change >= 0 ? `+${selectedStockModal.change}` : selectedStockModal.change} (
                  {selectedStockModal.changePercent}%)
                </div>
              </div>
              <div>
                <span className="text-[10px] text-[#64748B] font-semibold uppercase">24h Volume</span>
                <div className="font-mono text-base font-bold text-[#1F2937]">
                  {(selectedStockModal.volume / 1000000).toFixed(2)}M
                </div>
              </div>
            </div>

            {/* Modal Intraday Chart */}
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={(selectedStockModal.sparkline || []).map((val, idx) => ({
                    step: `T-${(selectedStockModal.sparkline.length - idx) * 2.5}s`,
                    price: val,
                  }))}
                >
                  <defs>
                    <linearGradient id="modalGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16A36A" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#16A36A" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="step" tick={{ fontSize: 10, fill: "#94A3B8" }} />
                  <YAxis domain={["auto", "auto"]} tick={{ fontSize: 10, fill: "#94A3B8" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "12px",
                      border: "1px solid #E2E8F0",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="#16A36A"
                    strokeWidth={2.5}
                    fill="url(#modalGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0]">
              <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                <FiShield className="text-[#16A36A]" />
                Zero brokerage on Micro-ETF allocations
              </div>
              <button
                onClick={() => handleQuickInvest(selectedStockModal)}
                className="px-5 py-2.5 bg-[#16A36A] hover:bg-[#138959] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
              >
                <span>Select for Micro-Investment</span>
                <FiArrowUpRight />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
