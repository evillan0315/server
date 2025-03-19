import express, { Request, Response } from "express";
import { storeCommandInDynamoDB, getStoredCommands } from "../utils/dynamoService";

const router = express.Router();

// Protected command execution route
router.post("/", async (req: Request, res: Response) => {
  const { command } = req.body;

  try {
    await storeCommandInDynamoDB(command);
    const storedCommands = await getStoredCommands();
    res.status(200).json({ storedCommands });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Command execution failed", message: error });
  }
});

export default router;

