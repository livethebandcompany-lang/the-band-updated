import mongoose, { Document, Schema } from 'mongoose';

export interface IClientDocument extends Document {
  name: string;
  email?: string;
  phone: string;
  altPhone?: string;
  instagram?: string;
  type: 'individual' | 'corporate_hr' | 'wedding_planner' | 'venue_manager' | 'other';
  companyName?: string;
  anniversaryDate?: Date;
  totalBookings: number;
  totalSpent: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema = new Schema<IClientDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String, required: true },
    altPhone: { type: String },
    instagram: { type: String },
    type: { 
      type: String, 
      enum: ['individual', 'corporate_hr', 'wedding_planner', 'venue_manager', 'other'],
      default: 'individual',
    },
    companyName: { type: String },
    anniversaryDate: { type: Date },
    totalBookings: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    notes: { type: String },
  },
  { timestamps: true }
);

ClientSchema.index({ phone: 1 });
ClientSchema.index({ email: 1 });
ClientSchema.index({ type: 1 });

export default mongoose.models.Client || mongoose.model<IClientDocument>('Client', ClientSchema);
