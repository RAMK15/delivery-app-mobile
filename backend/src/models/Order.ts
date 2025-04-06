import mongoose, { Document, Schema } from 'mongoose';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY_FOR_PICKUP = 'ready_for_pickup',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export interface IOrderItem {
  menuItem: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  customizations?: {
    name: string;
    option: string;
    price: number;
  }[];
  specialInstructions?: string;
}

export interface IOrder extends Document {
  customer: mongoose.Types.ObjectId;
  restaurant: mongoose.Types.ObjectId;
  driver?: mongoose.Types.ObjectId;
  items: IOrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  tip?: number;
  total: number;
  status: OrderStatus;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    location: {
      type: string;
      coordinates: number[];
    };
  };
  estimatedDeliveryTime?: Date;
  actualDeliveryTime?: Date;
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  statusHistory: {
    status: OrderStatus;
    timestamp: Date;
    note?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    driver: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    items: [{
      menuItem: {
        type: Schema.Types.ObjectId,
        ref: 'MenuItem',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
        min: 0,
      },
      customizations: [{
        name: String,
        option: String,
        price: Number,
      }],
      specialInstructions: String,
    }],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    tax: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveryFee: {
      type: Number,
      required: true,
      min: 0,
    },
    tip: {
      type: Number,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
    deliveryAddress: {
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
    estimatedDeliveryTime: Date,
    actualDeliveryTime: Date,
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    statusHistory: [{
      status: {
        type: String,
        enum: Object.values(OrderStatus),
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
      note: String,
    }],
  },
  {
    timestamps: true,
  }
);

// Create indexes for common queries
orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ restaurant: 1, status: 1 });
orderSchema.index({ driver: 1, status: 1 });

// Pre-save middleware to update status history
orderSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
    });
  }
  next();
});

export const Order = mongoose.model<IOrder>('Order', orderSchema); 