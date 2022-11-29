import { Router, Request, Response, NextFunction } from "express";

export const userRouter: Router = Router();

userRouter
  .get("/", (req: Request, res: Response, next: NextFunction) => {
    res.json({
      id: 1,
    });
  })
  .post("/", (req: Request, res: Response, next: NextFunction) => {
    res.status(201).json({ user: req.body });
  });
