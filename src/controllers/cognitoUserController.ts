import { Request, Response } from "express";
import { createUser, getUser, updateUser, deleteUser, listUsers } from "../services/cognitoUserService";

// ✅ Create User
export const createUserController = async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;
    const response = await createUser(email, name);
    res.status(201).json(response);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Get User
export const getUserController = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const response = await getUser(username);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

// ✅ Update User
export const updateUserController = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const { attributes } = req.body;
    const response = await updateUser(username, attributes);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Delete User
export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const response = await deleteUser(username);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ List Users
export const listUsersController = async (_req: Request, res: Response) => {
  try {
    const response = await listUsers();
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

