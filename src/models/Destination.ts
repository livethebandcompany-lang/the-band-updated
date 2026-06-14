import mongoose, { Document, Schema } from 'mongoose';

export interface IDestination extends Document {
  name: string;
  icon: string;
  slug: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const DestinationSchema = new Schema<IDestination>(
  {
    name: { type: String, required: true, trim: true },
    icon: { type: String, required: true, default: 'MapPin' },
    slug: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Destination || mongoose.model<IDestination>('Destination', DestinationSchema);
