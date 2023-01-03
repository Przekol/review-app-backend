import { Router, Request, Response, NextFunction } from "express";

import {
  createUser,
  forgotPassword,
  resendEmailVerificationToken,
  resetPassword,
  sendResetPasswordTokenStatus,
  signIn,
  verifyEmail,
} from "../services/user.service";
import {
  signInValidator,
  userValidator,
  validate,
  validateNewPassword,
} from "../middlewares/validator";
import { isValidPassResetToken } from "../middlewares/user";

export const userRouter: Router = Router();

userRouter
  .get("/", (req: Request, res: Response, next: NextFunction) => {
    res.json({
      id: 1,
    });
  })
  .post("/sign-up", userValidator, validate, createUser)
  .post("/sign-in", signInValidator, validate, signIn)
  .post("/verify-email", verifyEmail)
  .post("/resend-email-verification-token", resendEmailVerificationToken)
  .post("/forget-password", forgotPassword)
  .post(
    "/verify-pass-reset-token",
    isValidPassResetToken,
    sendResetPasswordTokenStatus
  )
  .post(
    "/reset-password",
    validateNewPassword,
    validate,
    isValidPassResetToken,
    resetPassword
  );
