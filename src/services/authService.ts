import axios from "axios";
import { cognitoConfig } from "../config/cognitoConfig";
import qs from "querystring";
import dotenv from "dotenv";
import crypto from "crypto";

import {
  CognitoIdentityProviderClient,
  GetUserCommand,
  AdminInitiateAuthCommand,
  InitiateAuthCommand
} from "@aws-sdk/client-cognito-identity-provider";

dotenv.config();
export const exchangeCodeForToken = async (code: string) => {
  try {
    const tokenParams = qs.stringify({
      grant_type: "authorization_code",
      client_id: cognitoConfig.clientId,
      client_secret: cognitoConfig.clientSecret,
      redirect_uri: cognitoConfig.redirectUri,
      code,
      
    });

    const response = await axios.post(cognitoConfig.tokenUrl, tokenParams, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error exchanging code for token:", error?.response?.data || error.message);

    // Throw a user-friendly error message
    throw new Error(
      error?.response?.data?.error_description || "Failed to exchange code for token"
    );
  }
};

export const getUserInfo = async (accessToken: string) => {
  try {
    const command = new GetUserCommand({ AccessToken: accessToken });
    const response = await cognitoClient.send(command);

    console.log("User Info:", response);
    return response; // Returns the user attributes and details
  } catch (error: any) {
    console.error("Error fetching user info:", error.message || error);
    throw new Error(error.message || "Failed to fetch user info from Cognito");
  }
};

const generateSecretHash = (username: string) => {
  const clientSecret = process.env.COGNITO_CLIENT_SECRET!;
  const clientId = process.env.AWS_USER_POOL_WEB_CLIENT_ID!;

  return crypto
    .createHmac("sha256", clientSecret)
    .update(username + clientId)
    .digest("base64");
};
const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const authenticateUser = async (username: string, password: string) => {
  const authFlows = ["USER_PASSWORD_AUTH", "ADMIN_NO_SRP_AUTH"];
  const selectedAuthFlow = process.env.AWS_AUTHENTICATION_FLOW_TYPE as string;

  if (!authFlows.includes(selectedAuthFlow)) {
    throw new Error(`Invalid Auth Flow: ${selectedAuthFlow}`);
  }

  const authParams = {
    AuthFlow: selectedAuthFlow, // ✅ Use a single string, not an array
    ClientId: process.env.AWS_USER_POOL_WEB_CLIENT_ID!,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
      SECRET_HASH: generateSecretHash(username), // Required if app client secret is enabled
    },
  };

  try {
    const authCommand =
      selectedAuthFlow === "ADMIN_NO_SRP_AUTH"
        ? new AdminInitiateAuthCommand({ ...authParams, UserPoolId: process.env.AWS_USER_POOL_ID! })
        : new InitiateAuthCommand(authParams);

    const response = await cognitoClient.send(authCommand);
    
    if (!response.AuthenticationResult?.IdToken) {
      throw new Error("Missing ID token. Ensure 'openid' scope is enabled in Cognito settings.");
    }
    console.log(response, 'response');
    return response;
  } catch (error: any) {
    console.error("Authentication failed:", error.message || error);
    throw new Error(error.message || "Authentication failed");
  }
};







