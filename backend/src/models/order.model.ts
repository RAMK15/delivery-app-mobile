import mongoose, { Document, Schema } from 'mongoose';
import { OrderStatus } from '../controllers/order.controller';

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  restaurant: mongoose.Types.ObjectId;
  driver?: mongoose.Types.ObjectId;
  items: Array<{
    menuItem: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
    notes?: string;
    customizations?: Array<{
      name: string;
      price: number;
    }>;
  }>;
  status: OrderStatus;
  totalAmount: number;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  paymentStatus: 'pending' | 'completed' | 'failed';
  estimatedDeliveryTime?: Date;
  actualDeliveryTime?: Date;
  statusHistory: Array<{
    status: OrderStatus;
    timestamp: Date;
    note?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  restaurant: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  driver: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  items: [{
    menuItem: {
      type: Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    notes: String,
    customizations: [{
      name: String,
      price: Number
    }]
  }],
  status: {
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.PENDING
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  tax: {
    type: Number,
    required: true,
    min: 0
  },
  deliveryFee: {
    type: Number,
    required: true,
    min: 0
  },
  deliveryAddress: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    }
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  estimatedDeliveryTime: Date,
  actualDeliveryTime: Date,
  statusHistory: [{
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String
  }]
}, {
  timestamps: true
});

// Add middleware to update status history
orderSchema.pre('save', function(next) {
  const order = this as IOrder;
  if (order.isModified('status')) {
    order.statusHistory.push({
      status: order.status,
      timestamp: new Date()
    });
  }
  next();
});

export const Order = mongoose.model<IOrder>('Order', orderSchema); 