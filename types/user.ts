import { Document } from "mongoose";

export interface UserDoc extends Document {
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  comparePassword: (password: string) => boolean;
}
