import mongoose, { Document, Schema } from 'mongoose';

export interface IInviteCodeDocument extends Document {
  code: string;
  role: 'admin' | 'subadmin' | 'artist' | 'sales_executive';
  allowedEmail: string;
  expiresAt: Date;
  isUsed: boolean;
  usedBy?: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const InviteCodeSchema = new Schema<IInviteCodeDocument>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    role: {
      type: String,
      enum: ['admin', 'subadmin', 'artist', 'sales_executive'],
      required: true,
    },
    allowedEmail: {
      type: String,
      required: [true, 'Allowed email is required'],
      lowercase: true,
      trim: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    usedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

InviteCodeSchema.index({ code: 1 });
InviteCodeSchema.index({ allowedEmail: 1 });
InviteCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

export default mongoose.models.InviteCode ||
  mongoose.model<IInviteCodeDocument>('InviteCode', InviteCodeSchema);
