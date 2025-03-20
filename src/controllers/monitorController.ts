import { Request, Response } from "express";
import { MonitorService } from "../services/monitorService";

export class MonitorController {
  static async getSystemStats(req: Request, res: Response) {
    try {
      const stats = await MonitorService.getSystemStats();
      res.json({ success: true, data: stats });
    } catch (error) {
      console.error("Error fetching system stats:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
}

