import mongoose, { Document, Schema } from 'mongoose';

export interface IHappyFace extends Document {
  src: string;
  title: string;
  desc: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const HappyFaceSchema = new Schema<IHappyFace>(
  {
    src: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    desc: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.HappyFace || mongoose.model<IHappyFace>('HappyFace', HappyFaceSchema);
