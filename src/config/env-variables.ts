import * as dotenv from 'dotenv';
dotenv.config();

interface Environment {
  PORT: number;
  HOST: string;
  MONGO_PORT: number;
  MONGO_HOST: string;
  MONGO_DB_NAME: string;
  MONGO_USERNAME: string;
  MONGO_PASSWORD: string;
  MAIL_HOST: string;
  MAIL_PORT: number;
  MAIL_USERNAME: string;
  MAIL_PASSWORD: string;
  MAIL_USERNAME_EMAIL: string;
  JWT_SECRET: string;
}

export const ENV: Environment = {
  PORT: Number(process.env.PORT) || 3000,
  HOST: process.env.HOST_NAME || 'localhost',
  MONGO_PORT: Number(process.env.MONGO_PORT),
  MONGO_DB_NAME: process.env.MONGO_DB_NAME,
  MONGO_HOST: process.env.MONGO_HOST,
  MONGO_USERNAME: process.env.MONGO_USERNAME,
  MONGO_PASSWORD: process.env.MONGO_PASSWORD,
  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_PORT: Number(process.env.MAIL_PORT),
  MAIL_USERNAME: process.env.MAIL_USERNAME,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD,
  MAIL_USERNAME_EMAIL: process.env.MAIL_USERNAME_EMAIL,
  JWT_SECRET: process.env.JWT_SECRET,
};
