import { Router, Request, Response, NextFunction } from "express";

import {
  createUser,
  resendEmailVerificationToken,
  verifyEmail,
} from "../services/user.service";
import { userValidator, validate } from "../middlewares/validator";

export const userRouter: Router = Router();

userRouter
  .get("/", (req: Request, res: Response, next: NextFunction) => {
    res.json({
      id: 1,
    });
  })
  .post("/sign-up", userValidator, validate, createUser)
  .post("/verify-email", verifyEmail)
  .post("/resend-email-verification-token", resendEmailVerificationToken);
