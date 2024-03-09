import mongoose, { Document, Schema } from 'mongoose';

interface IUserDocument extends Document {
  sessionId: string;
  bestContestEntryIndex: number;
  email?: string;
  solanaAddress?: string;
  telegramHandle?: string;
}

const UserSchema: Schema = new Schema(
  {
    sessionId: { type: String, required: true, unique: true },
    bestContestEntryIndex: { type: Number, required: true },
    bestScore: { type: Number, required: true },
    name: { type: String, required: true },
    email: { type: String, required: false },
    solanaAddress: { type: String, required: false },
    telegramHandle: { type: String, required: false },
  },
  { timestamps: true }
);

const User = mongoose.model<IUserDocument>('User', UserSchema);

export default User;
