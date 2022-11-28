import * as dotenv from "dotenv";
dotenv.config();

interface Environment {
  PORT: number;
  HOST: string;
}

export const ENV: Environment = {
  PORT: Number(process.env.PORT) || 3000,
  HOST: process.env.HOST_NAME || "localhost",
};
