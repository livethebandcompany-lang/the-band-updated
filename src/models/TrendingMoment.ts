import mongoose, { Document, Schema } from 'mongoose';

export interface ITrendingMoment extends Document {
  instagramUrl: string;
  imageUrl: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const TrendingMomentSchema = new Schema<ITrendingMoment>(
  {
    instagramUrl: { type: String, default: '' },
    imageUrl: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.TrendingMoment || mongoose.model<ITrendingMoment>('TrendingMoment', TrendingMomentSchema);
