import mongoose, { Document, Schema } from 'mongoose';

interface ISession extends Document {
  id: string;
  isSaved: boolean;
}

const SessionSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    isSaved: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

const Session = mongoose.model<ISession>('Session', SessionSchema);

export default Session;
