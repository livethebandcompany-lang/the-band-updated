import mongoose, { Document, Schema } from 'mongoose';

export interface IUserDocument extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  role: 'admin' | 'subadmin' | 'artist' | 'sales_executive';
  provider: 'credentials' | 'google';
  deleteOtp?: string;
  deleteOtpExpiry?: Date;
  inviteOtp?: string;
  inviteOtpExpiry?: Date;
  resetOtp?: string;
  resetOtpExpiry?: Date;
  isActive: boolean;
  
  // Artist specific fields
  adharCardNumber?: string;
  jobType?: string;
  genreStrengths?: string[];
  baseFee?: number;
  availabilityStatus?: 'available' | 'busy' | 'on_tour' | 'inactive';
  performanceRating?: number; // 1 to 5
  
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      enum: ['admin', 'subadmin', 'artist', 'sales_executive'],
      default: 'artist',
    },
    provider: {
      type: String,
      enum: ['credentials', 'google'],
      default: 'credentials',
    },
    deleteOtp: {
      type: String,
    },
    deleteOtpExpiry: {
      type: Date,
    },
    inviteOtp: {
      type: String,
    },
    inviteOtpExpiry: {
      type: Date,
    },
    resetOtp: {
      type: String,
    },
    resetOtpExpiry: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Artist specific fields
    adharCardNumber: { type: String },
    jobType: { type: String },
    genreStrengths: [{ type: String }],
    baseFee: { type: Number },
    availabilityStatus: { 
      type: String, 
      enum: ['available', 'busy', 'on_tour', 'inactive'],
      default: 'available' 
    },
    performanceRating: { type: Number, min: 1, max: 5 },
  },
  { timestamps: true }
);

// Index for TTL or searching if needed
// Removed redundant index declaration for 'email' since unique: true applies one.

export default mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);
