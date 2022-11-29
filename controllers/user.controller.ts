import { Router, Request, Response, NextFunction } from "express";

import { createUser } from "../services/user.service";

export const userRouter: Router = Router();

userRouter
  .get("/", (req: Request, res: Response, next: NextFunction) => {
    res.json({
      id: 1,
    });
  })
  .post(
    "/",

    createUser
  );
