import mongoose, { Document, Schema } from 'mongoose';

interface IUserDocument extends Document {
  id: number;
  currentSessionId: string;
  email?: string; // Optional email address
  solanaAddress?: string; // Optional Solana blockchain address
  telegramHandle?: string; // Optional Telegram handle
}

const UserSchema: Schema = new Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    currentSessionId: { type: String, required: true },
    email: { type: String, required: false },
    solanaAddress: { type: String, required: false },
    telegramHandle: { type: String, required: false },
  },
  { timestamps: true }
);

const User = mongoose.model<IUserDocument>('User', UserSchema);

export default User;
