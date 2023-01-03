import { body, validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";

export const userValidator = [
  body("name").trim().not().isEmpty().withMessage("Name is missing!"),
  body("email").normalizeEmail().isEmail().withMessage("Email is invalid!"),
  body("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is missing!")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be 8 to 20 characters long!"),
];

export const signInValidator = [
  body("email").normalizeEmail().isEmail().withMessage("Email is invalid!"),
  body("password").trim().not().isEmpty().withMessage("Password is missing!"),
];

export const validateNewPassword = [
  body("newPassword")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is missing!")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be 8 to 20 characters long!"),
];

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const error = validationResult(req).array();
  if (error.length) {
    return res.json({ error: error[0].msg });
  }
  next();
};
