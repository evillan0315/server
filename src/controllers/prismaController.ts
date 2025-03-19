import { Request, Response } from "express";
import {
  getAllRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
} from "../services/prismaService";

export const getAll = async (req: Request, res: Response) => {
  try {
    const { model } = req.params;
    const records = await getAllRecords(model);
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: "Error fetching records" });
  }
};

export const getOne = async (req: Request, res: Response) => {
  try {
    const { model, id } = req.params;
    const record = await getRecordById(model, id);
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: "Error fetching record" });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const { model } = req.params;
    const record = await createRecord(model, req.body);
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ error: "Error creating record" });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { model, id } = req.params;
    const record = await updateRecord(model, id, req.body);
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: "Error updating record" });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const { model, id } = req.params;
    await deleteRecord(model, id);
    res.json({ message: "Record deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting record" });
  }
};

