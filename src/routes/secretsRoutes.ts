// src/routes/secretsRoutes.ts
import express from "express";
import { fetchSecret, createOrUpdate, deleteSecretController, listAllSecrets } from "../controllers/secretsController";

const router = express.Router();

router.get("/secrets", listAllSecrets); // List all secrets
router.get("/secrets/:secretName", fetchSecret); // Get a specific secret
router.post("/secrets", createOrUpdate); // Create or update a secret
router.delete("/secrets/:secretName", deleteSecretController); // Delete a secret

export default router;
