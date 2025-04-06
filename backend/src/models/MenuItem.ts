import mongoose, { Document, Schema } from 'mongoose';

export interface IMenuItem extends Document {
  restaurant: mongoose.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  spicyLevel: number;
  allergens: string[];
  preparationTime: number;
  isAvailable: boolean;
  customizationOptions?: {
    name: string;
    options: {
      name: string;
      price: number;
    }[];
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const menuItemSchema = new Schema<IMenuItem>(
  {
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
    },
    isVegetarian: {
      type: Boolean,
      default: false,
    },
    isVegan: {
      type: Boolean,
      default: false,
    },
    isGlutenFree: {
      type: Boolean,
      default: false,
    },
    spicyLevel: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    allergens: [{
      type: String,
    }],
    preparationTime: {
      type: Number,
      required: true,
      min: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    customizationOptions: [{
      name: {
        type: String,
        required: true,
      },
      options: [{
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      }],
    }],
  },
  {
    timestamps: true,
  }
);

// Create compound index for efficient querying
menuItemSchema.index({ restaurant: 1, category: 1 });

export const MenuItem = mongoose.model<IMenuItem>('MenuItem', menuItemSchema); 