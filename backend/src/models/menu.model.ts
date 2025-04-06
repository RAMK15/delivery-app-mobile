import mongoose, { Schema, Document } from 'mongoose';

export interface IMenuItem extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  restaurant: mongoose.Types.ObjectId;
  image?: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const menuItemSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for the menu item'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    trim: true,
    maxlength: [50, 'Category cannot be more than 50 characters']
  },
  restaurant: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: [true, 'Please provide a restaurant ID']
  },
  image: {
    type: String
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export const MenuItem = mongoose.model<IMenuItem>('MenuItem', menuItemSchema); 