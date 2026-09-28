import "dotenv/config";
import http from "http";
import app from "./app.js";
import { initMarketSocket } from "./socket/marketSocket.js";

const PORT = process.env.PORT || 5000;

const httpServer = http.createServer(app);
initMarketSocket(httpServer);

if (!process.env.VERCEL) {
  httpServer.listen(PORT, () => {
    console.log(`Server & Socket.IO running on port ${PORT}`);
  });
}

export default app;

