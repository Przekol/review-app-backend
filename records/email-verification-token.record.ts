import { model, Schema } from "mongoose";
import * as bcrypt from "bcrypt";
import { EmailVerificationTokenDoc } from "../types/email-verification-token";

const emailVerificationTokenSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    expires: 3600,
    default: Date.now(),
  },
});

emailVerificationTokenSchema.pre("save", async function (next) {
  if (this.isModified("token")) {
    this.token = await bcrypt.hash(this.token, 10);
  }
  next();
});
emailVerificationTokenSchema.methods.compareToken = async function (
  token: string
) {
  const result = await bcrypt.compare(token, this.token);
  return result;
};

export const EmailVerificationToken = model<EmailVerificationTokenDoc>(
  "EmailVerificationToken",
  emailVerificationTokenSchema
);
