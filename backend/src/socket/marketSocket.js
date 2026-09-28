import { Server } from "socket.io";
import { generateLiveTicks, getAllStocks, syncLiveMarketData, getMarketIndices } from "../services/marketService.js";

let io = null;
let tickInterval = null;

export const initMarketSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  // Perform an initial background sync from free market API
  syncLiveMarketData();

  io.on("connection", (socket) => {
    // Send immediate snapshot of market data on connect
    socket.emit("market:init", {
      stocks: getAllStocks(),
      indices: getMarketIndices(),
      connectedClients: io.engine.clientsCount,
      timestamp: Date.now(),
    });

    // Client joins a specific stock room for high-frequency updates
    socket.on("subscribe:stock", (symbol) => {
      if (symbol) {
        socket.join(`stock:${symbol.toUpperCase()}`);
      }
    });

    socket.on("unsubscribe:stock", (symbol) => {
      if (symbol) {
        socket.leave(`stock:${symbol.toUpperCase()}`);
      }
    });

    socket.on("market:ping", () => {
      socket.emit("market:pong", { timestamp: Date.now() });
    });

    socket.on("disconnect", () => {
      // Handled
    });
  });

  // Start real-time price tick loop every 2.5 seconds
  if (!tickInterval) {
    tickInterval = setInterval(() => {
      if (io && io.engine.clientsCount > 0) {
        const { stocks, ticks } = generateLiveTicks();

        // Broadcast batch ticks to all connected clients
        io.emit("market:tick", {
          ticks,
          indices: getMarketIndices(),
          timestamp: Date.now(),
        });

        // Also emit to individual symbol rooms
        ticks.forEach((tick) => {
          io.to(`stock:${tick.symbol.toUpperCase()}`).emit("stock:update", tick);
          io.to(`stock:${tick.ticker.toUpperCase()}`).emit("stock:update", tick);
        });
      }
    }, 2500);
  }

  return io;
};

export const getSocketIO = () => io;
