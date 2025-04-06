import mongoose, { Document, Schema } from 'mongoose';

export enum UserRole {
  CUSTOMER = 'customer',
  RESTAURANT = 'restaurant',
  DRIVER = 'driver',
  ADMIN = 'admin'
}

export interface IUser extends Document {
  name: string;
  phone: string;
  role: UserRole;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    location: {
      type: string;
      coordinates: number[];
    };
  };
  favorites: mongoose.Types.ObjectId[];
  isActive: boolean;
}

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.CUSTOMER
  },
  address: {
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    zipCode: { type: String, default: '' },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        default: [0, 0]  // [longitude, latitude]
      }
    }
  },
  favorites: [{
    type: Schema.Types.ObjectId,
    ref: 'Restaurant'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create geospatial index on location
userSchema.index({ 'address.location': '2dsphere' });

export const User = mongoose.model<IUser>('User', userSchema); 