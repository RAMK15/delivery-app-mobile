# Delivery App API Documentation

## Authentication

All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

## User Roles
- `customer`: Regular customer who can place orders
- `restaurant`: Restaurant owner who can manage restaurant and orders
- `driver`: Delivery driver who can manage deliveries
- `admin`: Administrator with full access

## API Endpoints

### Authentication

#### Send OTP
- **URL**: `/api/auth/send-otp`
- **Method**: `POST`
- **Auth**: None
- **Request Body**:
```json
{
  "phoneNumber": "+919783757303",
  "countryCode": "+91" // Optional
}
```
- **Success Response** (200):
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

#### Verify OTP
- **URL**: `/api/auth/verify-otp`
- **Method**: `POST`
- **Auth**: None
- **Request Body**:
```json
{
  "phoneNumber": "+919783757303",
  "otp": "123456",
  "name": "John Doe",
  "role": "customer" // Optional, defaults to customer
}
```
- **Success Response** (200):
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "phone": "+919783757303",
      "role": "customer"
    }
  },
  "message": "OTP verified successfully"
}
```

### Restaurants

#### Get All Restaurants
- **URL**: `/api/restaurants`
- **Method**: `GET`
- **Auth**: None
- **Query Parameters**:
  - `page`: Page number (optional)
  - `limit`: Items per page (optional)
  - `search`: Search term (optional)
- **Success Response** (200):
```json
{
  "success": true,
  "data": [{
    "_id": "restaurant_id",
    "name": "Restaurant Name",
    "description": "Description",
    "cuisineType": ["North Indian", "Chinese"],
    "priceRange": "$$",
    "rating": 4.5,
    "address": {
      "street": "123 Main St",
      "city": "City",
      "state": "State",
      "zipCode": "12345"
    },
    "location": {
      "type": "Point",
      "coordinates": [longitude, latitude]
    }
  }]
}
```

#### Get Restaurant by ID
- **URL**: `/api/restaurants/:id`
- **Method**: `GET`
- **Auth**: None
- **Success Response** (200):
```json
{
  "success": true,
  "data": {
    "_id": "restaurant_id",
    "name": "Restaurant Name",
    "description": "Description",
    "cuisineType": ["North Indian", "Chinese"],
    "priceRange": "$$",
    "rating": 4.5,
    "address": {
      "street": "123 Main St",
      "city": "City",
      "state": "State",
      "zipCode": "12345"
    },
    "location": {
      "type": "Point",
      "coordinates": [longitude, latitude]
    },
    "openingHours": [{
      "day": "Monday",
      "open": "09:00",
      "close": "22:00"
    }]
  }
}
```

#### Get Restaurant Menu
- **URL**: `/api/restaurants/:id/menu`
- **Method**: `GET`
- **Auth**: None
- **Success Response** (200):
```json
{
  "success": true,
  "data": [{
    "_id": "menu_item_id",
    "name": "Item Name",
    "description": "Description",
    "price": 199.99,
    "category": "main_course",
    "isAvailable": true
  }]
}
```

### Orders

#### Create Order
- **URL**: `/api/orders`
- **Method**: `POST`
- **Auth**: Required (Customer)
- **Request Body**:
```json
{
  "restaurantId": "restaurant_id",
  "items": [{
    "menuItem": "menu_item_id",
    "quantity": 2,
    "notes": "Extra spicy",
    "customizations": [{
      "name": "Extra cheese",
      "price": 30
    }]
  }],
  "deliveryAddress": {
    "street": "123 Main St",
    "city": "City",
    "state": "State",
    "zipCode": "12345"
  }
}
```
- **Success Response** (201):
```json
{
  "success": true,
  "data": {
    "_id": "order_id",
    "status": "pending",
    "totalAmount": 429.98,
    "subtotal": 399.98,
    "tax": 25,
    "deliveryFee": 5,
    "items": [/* order items */],
    "deliveryAddress": {/* address */},
    "createdAt": "2024-01-01T12:00:00Z"
  }
}
```

#### Get Order Details
- **URL**: `/api/orders/:id`
- **Method**: `GET`
- **Auth**: Required
- **Success Response** (200):
```json
{
  "success": true,
  "data": {
    "_id": "order_id",
    "status": "pending",
    "items": [/* order items */],
    "restaurant": {
      "_id": "restaurant_id",
      "name": "Restaurant Name"
    },
    "user": {
      "_id": "user_id",
      "name": "Customer Name",
      "phone": "+919783757303"
    },
    "deliveryAddress": {/* address */},
    "statusHistory": [{
      "status": "pending",
      "timestamp": "2024-01-01T12:00:00Z",
      "note": "Order placed"
    }]
  }
}
```

#### Update Order Status
- **URL**: `/api/orders/:id/status`
- **Method**: `PUT`
- **Auth**: Required (Admin or Restaurant)
- **Request Body**:
```json
{
  "status": "confirmed",
  "note": "Order confirmed by restaurant"
}
```
- **Success Response** (200):
```json
{
  "success": true,
  "data": {
    "_id": "order_id",
    "status": "confirmed",
    "statusHistory": [/* status history */]
  }
}
```

#### Get User Orders
- **URL**: `/api/orders/user/orders`
- **Method**: `GET`
- **Auth**: Required (Customer)
- **Success Response** (200):
```json
{
  "success": true,
  "data": [{
    "_id": "order_id",
    "status": "pending",
    "restaurant": {
      "_id": "restaurant_id",
      "name": "Restaurant Name"
    },
    "items": [/* order items */],
    "totalAmount": 429.98,
    "createdAt": "2024-01-01T12:00:00Z"
  }]
}
```

### Admin Routes

#### Populate Dummy Data
- **URL**: `/api/dummy/populate`
- **Method**: `POST`
- **Auth**: Required (Admin)
- **Success Response** (200):
```json
{
  "success": true,
  "data": {
    "restaurants": 100,
    "menuItems": 500
  }
}
``` 