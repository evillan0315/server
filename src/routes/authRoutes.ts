import express from "express";
import {
  signUpController,
  signInController,
  refreshTokenController,
  logoutController,
  adminLogoutController, googleLoginController, getUserInfoController 
} from "../controllers/authController";

const router = express.Router();

router.post("/google/login", googleLoginController); // Google Login
router.post("/google/userinfo", getUserInfoController); // Get Google User Info
router.post("/signup", signUpController); // Sign-up
router.post("/signin", signInController); // Sign-in
router.post("/refresh-token", refreshTokenController); // Refresh token
router.post("/logout", logoutController); // Logout
router.post("/admin/logout/:username", adminLogoutController); // Admin force logout

export default router;

