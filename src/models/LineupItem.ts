import mongoose, { Document, Schema } from 'mongoose';

export interface ILineupItem extends Document {
  name: string;
  image: string;
  description: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const LineupItemSchema = new Schema<ILineupItem>(
  {
    name: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    description: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.LineupItem || mongoose.model<ILineupItem>('LineupItem', LineupItemSchema);
