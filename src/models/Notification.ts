import mongoose, { Document, Schema } from 'mongoose';

export interface INotificationDocument extends Document {
  title: string;
  message: string;
  type: 'inquiry' | 'payment' | 'booking' | 'system' | 'event_reminder';
  recipientId?: mongoose.Types.ObjectId;
  recipientRole?: string;
  isRead: boolean;
  link?: string;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotificationDocument>(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['inquiry', 'payment', 'booking', 'system', 'event_reminder'],
      required: true,
    },
    recipientId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    recipientRole: { type: String },
    isRead: { type: Boolean, default: false },
    link: { type: String },
  },
  { timestamps: true }
);

NotificationSchema.index({ createdAt: -1 });

export default mongoose.models.Notification ||
  mongoose.model<INotificationDocument>('Notification', NotificationSchema);
