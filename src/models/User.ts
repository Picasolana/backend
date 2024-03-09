import mongoose, { Document, Schema } from 'mongoose';

interface IUserDocument extends Document {
  currentSessionId: string;
  bestContestEntryIndex: number;
  email?: string;
  solanaAddress?: string;
  telegramHandle?: string;
}

const UserSchema: Schema = new Schema(
  {
    currentSessionId: { type: String, required: true, unique: true },
    bestContestEntryIndex: { type: Number, required: false },
    email: { type: String, required: true },
    solanaAddress: { type: String, required: false },
    telegramHandle: { type: String, required: false },
  },
  { timestamps: true }
);

const User = mongoose.model<IUserDocument>('User', UserSchema);

export default User;
