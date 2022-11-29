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
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(401).json({ error: "This email is already in use!" });
    }
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ user: newUser });
  });
