import express from "express";
import { getAll, getOne, create, update, remove } from "../controllers/prismaController";

const router = express.Router();

// Dynamic CRUD routes
router.get("/:model", getAll);
router.get("/:model/:id", getOne);
router.post("/:model", create);
router.put("/:model/:id", update);
router.delete("/:model/:id", remove);

export default router;

