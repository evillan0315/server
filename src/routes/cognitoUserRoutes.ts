import express from "express";
import {
  createUserController,
  getUserController,
  updateUserController,
  deleteUserController,
  listUsersController,
} from "../controllers/cognitoUserController";

const router = express.Router();

router.post("/users", createUserController); // Create user
router.get("/users", listUsersController); // List users
router.get("/users/:username", getUserController); // Get user by username
router.put("/users/:username", updateUserController); // Update user attributes
router.delete("/users/:username", deleteUserController); // Delete user

export default router;

