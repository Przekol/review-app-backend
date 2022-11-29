import * as dotenv from "dotenv";
dotenv.config();

interface Environment {
  PORT: number;
  HOST: string;
  MONGO_PORT: number;
  MONGO_HOST: string;
  MONGO_DB_NAME: string;
  MONGO_USERNAME: string;
  MONGO_PASSWORD: string;
}

export const ENV: Environment = {
  PORT: Number(process.env.PORT) || 3000,
  HOST: process.env.HOST_NAME || "localhost",
  MONGO_PORT: Number(process.env.MONGO_PORT),
  MONGO_DB_NAME: process.env.MONGO_DB_NAME,
  MONGO_HOST: process.env.MONGO_HOST,
  MONGO_USERNAME: process.env.MONGO_USERNAME,
  MONGO_PASSWORD: process.env.MONGO_PASSWORD,
};
