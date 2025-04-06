import mongoose, { Document, Schema } from 'mongoose';

export interface IOTP extends Document {
  phoneNumber: string;
  otp: string;
  createdAt: Date;
  expiresAt: Date;
  verified: boolean;
}

const otpSchema = new Schema<IOTP>({
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
    // Storing in E.164 format: +[country code][number]
    match: /^\+[1-9]\d{1,14}$/,
  },
  otp: {
    type: String,
    required: true,
    length: 6,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // Document will be automatically deleted after 5 minutes
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  }
});

// Create index for quick lookups
otpSchema.index({ phoneNumber: 1, otp: 1 });

// Ensure only one active OTP per phone number
otpSchema.index(
  { phoneNumber: 1 }, 
  { 
    unique: true, 
    partialFilterExpression: { verified: false } 
  }
);

export const OTP = mongoose.model<IOTP>('OTP', otpSchema); 