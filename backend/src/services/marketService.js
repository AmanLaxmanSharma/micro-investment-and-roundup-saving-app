import https from "https";

// Initial benchmark stock & asset list
const INITIAL_STOCKS = [
  {
    symbol: "RELIANCE.NS",
    ticker: "RELIANCE",
    name: "Reliance Industries Ltd",
    category: "indian_equity",
    sector: "Energy & Conglomerate",
    currency: "INR",
    basePrice: 2980.50,
    currentPrice: 2980.50,
    previousClose: 2955.00,
    dayHigh: 2995.00,
    dayLow: 2948.20,
    volume: 3420000,
    sparkline: [2955, 2960, 2968, 2962, 2975, 2980, 2978, 2980.50],
  },
  {
    symbol: "TCS.NS",
    ticker: "TCS",
    name: "Tata Consultancy Services",
    category: "indian_equity",
    sector: "IT & Software Services",
    currency: "INR",
    basePrice: 4215.30,
    currentPrice: 4215.30,
    previousClose: 4180.00,
    dayHigh: 4235.00,
    dayLow: 4175.50,
    volume: 1850000,
    sparkline: [4180, 4190, 4185, 4205, 4210, 4225, 4215.30],
  },
  {
    symbol: "HDFCBANK.NS",
    ticker: "HDFCBANK",
    name: "HDFC Bank Ltd",
    category: "indian_equity",
    sector: "Banking & Financials",
    currency: "INR",
    basePrice: 1680.40,
    currentPrice: 1680.40,
    previousClose: 1692.00,
    dayHigh: 1695.00,
    dayLow: 1672.00,
    volume: 5200000,
    sparkline: [1692, 1688, 1685, 1678, 1682, 1680.40],
  },
  {
    symbol: "INFY.NS",
    ticker: "INFOSYS",
    name: "Infosys Ltd",
    category: "indian_equity",
    sector: "IT Services",
    currency: "INR",
    basePrice: 1895.75,
    currentPrice: 1895.75,
    previousClose: 1865.00,
    dayHigh: 1910.00,
    dayLow: 1860.00,
    volume: 2900000,
    sparkline: [1865, 1872, 1880, 1888, 1892, 1895.75],
  },
  {
    symbol: "TATAMOTORS.NS",
    ticker: "TATAMOTORS",
    name: "Tata Motors Ltd",
    category: "indian_equity",
    sector: "Automotive & EV",
    currency: "INR",
    basePrice: 975.20,
    currentPrice: 975.20,
    previousClose: 960.00,
    dayHigh: 982.00,
    dayLow: 958.00,
    volume: 4100000,
    sparkline: [960, 964, 970, 968, 972, 975.20],
  },
  {
    symbol: "NIFTYBEES.NS",
    ticker: "NIFTYBEES",
    name: "Nippon India Nifty 50 ETF",
    category: "etf_gold",
    sector: "Index Micro-ETF",
    currency: "INR",
    basePrice: 268.45,
    currentPrice: 268.45,
    previousClose: 265.80,
    dayHigh: 269.50,
    dayLow: 265.20,
    volume: 8200000,
    sparkline: [265.80, 266.20, 267.10, 267.80, 268.45],
  },
  {
    symbol: "GOLDBEES.NS",
    ticker: "GOLDBEES",
    name: "Nippon India Gold ETF",
    category: "etf_gold",
    sector: "Digital Gold & Commodities",
    currency: "INR",
    basePrice: 65.80,
    currentPrice: 65.80,
    previousClose: 65.10,
    dayHigh: 66.15,
    dayLow: 64.95,
    volume: 12400000,
    sparkline: [65.10, 65.30, 65.45, 65.65, 65.80],
  },
  {
    symbol: "SILVERBEES.NS",
    ticker: "SILVERBEES",
    name: "Nippon India Silver ETF",
    category: "etf_gold",
    sector: "Digital Silver Asset",
    currency: "INR",
    basePrice: 88.50,
    currentPrice: 88.50,
    previousClose: 87.20,
    dayHigh: 89.10,
    dayLow: 86.90,
    volume: 9100000,
    sparkline: [87.20, 87.60, 88.10, 88.35, 88.50],
  },
  {
    symbol: "NVDA",
    ticker: "NVDA",
    name: "NVIDIA Corporation",
    category: "global_tech",
    sector: "AI & Semiconductors",
    currency: "USD",
    basePrice: 128.40,
    currentPrice: 128.40,
    previousClose: 124.80,
    dayHigh: 129.80,
    dayLow: 124.20,
    volume: 48000000,
    sparkline: [124.80, 126.10, 127.30, 126.90, 128.40],
  },
  {
    symbol: "AAPL",
    ticker: "AAPL",
    name: "Apple Inc.",
    category: "global_tech",
    sector: "Consumer Electronics",
    currency: "USD",
    basePrice: 224.50,
    currentPrice: 224.50,
    previousClose: 222.10,
    dayHigh: 225.80,
    dayLow: 221.70,
    volume: 32000000,
    sparkline: [222.10, 222.80, 223.50, 224.10, 224.50],
  },
  {
    symbol: "GOOGL",
    ticker: "GOOGL",
    name: "Alphabet Inc. (Google)",
    category: "global_tech",
    sector: "Internet & Cloud",
    currency: "USD",
    basePrice: 178.25,
    currentPrice: 178.25,
    previousClose: 176.50,
    dayHigh: 179.40,
    dayLow: 175.90,
    volume: 22000000,
    sparkline: [176.50, 177.10, 177.80, 178.00, 178.25],
  },
  {
    symbol: "MSFT",
    ticker: "MSFT",
    name: "Microsoft Corporation",
    category: "global_tech",
    sector: "Software & Cloud Computing",
    currency: "USD",
    basePrice: 432.80,
    currentPrice: 432.80,
    previousClose: 429.20,
    dayHigh: 434.50,
    dayLow: 428.00,
    volume: 18000000,
    sparkline: [429.20, 430.50, 431.20, 432.10, 432.80],
  },
];

// Market state storage
let stockStore = JSON.parse(JSON.stringify(INITIAL_STOCKS));

// Free Public Market API fetcher helper
export const fetchLiveYahooQuote = (symbol) => {
  return new Promise((resolve) => {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=5d`;
    
    const req = https.get(
      url,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Accept": "application/json",
        },
        timeout: 3000,
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const parsed = JSON.parse(data);
            const result = parsed?.chart?.result?.[0];
            if (result && result.meta) {
              const meta = result.meta;
              const price = meta.regularMarketPrice || meta.chartPreviousClose;
              const prevClose = meta.chartPreviousClose || price;
              resolve({
                currentPrice: Number(price.toFixed(2)),
                previousClose: Number(prevClose.toFixed(2)),
                dayHigh: Number((meta.regularMarketDayHigh || price * 1.01).toFixed(2)),
                dayLow: Number((meta.regularMarketDayLow || price * 0.99).toFixed(2)),
              });
              return;
            }
          } catch (e) {
            // Ignore parse error, use fallback
          }
          resolve(null);
        });
      }
    );

    req.on("error", () => resolve(null));
    req.on("timeout", () => {
      req.destroy();
      resolve(null);
    });
  });
};

// Initial background sync from free Yahoo Finance API
export const syncLiveMarketData = async () => {
  try {
    for (const stock of stockStore) {
      const liveData = await fetchLiveYahooQuote(stock.symbol);
      if (liveData && liveData.currentPrice) {
        stock.currentPrice = liveData.currentPrice;
        stock.previousClose = liveData.previousClose;
        stock.dayHigh = liveData.dayHigh;
        stock.dayLow = liveData.dayLow;
        if (!stock.sparkline || stock.sparkline.length < 5) {
          stock.sparkline = [stock.previousClose, stock.currentPrice];
        }
      }
    }
  } catch (err) {
    console.warn("External market API sync warning:", err.message);
  }
};

// Update and tick prices with dynamic market simulation
export const generateLiveTicks = () => {
  const updatedTicks = [];

  stockStore = stockStore.map((stock) => {
    // Determine random micro delta (-0.35% to +0.38%)
    const pctChange = (Math.random() - 0.48) * 0.007;
    const priceDelta = stock.currentPrice * pctChange;
    const newPrice = Number(Math.max(1, stock.currentPrice + priceDelta).toFixed(2));
    
    const change = Number((newPrice - stock.previousClose).toFixed(2));
    const changePercent = Number(((change / stock.previousClose) * 100).toFixed(2));

    const dayHigh = Number(Math.max(stock.dayHigh, newPrice).toFixed(2));
    const dayLow = Number(Math.min(stock.dayLow, newPrice).toFixed(2));
    const volume = stock.volume + Math.floor(Math.random() * 500) + 50;

    // Maintain a rolling sparkline array of 12 points
    const sparkline = [...(stock.sparkline || [])];
    sparkline.push(newPrice);
    if (sparkline.length > 14) {
      sparkline.shift();
    }

    const updated = {
      ...stock,
      currentPrice: newPrice,
      change,
      changePercent,
      dayHigh,
      dayLow,
      volume,
      sparkline,
      lastUpdated: new Date().toISOString(),
    };

    updatedTicks.push({
      symbol: stock.symbol,
      ticker: stock.ticker,
      currentPrice: newPrice,
      change,
      changePercent,
      dayHigh,
      dayLow,
      sparkline,
      direction: priceDelta >= 0 ? "up" : "down",
      timestamp: Date.now(),
    });

    return updated;
  });

  return { stocks: stockStore, ticks: updatedTicks };
};

export const getAllStocks = () => {
  return stockStore.map((stock) => {
    const change = Number((stock.currentPrice - stock.previousClose).toFixed(2));
    const changePercent = Number(((change / stock.previousClose) * 100).toFixed(2));
    return {
      ...stock,
      change,
      changePercent,
      lastUpdated: new Date().toISOString(),
    };
  });
};

export const getStockBySymbol = (symbol) => {
  const stock = stockStore.find(
    (s) => s.symbol.toLowerCase() === symbol.toLowerCase() || s.ticker.toLowerCase() === symbol.toLowerCase()
  );
  if (!stock) return null;
  const change = Number((stock.currentPrice - stock.previousClose).toFixed(2));
  const changePercent = Number(((change / stock.previousClose) * 100).toFixed(2));
  return {
    ...stock,
    change,
    changePercent,
  };
};

export const getMarketIndices = () => {
  // Synthesize Major Market Indexes
  const nifty50 = stockStore.find((s) => s.ticker === "NIFTYBEES");
  const niftyLevel = nifty50 ? (nifty50.currentPrice * 94.2).toFixed(2) : "25,320.50";
  const sensexLevel = nifty50 ? (nifty50.currentPrice * 308.1).toFixed(2) : "82,890.40";

  return [
    {
      name: "NIFTY 50",
      exchange: "NSE",
      level: niftyLevel,
      change: "+142.30",
      changePercent: "+0.57%",
      isPositive: true,
    },
    {
      name: "SENSEX",
      exchange: "BSE",
      level: sensexLevel,
      change: "+418.90",
      changePercent: "+0.51%",
      isPositive: true,
    },
    {
      name: "Sikka Gold Index",
      exchange: "DIGITAL GOLD",
      level: "₹7,450 /g",
      change: "+₹34.00",
      changePercent: "+0.46%",
      isPositive: true,
    },
    {
      name: "NASDAQ 100",
      exchange: "US TECH",
      level: "19,840.20",
      change: "+195.40",
      changePercent: "+0.99%",
      isPositive: true,
    },
  ];
};
