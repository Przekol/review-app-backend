import { NextFunction, Request, Response } from "express";
import { User } from "../records/user.record";
import { EmailVerificationToken } from "../records/email-verification-token.record";
import { createTransport } from "nodemailer";
import { isValidObjectId } from "mongoose";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;
  const oldUser = await User.findOne({ email });
  if (oldUser) {
    return res.status(401).json({ error: "This email is already in use!" });
  }
  const newUser = new User({ name, email, password });
  await newUser.save();

  let OTP: string = "";
  for (let i = 0; i < 6; i++) {
    const randoVal = Math.round(Math.random() * 9);
    OTP += randoVal;
  }
  const newEmailVerificationToken = new EmailVerificationToken({
    owner: newUser._id,
    token: OTP,
  });
  await newEmailVerificationToken.save();

  const transport = createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "fdf148aa896ca9",
      pass: "a265408ec6b39b",
    },
  });

  await transport.sendMail({
    from: "verification@reviewapp.com",
    to: newUser.email,
    subject: "Verification email",
    html: `
      <p>Your verification OTP</p>
      <h1>${OTP}</h1>
      `,
  });
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
    return res.json({ error: "Invalid user!" });
  }
  const user = await User.findById(userId);
  if (!user) {
    return res.json({ error: "User not found!" });
  }
  if (user.isVerified) {
    return res.json({ error: "User is already verified!" });
  }
  const token = await EmailVerificationToken.findOne({ owner: userId });
  if (!token) {
    return res.json({ error: "Token not found!" });
  }

  // @ts-ignore
  const isMatched: boolean = await token.compareToken(OTP);
  if (!isMatched) {
    return res.json({ error: "Please submit a valid OTP!" });
  }
  user.isVerified = isMatched;
  await user.save();
  await EmailVerificationToken.findByIdAndDelete(token._id);

  const transport = createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "fdf148aa896ca9",
      pass: "a265408ec6b39b",
    },
  });

  await transport.sendMail({
    from: "verification@reviewapp.com",
    to: user.email,
    subject: "Welcome Email",
    html: `
     <h1>Welcome to our app and thanks for choosing us.</h1>
      `,
  });

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
    return res.json({ error: "User not found!" });
  }
  if (user.isVerified) {
    return res.json({ message: "This email is already verified!" });
  }
  const token = await EmailVerificationToken.findOne({ owner: userId });
  if (token) {
    return res.json({
      error: "Only after one hour you can request for another token",
    });
  }
  let OTP: string = "";
  for (let i = 0; i < 6; i++) {
    const randoVal = Math.round(Math.random() * 9);
    OTP += randoVal;
  }
  const newEmailVerificationToken = new EmailVerificationToken({
    owner: user._id,
    token: OTP,
  });
  await newEmailVerificationToken.save();

  const transport = createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "fdf148aa896ca9",
      pass: "a265408ec6b39b",
    },
  });

  await transport.sendMail({
    from: "verification@reviewapp.com",
    to: user.email,
    subject: "Verification email",
    html: `
      <p>Your verification OTP</p>
      <h1>${OTP}</h1>
      `,
  });
  res.status(201).json({
    message: "New OTP has been sent to your registered email account.",
  });
};
