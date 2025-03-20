// src/services/secretsService.ts
import AWS from "aws-sdk";

const secretsManager = new AWS.SecretsManager({ region: "ap-southeast-2" });

export const getSecret = async (secretName: string) => {
  try {
    const secretData = await secretsManager.getSecretValue({ SecretId: secretName }).promise();
    return JSON.parse(secretData.SecretString || "{}");
  } catch (error: any) {
    console.error("Error fetching secret:", error.message);
    throw new Error("Failed to retrieve secret");
  }
};

export const createOrUpdateSecret = async (secretName: string, secretValue: object) => {
  try {
    const secretString = JSON.stringify(secretValue);

    await secretsManager
      .createSecret({ Name: secretName, SecretString: secretString })
      .promise()
      .catch(async (err) => {
        if (err.code === "ResourceExistsException") {
          await secretsManager
            .updateSecret({ SecretId: secretName, SecretString: secretString })
            .promise();
        } else {
          throw err;
        }
      });

    return { message: "Secret created or updated successfully" };
  } catch (error: any) {
    console.error("Error creating/updating secret:", error.message);
    throw new Error("Failed to create/update secret");
  }
};

export const deleteSecret = async (secretName: string) => {
  try {
    await secretsManager.deleteSecret({ SecretId: secretName, ForceDeleteWithoutRecovery: true }).promise();
    return { message: "Secret deleted successfully" };
  } catch (error: any) {
    console.error("Error deleting secret:", error.message);
    throw new Error("Failed to delete secret");
  }
};

export const listSecrets = async () => {
  try {
    const secretsList = await secretsManager.listSecrets().promise();
    return secretsList.SecretList?.map((secret) => ({ name: secret.Name, arn: secret.ARN })) || [];
  } catch (error: any) {
    console.error("Error listing secrets:", error.message);
    throw new Error("Failed to list secrets");
  }
};
