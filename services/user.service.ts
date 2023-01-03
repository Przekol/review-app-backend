import { NextFunction, Request, Response } from "express";
import "express-async-errors";
import * as jwt from "jsonwebtoken";
import { User } from "../records/user.record";
import { EmailVerificationToken } from "../records/email-verification-token.record";
import { isValidObjectId } from "mongoose";
import { sendMail } from "../utils/mail";
import { sendError, generateOtp, generateRandomByte } from "../utils/helper";
import { PasswordResetToken } from "../records/password-reset-token.record";
import { ENV } from "../config/env-variables";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;
  const oldUser = await User.findOne({ email });
  if (oldUser) {
    return sendError(res, "This email is already in use!");
  }
  const newUser = new User({ name, email, password });
  await newUser.save();
  const OTP = generateOtp();
  const newEmailVerificationToken = new EmailVerificationToken({
    owner: newUser._id,
    token: OTP,
  });
  await newEmailVerificationToken.save();

  await sendMail(
    ENV.MAIL_USERNAME_EMAIL,
    newUser.email,
    "Verification email",
    `
        <p>Your verification OTP</p>
        <h1>${OTP}</h1>
        `
  );

  res.status(201).json({
    message:
      "Please verify your email. OTP has been sent to your email account!",
  });
};

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, OTP } = req.body;
  console.log({ userId, OTP });
  if (!isValidObjectId(userId)) {
    return sendError(res, "Invalid user!");
  }
  const user = await User.findById(userId);
  if (!user) {
    return sendError(res, "User not found!", 404);
  }
  if (user.isVerified) {
    return sendError(res, "User is already verified!");
  }
  const token = await EmailVerificationToken.findOne({ owner: userId });
  if (!token) {
    return sendError(res, "Token not found!");
  }

  const isMatched: boolean = await token.compareToken(OTP);
  if (!isMatched) {
    return sendError(res, "Please submit a valid OTP!");
  }
  user.isVerified = isMatched;
  await user.save();
  await EmailVerificationToken.findByIdAndDelete(token._id);

  await sendMail(
    ENV.MAIL_USERNAME_EMAIL,
    user.email,
    "Welcome Email",
    `
     <h1>Welcome to our app and thanks for choosing us.</h1>
      `
  );

  res.json({ message: "Your email is verified." });
};

export const resendEmailVerificationToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    return sendError(res, "User not found!");
  }
  if (user.isVerified) {
    return sendError(res, "This email is already verified!");
  }
  const token = await EmailVerificationToken.findOne({ owner: userId });
  if (token) {
    return sendError(
      res,
      "Only after one hour you can request for another token"
    );
  }
  const OTP = generateOtp();
  const newEmailVerificationToken = new EmailVerificationToken({
    owner: user._id,
    token: OTP,
  });
  await newEmailVerificationToken.save();

  await sendMail(
    ENV.MAIL_USERNAME_EMAIL,
    user.email,
    "Verification email",
    `
        <p>Your verification OTP</p>
        <h1>${OTP}</h1>
        `
  );

  res.status(201).json({
    message: "New OTP has been sent to your registered email account.",
  });
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  if (!email) return sendError(res, "Email is missing!");

  const user = await User.findOne({ email });
  if (!user) {
    return sendError(res, "User not found!");
  }
  const alreadyHasToken = await PasswordResetToken.findOne({ owner: user._id });

  if (alreadyHasToken)
    return sendError(
      res,
      "Only after one hour you can request for another token"
    );

  const token = await generateRandomByte();
  const newPasswordResetToken = await new PasswordResetToken({
    owner: user._id,
    token,
  });
  await newPasswordResetToken.save();

  const resetPasswordUrl = `http://${ENV.HOST}:${ENV.PORT}/reset-password?token=${token}&id=${user._id}`;

  await sendMail(
    "security@reviewapp.com",
    user.email,
    "Reset Password Link",
    `
        <p>Click here to reset password.</p>
        <a href="${resetPasswordUrl}">Change Password</a>
        `
  );
  res.json({ message: "Link sent to your email!" });
};

export const sendResetPasswordTokenStatus = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.json({ valid: true });
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { newPassword, userId } = req.body;

  const user = await User.findById(userId);
  const isMatched = await user.comparePassword(newPassword);
  if (isMatched)
    return sendError(
      res,
      "The new password must be different from the old one!"
    );

  user.password = newPassword;
  await user.save();

  // @ts-ignore
  await PasswordResetToken.findByIdAndDelete(req.resetToken._id);
  await sendMail(
    "security@reviewapp.com",
    user.email,
    "Password Reset Successfully",
    `
  <h1>Password Reset Successfully</h1>
  <p>Now you can use new password.</p>
  `
  );
  res.json({
    message: "Password Reset Successfully,now you can use new password.",
  });
};

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return sendError(res, "Email/Password mismatch.");

  const isMatched = await user.comparePassword(password);
  if (!isMatched) return sendError(res, "Email/Password mismatch.");

  const jwtToken = jwt.sign({ userId: user._id }, ENV.JWT_SECRET);
  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      token: jwtToken,
    },
  });
};
