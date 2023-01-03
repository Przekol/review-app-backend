import { model, Schema } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { PasswordResetTokenDoc } from '../../types';

const passwordResetTokenSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
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

passwordResetTokenSchema.pre('save', async function (next) {
  if (this.isModified('token')) {
    this.token = await bcrypt.hash(this.token, 10);
  }
  next();
});
passwordResetTokenSchema.methods.compareToken = async function (token: string) {
  return await bcrypt.compare(token, this.token);
};

export const PasswordResetToken = model<PasswordResetTokenDoc>('PasswordResetToken', passwordResetTokenSchema);
