import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminGetUserCommand,
  AdminUpdateUserAttributesCommand,
  AdminDeleteUserCommand,
  ListUsersCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import dotenv from "dotenv";

dotenv.config();

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION!,
});

const userPoolId = process.env.AWS_USER_POOL_ID!;

// ✅ Create User
export const createUser = async (email: string, name: string) => {
  try {
    const command = new AdminCreateUserCommand({
      UserPoolId: userPoolId,
      Username: email,
      UserAttributes: [
        { Name: "email", Value: email },
        { Name: "name", Value: name },
      ],
      MessageAction: "SUPPRESS", // Prevents sending invitation email
    });

    const response = await cognitoClient.send(command);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to create user");
  }
};

// ✅ Get User
export const getUser = async (username: string) => {
  try {
    const command = new AdminGetUserCommand({
      UserPoolId: userPoolId,
      Username: username,
    });

    const response = await cognitoClient.send(command);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch user");
  }
};

// ✅ Update User
export const updateUser = async (username: string, attributes: { Name: string; Value: string }[]) => {
  try {
    const command = new AdminUpdateUserAttributesCommand({
      UserPoolId: userPoolId,
      Username: username,
      UserAttributes: attributes,
    });

    await cognitoClient.send(command);
    return { message: "User updated successfully" };
  } catch (error: any) {
    throw new Error(error.message || "Failed to update user");
  }
};

// ✅ Delete User
export const deleteUser = async (username: string) => {
  try {
    const command = new AdminDeleteUserCommand({
      UserPoolId: userPoolId,
      Username: username,
    });

    await cognitoClient.send(command);
    return { message: "User deleted successfully" };
  } catch (error: any) {
    throw new Error(error.message || "Failed to delete user");
  }
};

// ✅ List Users
export const listUsers = async () => {
  try {
    const command = new ListUsersCommand({
      UserPoolId: userPoolId,
    });

    const response = await cognitoClient.send(command);
    return response.Users;
  } catch (error: any) {
    throw new Error(error.message || "Failed to list users");
  }
};

