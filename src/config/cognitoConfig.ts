interface CognitoConfig {
  region: string;
  userPoolId: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  logoutUri: string;
  tokenUrl: string;
  userInfoUrl: string;
  [key: string]: string; // This makes TypeScript accept any other additional fields
}

export const cognitoConfig:CognitoConfig = {
  region: process.env.AWS_REGION!,
  userPoolId: process.env.AWS_USER_POOL_ID!,
  clientId: process.env.COGNITO_CLIENT_ID!,
  clientSecret: process.env.COGNITO_CLIENT_SECRET!,
  domain: process.env.COGNITO_DOMAIN!,
  redirectUri: process.env.COGNITO_REDIRECT_URI!,
  logoutUri: process.env.COGNITO_LOGOUT_URI!,
  tokenUrl: process.env.COGNITO_TOKEN_URL!,
  userInfoUrl: process.env.COGNITO_USER_INFO_URL!,
};



