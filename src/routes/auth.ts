import express, { Request, Response } from "express";
import session from "express-session";
import { cognitoConfig } from "../config/cognitoConfig";
import { exchangeCodeForToken, getUserInfo, authenticateUser } from "../services/authService";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Session middleware configuration
router.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false, // Optimized: Only save sessions when modified
    cookie: {
      httpOnly: true, // Security: Prevents client-side JS access to cookies
      secure: process.env.NODE_ENV === "production", // Security: Only set cookies over HTTPS in production
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);
router.get("/", (req: Request, res: Response) => {
  if (!req.session.user) {
    return res.redirect("/signin"); // Redirect to login if not authenticated
  }
  res.json(req.session.user);
});
// Login with username/password (internal authentication)
router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const tokenData = await authenticateUser(username, password);
    const token = tokenData?.AuthenticationResult?.AccessToken;

    //const authenticate
    const userInfo = await getUserInfo(token);
    //console.log(userInfo, 'userInfo');
    //req.session = { ...userInfo, access_token: token }; // Store user info in session
    //console.log(req.session.user, 'req.session.user');
    //res.redirect("/");
    res.json({...tokenData, user: userInfo });
  } catch (error) {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// Redirect to AWS Cognito login page (OAuth)
router.get("/login", (req: Request, res: Response) => {
  const authUrl = `${cognitoConfig.domain}/login?client_id=${cognitoConfig.clientId}&response_type=code&scope=email+openid&redirect_uri=${cognitoConfig.redirectUri}`;
  res.redirect(authUrl);
});

// Serve login HTML page
router.get("/signin", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../public/login.html"));
});

// Serve chat HTML page (protected route)
router.get("/chat", (req: Request, res: Response) => {
   const token = req.cookies?.token; 
  if (!token) {
    return res.redirect("/signin"); // Redirect to login if not authenticated
  }
  res.sendFile(path.join(__dirname, "../public/chat.html"));
});


// Handle OAuth callback from Cognito
router.get("/auth/callback", async (req: Request, res: Response) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).send("Authorization code missing.");
  }

  try {
    const tokenData = await exchangeCodeForToken(code as string);
    console.log(tokenData, 'tokenData /auth/callback')
    const userInfo = await getUserInfo(tokenData.access_token);
    req.session.user = { ...userInfo, access_token: tokenData.access_token }; // Store user info in session
    res.redirect("/");
  } catch (error) {
    console.error("Authentication failed:", error); // Log the error
    res.status(500).send("Authentication failed.");
  }
});

// Logout user (both session and Cognito)
router.get("/logout", (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.redirect(
      `${cognitoConfig.domain}/logout?client_id=${cognitoConfig.clientId}&logout_uri=${cognitoConfig.logoutUri}`
    );
  });
});

// Get user profile (protected route)
router.get("/profile", (req: Request, res: Response) => {
   const token = req.cookies?.token; 
   console.log(token, 'token');
 
  res.json(token);
});

export default router;
