import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 5000;
export const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "http://localhost:3000";
