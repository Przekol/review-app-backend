import { Document, Types } from "mongoose";

export interface PasswordResetTokenDoc extends Document {
  owner: Types.ObjectId;
  token: string;
  createAt: Date;
  compareToken: (token: string) => boolean;
}
