import mongoose, { Document, Schema } from 'mongoose';

interface IUserDocument extends Document {
  id: number; // Unique identifier for the user
  email?: string; // Optional email address
  solanaAddress?: string; // Optional Solana blockchain address
}

const UserSchema: Schema = new Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    email: { type: String, required: false },
    solanaAddress: { type: String, required: false },
  },
  { timestamps: true }
);

const User = mongoose.model<IUserDocument>('User', UserSchema);

export default User;
