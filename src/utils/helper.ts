import { Response } from 'express';
import { randomBytes } from 'crypto';

export const sendError = (res: Response, message: string, statusCode: number = 401) => {
  res.status(statusCode).json({ error: message });
};

export const generateOtp = (otpLength: number = 6): string => {
  let OTP: string = '';
  for (let i = 0; i < otpLength - 1; i++) {
    const randoVal = Math.round(Math.random() * 9);
    OTP += randoVal;
  }
  return OTP;
};

export const generateRandomByte = () => {
  return new Promise((resolve, reject) => {
    randomBytes(30, (err, buf) => {
      if (err) return reject(err);
      const buffString = buf.toString('hex');
      resolve(buffString);
    });
  });
};
