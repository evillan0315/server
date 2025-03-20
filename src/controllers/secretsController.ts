// src/controllers/secretsController.ts
import { Request, Response } from "express";
import { getSecret, createOrUpdateSecret, deleteSecret, listSecrets } from "../services/secretsService";

export const fetchSecret = async (req: Request, res: Response) => {
  try {
    const { secretName } = req.params;
    if (!secretName) return res.status(400).json({ error: "Secret name is required" });

    const secret = await getSecret(secretName);
    return res.status(200).json({ secret });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const createOrUpdate = async (req: Request, res: Response) => {
  try {
    const { secretName, secretValue } = req.body;
    if (!secretName || !secretValue) return res.status(400).json({ error: "Secret name and value are required" });

    const result = await createOrUpdateSecret(secretName, secretValue);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteSecretController = async (req: Request, res: Response) => {
  try {
    const { secretName } = req.params;
    if (!secretName) return res.status(400).json({ error: "Secret name is required" });

    const result = await deleteSecret(secretName);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const listAllSecrets = async (req: Request, res: Response) => {
  try {
    const secrets = await listSecrets();
    return res.status(200).json({ secrets });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
