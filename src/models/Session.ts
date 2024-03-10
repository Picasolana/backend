import mongoose, { Document, Schema } from 'mongoose';

export interface ISession extends Document {
  sessionId: string;
  isSaved: boolean;
}

const SessionSchema: Schema = new Schema(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    isSaved: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

const Session = mongoose.model<ISession>('Session', SessionSchema);

export default Session;
