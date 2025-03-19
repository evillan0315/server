import axios from "axios";
import { cognitoConfig } from "../config/cognitoConfig";
import qs from "querystring";
import dotenv from "dotenv";
import crypto from "crypto";

import {
  CognitoIdentityProviderClient,
  AdminInitiateAuthCommand,
  InitiateAuthCommand
} from "@aws-sdk/client-cognito-identity-provider";

dotenv.config();
export const exchangeCodeForToken = async (code: string) => {
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
};

export const getUserInfo = async (accessToken: string) => {
  console.log(accessToken, 'accessToken');
  console.log(cognitoConfig.userInfoUrl, 'cognitoConfig.userInfoUrl');
  const response = await axios.get(cognitoConfig.userInfoUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  console.log(response, 'response');
  return response.data;
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
  region: cognitoConfig.region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const authenticateUser = async (username: string, password: string) => {
  const authParams = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: process.env.AWS_USER_POOL_WEB_CLIENT_ID,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
      SECRET_HASH: generateSecretHash(username), // Include this
    },
  };

  try {
    const authCommand = new InitiateAuthCommand(authParams as any);
    return await cognitoClient.send(authCommand);
  } catch (error) {
    console.error("Authentication failed:", error);
    throw error;
  }
};






