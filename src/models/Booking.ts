import mongoose, { Document, Schema } from 'mongoose';

export interface IBookingDocument extends Document {
  // Basic Details
  clientId?: mongoose.Types.ObjectId; // Link to CRM
  clientName: string;
  clientPhone: string;
  clientAltPhone?: string;
  clientEmail?: string;
  clientInstagram?: string;
  companyName?: string;
  billingName: string;

  // Event Details
  eventType: 'wedding' | 'mehendi' | 'haldi' | 'sangeet' | 'cocktail_night' | 'wedding_ceremony' | 'reception' | 'after_party' | 'birthday' | 'anniversary' | 'house_party' | 'reunion_party' | 'baby_shower' | 'corporate' | 'annual_corporate' | 'team_offsite' | 'award_night' | 'product_launch' | 'bachelorette' | 'brunch' | 'private_party' | 'other';
  performanceType: 'solo' | 'duet' | 'trio' | '4piece' | 'full_band';
  eventDate: Date;
  startTime: string;
  endTime: string;
  durationMinutes: number;

  // Location
  venueName: string;
  city: string;
  fullAddress?: string;
  googleMapsLink?: string;
  stayRequired: boolean;

  // Financial
  quotedAmount: number;
  finalAmount: number;
  discountAmount: number;
  paymentStatus: 'not_paid' | 'partial' | 'paid';
  paymentMode?: 'upi' | 'bank' | 'cash' | 'cheque';
  soundIncluded: boolean;
  paymentNotes?: string;
  taxEnabled: boolean;
  taxAmount: number;
  additionalChargesItems?: string;
  additionalChargesAmount: number;
  totalAmount: number;

  // Lead Source
  source: 'instagram' | 'referral' | 'google' | 'wedding_planner' | 'repeat_client' | 'b2b_sv' | 'meta_ad' | 'google_ad' | 'b2b' | 'other';
  campaignName?: string;
  referralName?: string;
  salesPerson: string;
  otherSalesPerson?: string;
  notes?: string;

  // System
  artistId?: mongoose.Types.ObjectId;
  artistIds?: mongoose.Types.ObjectId[];
  artistPayments?: { artistId: mongoose.Types.ObjectId; amount: number }[];
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  expiresAt?: Date;
  createdBy: mongoose.Types.ObjectId;
  
  // Payment Gateway
  razorpayLinkId?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;

  // Invoice
  invoiceNumber?: string;
  invoiceDate?: Date;
  invoicePdf?: string; // Base64 stored record for compliance

  // Completion Report
  completionReport?: {
    actualEndTime: string;
    teamMembers: { name: string; role: string }[];
    completedAt: Date;
  };
  
  // Feedback
  clientSatisfactionRating?: number; // 1 to 5
  clientFeedback?: string;
  feedbackSentAt?: Date;
  feedbackReminderSentAt?: Date;

  // Archive
  archived: boolean;
}

const BookingSchema = new Schema<IBookingDocument>(
  {
    clientId:       { type: Schema.Types.ObjectId, ref: 'Client' },
    clientName:     { type: String, required: true, trim: true },
    clientPhone:    { type: String, required: true },
    clientAltPhone: String,
    clientEmail:    { type: String, lowercase: true, trim: true },
    clientInstagram:String,
    companyName:    String,
    billingName:    { type: String, required: true },

    eventType: {
      type: String,
      required: true,
      enum: [
        'wedding','mehendi','haldi','sangeet','cocktail_night','wedding_ceremony',
        'reception','after_party','birthday','anniversary','house_party','reunion_party',
        'baby_shower','corporate','annual_corporate','team_offsite','award_night',
        'product_launch','bachelorette','brunch','private_party','other'
      ],
    },
    performanceType: {
      type: String,
      required: true,
      enum: ['solo','duet','trio','4piece','full_band'],
    },
    eventDate:       { type: Date, required: true },
    startTime:       { type: String, required: true }, // "HH:MM"
    endTime:         { type: String, required: true },
    durationMinutes: { type: Number, required: true },

    venueName:      { type: String, required: true },
    city:           { type: String, required: true },
    fullAddress:    String,
    googleMapsLink: String,
    stayRequired:   { type: Boolean, default: false },

    quotedAmount: { type: Number, required: true, min: 0 },
    finalAmount:  { type: Number, required: true, min: 0 },
    discountAmount: { type: Number, default: 0 },
    paymentStatus:{ type: String, enum: ['not_paid','partial','paid'], default: 'not_paid' },
    paymentMode:  { type: String, enum: ['upi','bank','cash','cheque'] },
    soundIncluded: { type: Boolean, default: false },
    paymentNotes: String,
    taxEnabled:   { type: Boolean, default: false },
    taxAmount:    { type: Number, default: 0 },
    additionalChargesItems: String,
    additionalChargesAmount: { type: Number, default: 0 },
    totalAmount:  { type: Number, required: true },

    source: {
      type: String,
      required: true,
      enum: ['instagram','referral','google','wedding_planner','repeat_client','b2b_sv','meta_ad','google_ad','b2b','other'],
    },
    campaignName:  String,
    referralName:  String,
    salesPerson: {
      type: String,
      default: 'Unassigned',
    },
    otherSalesPerson: String,
    notes: String,

    artistId:  { type: Schema.Types.ObjectId, ref: 'User' },
    artistIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    artistPayments: [{
      artistId: { type: Schema.Types.ObjectId, ref: 'User' },
      amount: { type: Number }
    }],
    status:    { type: String, enum: ['pending','confirmed','completed','cancelled'], default: 'pending' },
    expiresAt: { type: Date, index: { expires: 0 } },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    razorpayLinkId: String,
    razorpayOrderId: String,
    razorpayPaymentId: String,

    invoiceNumber: { type: String, unique: true, sparse: true },
    invoiceDate: Date,
    invoicePdf: String,

    completionReport: {
      actualEndTime: String,
      teamMembers: [{ name: String, role: String }],
      completedAt: Date,
    },

    clientSatisfactionRating: { type: Number, min: 1, max: 5 },
    clientFeedback: String,
    feedbackSentAt: Date,
    feedbackReminderSentAt: Date,

    archived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

BookingSchema.index({ invoiceNumber: 1 });
BookingSchema.index({ clientId: 1 });

BookingSchema.index({ eventDate: -1 });
BookingSchema.index({ artistId: 1 });
BookingSchema.index({ source: 1 });
BookingSchema.index({ salesPerson: 1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ city: 1 });
BookingSchema.index({ archived: 1 });

export default mongoose.models.Booking ||
  mongoose.model<IBookingDocument>('Booking', BookingSchema);
