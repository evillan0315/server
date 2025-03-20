import { Request, Response } from "express";
import { googleLogin, getUserInfo, signUpUser, signInUser, refreshToken, logoutUser, adminLogoutUser } from "../services/authenticationService";

// ✅ Google Login
export const googleLoginController = async (req: Request, res: Response) => {
  try {
    const { code } = req.body; // Get authorization code from frontend
    const tokenData = await googleLogin(code);
    res.status(200).json(tokenData);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Get User Info
export const getUserInfoController = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.body;
    const userInfo = await getUserInfo(accessToken);
    res.status(200).json(userInfo);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ User Sign-up
export const signUpController = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    const response = await signUpUser(email, password, name);
    res.status(201).json(response);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ User Sign-in
export const signInController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const response = await signInUser(email, password);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};

// ✅ Token Refresh
export const refreshTokenController = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const response = await refreshToken(refreshToken);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ User Logout
export const logoutController = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.body;
    const response = await logoutUser(accessToken);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Admin Logout
export const adminLogoutController = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const response = await adminLogoutUser(username);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

