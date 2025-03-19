import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import dotenv from "dotenv";

dotenv.config();

export const dynamoDBClient = new DynamoDBClient({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

