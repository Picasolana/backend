import mongoose, { Document, Schema } from 'mongoose';

export interface IContestEntryDocument extends Document {
  index: number;
  sessionId: string;
  image: string; // base64 encoded image
  prompt: string;
  score: number;
}

const ContestEntrySchema: Schema = new Schema(
  {
    index: { type: Number, required: true, index: true },
    sessionId: { type: String, required: true, index: true },
    image: { type: String, required: true },
    prompt: { type: String, required: true },
    score: { type: Number, required: true },
  },
  { timestamps: true }
);

const ContestEntry = mongoose.model<IContestEntryDocument>(
  'ContestEntry',
  ContestEntrySchema
);

export default ContestEntry;
