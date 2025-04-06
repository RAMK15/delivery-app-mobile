import mongoose, { Document, Schema } from 'mongoose';

export interface IRestaurant extends Document {
  name: string;
  description: string;
  owner: mongoose.Types.ObjectId;
  cuisineType: string[];
  priceRange: string;
  rating: number;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  location: {
    type: string;
    coordinates: number[];
  };
  openingHours: {
    day: string;
    open: string;
    close: string;
  }[];
  phoneNumber: string;
  email: string;
  website?: string;
  images: string[];
  status: 'open' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

const restaurantSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cuisineType: {
    type: [String],
    required: true,
    validate: {
      validator: function(v: string[]) {
        return Array.isArray(v) && v.length > 0;
      },
      message: 'At least one cuisine type is required'
    }
  },
  priceRange: {
    type: String,
    enum: ['$', '$$', '$$$', '$$$$'],
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  openingHours: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true
    },
    open: {
      type: String,
      required: true
    },
    close: {
      type: String,
      required: true
    }
  }],
  phoneNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  website: String,
  images: [String],
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'closed'
  }
}, {
  timestamps: true
});

// Create geospatial index on location
restaurantSchema.index({ location: '2dsphere' });

export const Restaurant = mongoose.model<IRestaurant>('Restaurant', restaurantSchema); 