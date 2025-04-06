import mongoose, { Document, Schema } from 'mongoose';

export interface IRestaurant extends Document {
  name: string;
  owner: mongoose.Types.ObjectId;
  description: string;
  cuisine: string[];
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
  phone: string;
  email: string;
  openingHours: {
    day: string;
    open: string;
    close: string;
    isClosed: boolean;
  }[];
  rating: number;
  reviewCount: number;
  priceRange: string;
  isActive: boolean;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

const restaurantSchema = new Schema<IRestaurant>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    cuisine: [{
      type: String,
      required: true,
    }],
    address: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      zipCode: {
        type: String,
        required: true,
      },
      location: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point',
        },
        coordinates: {
          type: [Number],
          required: true,
        },
      },
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    openingHours: [{
      day: {
        type: String,
        required: true,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      },
      open: {
        type: String,
        required: true,
      },
      close: {
        type: String,
        required: true,
      },
      isClosed: {
        type: Boolean,
        default: false,
      },
    }],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    priceRange: {
      type: String,
      enum: ['$', '$$', '$$$', '$$$$'],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    images: [{
      type: String,
    }],
  },
  {
    timestamps: true,
  }
);

// Create a 2dsphere index for geospatial queries
restaurantSchema.index({ 'address.location': '2dsphere' });

export const Restaurant = mongoose.model<IRestaurant>('Restaurant', restaurantSchema); 