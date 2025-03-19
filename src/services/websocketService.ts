import { Server as HttpServer } from "http";
import { Server as SocketIoServer, Socket } from "socket.io";
import { spawn, execSync } from "child_process";
import { Request, Response, NextFunction } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { storeCommandInDynamoDB, getStoredCommands } from "../utils/dynamoService";
import * as os from "os";
import * as fs from "fs";
import path from "path";
import process from "process";
let io: SocketIoServer | null = null;
// Function to get system details
const getSystemDetails = () => {
    return {
        operatingSystem: os.type(),
        totalMemory: `${(os.totalmem() / 1e9).toFixed(2)} GB`,
        freeMemory: `${(os.freemem() / 1e9).toFixed(2)} GB`,
        cpuCount: os.cpus().length,
        privateIP: getPrivateIP(),
        publicIP: getPublicIP(),
        host: os.hostname(),
        user: os.userInfo().username,
    };
};

// Function to get private IP
const getPrivateIP = (): string => {
    const interfaces = os.networkInterfaces();
    for (const iface of Object.values(interfaces)) {
        for (const config of iface || []) {
            if (config.family === "IPv4" && !config.internal) return config.address;
        }
    }
    return "Unknown";
};

// Function to get public IP
const getPublicIP = (): string => {
    try {
        return execSync("curl -s https://checkip.amazonaws.com").toString().trim();
    } catch (error) {
        return "Unknown";
    }
};

export function initializeWebSocket(server: HttpServer) {

    io = new SocketIoServer(server, {
	    cors: { methods: ["GET", "POST"],origin: ["http://localhost:3000", "https://board-dynamodb.duckdns.org"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"] }
	    
	  });
   
    io.use(async (socket: Socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) throw new Error("No token provided");
      console.log(token, 'token initializeWebSocket');
      const req = socket.request as any;
      req.headers.authorization = `Bearer ${token}`;
      await authenticate(req, {} as any, next);
      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

    io.on("connection", async (socket: Socket) => {
        console.log(`Client connected: ${socket.id}`);

        let currentPath = process.cwd();
        socket.emit("systemInfo", { ...getSystemDetails(), path: currentPath });

        // Send stored commands on connection
        socket.emit("storedCommands", await getStoredCommands());
        // Remove any existing event listeners before adding new ones
        socket.removeAllListeners('command');
        socket.on("command", async (message: string) => {
            const command = message.trim();
            const [cmd, ...args] = command.split(" ");

            if (cmd === "cd") {
                try {
                    process.chdir(path.resolve(currentPath, args.join(" ")));
                    currentPath = process.cwd();
                    socket.emit("systemInfo", { ...getSystemDetails(), path: currentPath });
                } catch (error) {
                    socket.emit("error", `Error changing directory: ${error.message}`);
                }
                return;
            }

            try {
                await storeCommandInDynamoDB(command);
                const localProcess = spawn(cmd, args, { shell: true, cwd: currentPath });

                localProcess.stdout.on("data", (data) => socket.emit("output", data.toString()));
                localProcess.stderr.on("data", (data) => socket.emit("output", data.toString()));
                localProcess.on("close", async () => {
                    io.emit("storedCommands", await getStoredCommands());
                });
            } catch (error) {
                socket.emit("error", `Command execution failed: ${error.message}`);
            }
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });
    });
}

// Function to get WebSocket instance
export function getWebSocketServer(): SocketIoServer | null {
    if (!io) {
        console.warn("WebSocket server is not initialized yet.");
    }
    return io;
}

