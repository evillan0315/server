import { Router } from "express";
import { MonitorController } from "../controllers/monitorController";

const router = Router();

router.get("/stats", MonitorController.getSystemStats);

export default router;

