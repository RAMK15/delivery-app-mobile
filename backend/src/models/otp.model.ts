import mongoose, { Document, Schema } from 'mongoose';

export interface IOTP extends Document {
  phoneNumber: string;
  otp: string;
  expiresAt: Date;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const otpSchema = new Schema({
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  otp: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Automatically remove expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OTP = mongoose.model<IOTP>('OTP', otpSchema); 