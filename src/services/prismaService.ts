import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

// Initialize Prisma
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

export const getAllRecords = async (modelName: string) => {
  return await (prisma as any)[modelName].findMany();
};

export const getRecordById = async (modelName: string, id: string) => {
  return await (prisma as any)[modelName].findUnique({
    where: { id: parseInt(id) }, // Adjust type if needed
  });
};

export const createRecord = async (modelName: string, data: any) => {
  return await (prisma as any)[modelName].create({ data });
};

export const updateRecord = async (modelName: string, id: string, data: any) => {
  return await (prisma as any)[modelName].update({
    where: { id: parseInt(id) },
    data,
  });
};

export const deleteRecord = async (modelName: string, id: string) => {
  return await (prisma as any)[modelName].delete({
    where: { id: parseInt(id) },
  });
};

export default prisma;
