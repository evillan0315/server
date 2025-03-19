import express, { Request, Response } from "express";
import { exec } from "child_process";
import { authenticate } from "../middlewares/authMiddleware";
import { storeCommandInDynamoDB, getStoredCommands } from "../utils/dynamoService";
import { getWebSocketServer } from "../services/websocketService"; // Import WebSocket instance

const router = express.Router();

// Execute command and return output
const executeCommand = (command: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) return reject(`Error: ${error.message}`);
            if (stderr) return reject(`stderr: ${stderr}`);
            resolve(stdout);
        });
    });
};

// Command execution route
router.post("/", async (req: Request, res: Response) => {
    const { command } = req.body;

    try {
        await storeCommandInDynamoDB(command);
        const result = await executeCommand(command);
        const storedCommands = await getStoredCommands();

        // Notify WebSocket clients about the new command
        const io = getWebSocketServer();
        io.emit("storedCommands", storedCommands);

        res.status(200).json({ output: result, storedCommands });
    } catch (error) {
        res.status(500).json({ error: "Command execution failed", message: error });
    }
});

export default router;

