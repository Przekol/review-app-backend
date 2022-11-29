import { Router, Request, Response, NextFunction } from "express";
import { User } from "../records/user.record";

export const userRouter: Router = Router();

userRouter
  .get("/", (req: Request, res: Response, next: NextFunction) => {
    res.json({
      id: 1,
    });
  })
  .post("/", async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.json({ user: newUser });
  });
