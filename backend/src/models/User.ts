import mongoose, { Document, Schema } from 'mongoose';

export enum UserRole {
  CUSTOMER = 'customer',
  RESTAURANT_OWNER = 'restaurant_owner',
  DELIVERY_DRIVER = 'delivery_driver',
  ADMIN = 'admin'
}

export interface IUser extends Document {
  name: string;
  phone: string;
  role: UserRole;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    location?: {
      type: string;
      coordinates: number[];
    };
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^\+[1-9]\d{1,14}$/, // E.164 format validation
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.CUSTOMER,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      location: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point',
        },
        coordinates: {
          type: [Number],
        },
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
userSchema.index({ phone: 1 }, { unique: true });
userSchema.index({ 'address.location': '2dsphere' });

export const User = mongoose.model<IUser>('User', userSchema); 