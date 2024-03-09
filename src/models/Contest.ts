import mongoose, { Document, Schema } from 'mongoose';

export interface IContestEntry {
  image: string; // base64 encoded image
  prompt: string;
  score: number;
}

export interface IContestEntryDocument extends Document {
  userId: number;
  image: string; // base64 encoded image
  prompt: string;
  score: number;
}

const ContestEntrySchema: Schema = new Schema(
  {
    userId: { type: Number, required: true, index: true },
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
