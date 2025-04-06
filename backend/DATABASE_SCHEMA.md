# Database Schema Documentation

## Collections

### Users Collection

```typescript
{
  _id: ObjectId,
  name: string,
  phone: string,
  role: enum('customer', 'restaurant', 'driver', 'admin'),
  email?: string,
  address?: {
    street: string,
    city: string,
    state: string,
    zipCode: string,
    location: {
      type: 'Point',
      coordinates: [number, number] // [longitude, latitude]
    }
  },
  favorites?: [ObjectId], // References Restaurant collection
  createdAt: Date,
  updatedAt: Date
}

// Indexes
{
  phone: 1 // unique
}
```

### OTP Collection

```typescript
{
  _id: ObjectId,
  phone: string,
  otp: string,
  createdAt: Date,
  expiresAt: Date,
  verified: boolean
}

// Indexes
{
  phone: 1,
  createdAt: 1
}
```

### Restaurants Collection

```typescript
{
  _id: ObjectId,
  name: string,
  description: string,
  owner: ObjectId, // References User collection
  cuisineType: [string],
  priceRange: enum('$', '$$', '$$$', '$$$$'),
  rating: number,
  totalRatings: number,
  address: {
    street: string,
    city: string,
    state: string,
    zipCode: string
  },
  location: {
    type: 'Point',
    coordinates: [number, number] // [longitude, latitude]
  },
  openingHours: [{
    day: string,
    open: string, // HH:mm format
    close: string // HH:mm format
  }],
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}

// Indexes
{
  location: '2dsphere',
  owner: 1,
  cuisineType: 1
}
```

### Menu Items Collection

```typescript
{
  _id: ObjectId,
  restaurant: ObjectId, // References Restaurant collection
  name: string,
  description: string,
  price: number,
  category: string,
  imageUrl?: string,
  isVegetarian: boolean,
  isSpicy: boolean,
  customizationOptions?: [{
    name: string,
    options: [{
      name: string,
      price: number
    }]
  }],
  isAvailable: boolean,
  createdAt: Date,
  updatedAt: Date
}

// Indexes
{
  restaurant: 1,
  category: 1
}
```

### Orders Collection

```typescript
{
  _id: ObjectId,
  user: ObjectId, // References User collection
  restaurant: ObjectId, // References Restaurant collection
  driver?: ObjectId, // References User collection
  items: [{
    menuItem: ObjectId, // References MenuItem collection
    quantity: number,
    price: number, // Price per unit at time of order
    notes?: string,
    customizations?: [{
      name: string,
      price: number
    }]
  }],
  status: enum('pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'),
  statusHistory: [{
    status: string,
    timestamp: Date,
    note?: string
  }],
  deliveryAddress: {
    street: string,
    city: string,
    state: string,
    zipCode: string,
    location?: {
      type: 'Point',
      coordinates: [number, number]
    }
  },
  subtotal: number,
  tax: number,
  deliveryFee: number,
  totalAmount: number,
  paymentStatus: enum('pending', 'paid', 'failed', 'refunded'),
  paymentMethod?: string,
  createdAt: Date,
  updatedAt: Date
}

// Indexes
{
  user: 1,
  restaurant: 1,
  driver: 1,
  status: 1,
  createdAt: 1
}
```

### Reviews Collection

```typescript
{
  _id: ObjectId,
  user: ObjectId, // References User collection
  restaurant: ObjectId, // References Restaurant collection
  order: ObjectId, // References Order collection
  rating: number, // 1-5
  comment?: string,
  images?: [string],
  reply?: {
    text: string,
    timestamp: Date
  },
  createdAt: Date,
  updatedAt: Date
}

// Indexes
{
  restaurant: 1,
  user: 1,
  order: 1 // unique
}
```

## Relationships

1. User -> Restaurant (One-to-Many)
   - A user with role 'restaurant' can own multiple restaurants
   - Referenced by `owner` field in Restaurant collection

2. Restaurant -> Menu Items (One-to-Many)
   - A restaurant has multiple menu items
   - Referenced by `restaurant` field in MenuItem collection

3. User -> Orders (One-to-Many)
   - A user can have multiple orders
   - Referenced by `user` field in Order collection

4. Restaurant -> Orders (One-to-Many)
   - A restaurant can have multiple orders
   - Referenced by `restaurant` field in Order collection

5. User -> Reviews (One-to-Many)
   - A user can write multiple reviews
   - Referenced by `user` field in Review collection

6. Restaurant -> Reviews (One-to-Many)
   - A restaurant can have multiple reviews
   - Referenced by `restaurant` field in Review collection

7. Order -> Review (One-to-One)
   - An order can have one review
   - Referenced by `order` field in Review collection

## Notes

1. All collections use MongoDB's default `_id` field as the primary key
2. Timestamps (`createdAt` and `updatedAt`) are automatically managed by Mongoose
3. Geospatial indexes are used for location-based queries
4. Soft deletion is implemented using `isActive` flags where applicable
5. Enums are used to restrict certain field values
6. Optional fields are marked with `?`
7. All monetary values are stored as numbers in the smallest currency unit (e.g., cents) 