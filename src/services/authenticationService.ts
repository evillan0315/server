import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  InitiateAuthCommand,
  GlobalSignOutCommand,
  AdminInitiateAuthCommand,
  AdminUserGlobalSignOutCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION!,
});

const userPoolId = process.env.AWS_USER_POOL_ID!;
const clientId = process.env.AWS_USER_POOL_WEB_CLIENT_ID!;
const cognitoDomain = process.env.COGNITO_DOMAIN!;
const redirectUri = process.env.COGNITO_REDIRECT_URI!;
const googleClientId = process.env.GOOGLE_CLIENT_ID!;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET!;


// ✅ Google Login
export const googleLogin = async (code: string) => {
  try {
    // 🔹 Exchange authorization code for tokens
    const tokenResponse = await axios.post(
      `${cognitoDomain}/oauth2/token`,
      new URLSearchParams({
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: googleClientSecret,
        code: code,
        redirect_uri: redirectUri,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    return tokenResponse.data;
  } catch (error: any) {
    throw new Error(error.response?.data || "Google login failed");
  }
};

// ✅ User Info (Google)
export const getUserInfo = async (accessToken: string) => {
  try {
    const response = await axios.get(`${cognitoDomain}/oauth2/userInfo`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data || "Failed to fetch user info");
  }
};

// ✅ User Sign-up
export const signUpUser = async (email: string, password: string, name: string) => {
  try {
    const command = new SignUpCommand({
      ClientId: clientId,
      Username: email,
      Password: password,
      UserAttributes: [{ Name: "email", Value: email }, { Name: "name", Value: name }],
    });

    const response = await cognitoClient.send(command);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Sign-up failed");
  }
};

// ✅ User Sign-in
export const signInUser = async (email: string, password: string) => {
  try {
    const command = new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    const response = await cognitoClient.send(command);
    return response.AuthenticationResult;
  } catch (error: any) {
    throw new Error(error.message || "Sign-in failed");
  }
};

// ✅ Token Refresh
export const refreshToken = async (refreshToken: string) => {
  try {
    const command = new InitiateAuthCommand({
      AuthFlow: "REFRESH_TOKEN_AUTH",
      ClientId: clientId,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      },
    });

    const response = await cognitoClient.send(command);
    return response.AuthenticationResult;
  } catch (error: any) {
    throw new Error(error.message || "Failed to refresh token");
  }
};

// ✅ User Logout (Client-side)
export const logoutUser = async (accessToken: string) => {
  try {
    const command = new GlobalSignOutCommand({
      AccessToken: accessToken,
    });

    await cognitoClient.send(command);
    return { message: "User logged out successfully" };
  } catch (error: any) {
    throw new Error(error.message || "Logout failed");
  }
};

// ✅ Admin Logout (Server-side, force sign-out)
export const adminLogoutUser = async (username: string) => {
  try {
    const command = new AdminUserGlobalSignOutCommand({
      UserPoolId: userPoolId,
      Username: username,
    });

    await cognitoClient.send(command);
    return { message: "User forcefully logged out by admin" };
  } catch (error: any) {
    throw new Error(error.message || "Admin logout failed");
  }
};

