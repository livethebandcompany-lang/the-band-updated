import mongoose from 'mongoose';

const InquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      default: '',
    },
    date: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'General Inquiry',
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'archived'],
      default: 'new',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent mongoose from recompiling the model if it already exists
export default mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);
