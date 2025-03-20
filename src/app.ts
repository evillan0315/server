import express from "express";
import cors from "cors";
import http from "http";
import { config } from "dotenv";
import fileRoutes from "./routes/files";
import commandRoutes from "./routes/commands";
import authRoutes from "./routes/auth";
import coderRoutes from "./routes/coder";
import nginxRoutes from "./routes/nginx";
import prismaRoutes from "./routes/prisma";
import monitorRoutes from "./routes/monitor";
import { initializeWebSocket } from "./services/websocketService";
import { authenticate } from "./middlewares/authMiddleware";

config();

const app = express();
const server = http.createServer(app);
app.use(cors({
  origin: ["http://localhost:3000", "https://board-dynamodb.duckdns.org"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
//app.use(cors());
app.use(express.json());

app.use(authRoutes);
app.use("/api", authenticate, fileRoutes);
app.use("/api", authenticate, prismaRoutes);
app.use("/run", authenticate, commandRoutes);
app.use("/coder", authenticate, coderRoutes);
app.use("/nginx", authenticate, nginxRoutes); 
app.use("/monitor", monitorRoutes); 
initializeWebSocket(server); // Websocket runs on /socket.io/


const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on http://localhost:${PORT}`));

