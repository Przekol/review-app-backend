import { NextFunction, Request, Response } from 'express';
import { PasswordResetToken } from '../records/password-reset-token.record';
import { sendError } from '../utils';
import { isValidObjectId } from 'mongoose';

export const isValidPassResetToken = async (req: Request, res: Response, next: NextFunction) => {
  const { token, userId } = req.body;

  if (!token.trim() || !isValidObjectId(userId)) return sendError(res, 'Invalid request!');

  const resetToken = await PasswordResetToken.findOne({ owner: userId });
  if (!resetToken) return sendError(res, 'Unauthorized access, invalid request!');

  const isMatched = await resetToken.compareToken(token);
  if (!isMatched) return sendError(res, 'Unauthorized access, invalid request!');
  // @ts-ignore
  req.resetToken = resetToken;
  next();
};
